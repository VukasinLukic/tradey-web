import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * Development: 3000 requests per 15 minutes (for testing)
 * Production: 1500 requests per 15 minutes per IP
 *
 * This allows ~1.67 requests per second on average, which is sufficient for:
 * - Normal browsing and interaction
 * - Real-time features like chat
 * - Multiple concurrent users from same network (offices, cafes)
 *
 * Still prevents DoS attacks (150,000 requests/day per IP = abusive)
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 1500 : 3000,
  message: {
    error: 'Previše zahteva sa ove IP adrese. Molimo pokušajte ponovo za nekoliko minuta.',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

/**
 * Stricter rate limiter for authentication endpoints
 * Development: 100 requests per 15 minutes (for testing)
 * Production: 30 requests per 15 minutes per IP
 *
 * Allows legitimate users to:
 * - Try different credentials (forgot password, typos)
 * - Switch between accounts
 * - Recover from errors
 *
 * Still prevents brute force attacks effectively
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 30 : 100,
  message: {
    error: 'Previše pokušaja prijavljivanja. Molimo pokušajte ponovo za nekoliko minuta.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Rate limiter for chat/messaging endpoints
 * Development: 1500 messages per 15 minutes (for testing)
 * Production: 900 messages per 15 minutes per IP
 *
 * Allows ~1 message per second on average, perfect for:
 * - Active conversations (normal typing speed)
 * - Multiple simultaneous chats
 * - Image/file uploads in chat
 *
 * Prevents chat spam and abuse
 */
export const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 900 : 1500,
  message: {
    error: 'Pošaljete previše poruka. Molimo usporite malo.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for post creation
 * Development: 150 posts per hour (for testing)
 * Production: 50 posts per hour per IP
 *
 * Generous limit allowing legitimate sellers to:
 * - Bulk upload inventory (new sellers, restocking)
 * - Edit/repost items
 * - Test posting features
 *
 * Still prevents spam and abuse (1200 posts/day is excessive for any real user)
 */
export const postCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'production' ? 50 : 150,
  message: {
    error: 'Kreirali ste previše objava. Molimo pokušajte ponovo kasnije.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
