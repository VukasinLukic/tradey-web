import type { AxiosError } from 'axios';

/**
 * Enhanced error type with user-friendly message
 */
export interface ApiError extends AxiosError {
  userMessage?: string;
  originalMessage?: string;
}

/**
 * Helper function to extract user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'userMessage' in error) {
    return (error as ApiError).userMessage || 'Nešto je pošlo po zlu';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Nešto je pošlo po zlu';
}
