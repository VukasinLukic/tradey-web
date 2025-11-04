/**
 * Sanitize user-generated text content to prevent XSS attacks
 * Removes HTML tags and dangerous content while preserving safe text
 *
 * This uses a simple regex-based approach to strip HTML tags
 * For production with rich text, consider using a proper HTML sanitizer
 */
export function sanitizeText(input: string | undefined | null): string {
  if (!input) return '';

  // Trim whitespace
  let clean = input.trim();

  // Remove all HTML tags using regex
  clean = clean.replace(/<[^>]*>/g, '');

  // Remove common XSS patterns
  clean = clean.replace(/javascript:/gi, '');
  clean = clean.replace(/on\w+\s*=/gi, '');
  clean = clean.replace(/data:/gi, '');
  clean = clean.replace(/vbscript:/gi, '');

  // Decode HTML entities to prevent double encoding
  clean = clean
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&');

  // Remove the decoded tags again (in case of double encoding)
  clean = clean.replace(/<[^>]*>/g, '');

  return clean.trim();
}

/**
 * Sanitize rich text content (allows some safe HTML tags)
 * Use this for content that may include basic formatting
 *
 * For production, use a proper HTML sanitizer library
 */
export function sanitizeRichText(input: string | undefined | null): string {
  if (!input) return '';

  let clean = input.trim();

  // Remove dangerous tags and attributes
  clean = clean.replace(/<script[^>]*>.*?<\/script>/gi, '');
  clean = clean.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
  clean = clean.replace(/<object[^>]*>.*?<\/object>/gi, '');
  clean = clean.replace(/<embed[^>]*>/gi, '');
  clean = clean.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  clean = clean.replace(/javascript:/gi, '');

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
