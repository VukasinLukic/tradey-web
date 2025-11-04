import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize user-generated text content to prevent XSS attacks
 * Removes HTML tags and dangerous content while preserving safe text
 */
export function sanitizeText(input: string | undefined | null): string {
  if (!input) return '';

  // Trim whitespace
  const trimmed = input.trim();

  // DOMPurify configuration for plain text (strip all HTML)
  const clean = DOMPurify.sanitize(trimmed, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true, // Keep text content
  });

  return clean.trim();
}

/**
 * Sanitize rich text content (allows some safe HTML tags)
 * Use this for content that may include basic formatting
 */
export function sanitizeRichText(input: string | undefined | null): string {
  if (!input) return '';

  const trimmed = input.trim();

  // Allow only safe formatting tags
  const clean = DOMPurify.sanitize(trimmed, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  return clean.trim();
}

/**
 * Sanitize object properties recursively
 * Useful for sanitizing entire request bodies
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  fieldsToSanitize: (keyof T)[]
): T {
  const sanitized = { ...obj };

  for (const field of fieldsToSanitize) {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeText(sanitized[field] as string) as T[keyof T];
    }
  }

  return sanitized;
}
