/**
 * Utility to combine class names with conditional logic
 */
export function cn(...classNames: (string | undefined | boolean)[]) {
  return classNames.filter(Boolean).join(' ');
} 