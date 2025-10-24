import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * Development: 2000 requests per 15 minutes
 * Production: 1000 requests per 15 minutes per IP (increased for testing phase)
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 1000 : 2000, // Doubled for testing phase
  message: {
    error: 'Previše zahteva sa ove IP adrese. Molimo pokušajte ponovo za nekoliko minuta.',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

/**
 * Stricter rate limiter for authentication endpoints
 * Development: 100 requests per 15 minutes
 * Production: 20 requests per 15 minutes per IP (increased for testing)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 20 : 100, // Increased for testing phase
  message: {
    error: 'Previše pokušaja prijavljivanja. Molimo pokušajte ponovo za nekoliko minuta.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Rate limiter for chat/messaging endpoints
 * Development: 1000 messages per 15 minutes
 * Production: 600 messages per 15 minutes per IP (increased for active chat users)
 */
export const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 600 : 1000, // Doubled for testing phase
  message: {
    error: 'Pošaljete previše poruka. Molimo usporite malo.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for post creation
 * Development: 100 posts per hour
 * Production: 30 posts per hour per IP (increased for testing)
 */
export const postCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'production' ? 30 : 100, // Tripled for testing phase
  message: {
    error: 'Kreirali ste previše objava. Molimo pokušajte ponovo kasnije.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
