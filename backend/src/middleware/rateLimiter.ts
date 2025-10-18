import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * Development: 1000 requests per 15 minutes
 * Production: 500 requests per 15 minutes per IP (increased for active users)
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 500 : 1000, // Increased for production
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

/**
 * Stricter rate limiter for authentication endpoints
 * Development: 100 requests per 15 minutes
 * Production: 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 5 : 100, // Higher limit for development
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Rate limiter for chat/messaging endpoints
 * Development: 500 messages per 15 minutes
 * Production: 300 messages per 15 minutes per IP (increased for active chat users)
 */
export const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 300 : 500, // Increased for production
  message: {
    error: 'Too many messages sent, please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for post creation
 * Development: 100 posts per hour
 * Production: 10 posts per hour per IP
 */
export const postCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'production' ? 10 : 100, // Higher limit for development
  message: {
    error: 'Too many posts created, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
