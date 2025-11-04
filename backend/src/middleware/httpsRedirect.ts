import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to enforce HTTPS in production environment
 * Redirects HTTP requests to HTTPS to prevent man-in-the-middle attacks
 */
export function httpsRedirect(req: Request, res: Response, next: NextFunction): void {
  // Only enforce HTTPS in production
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  // Check if request is already HTTPS
  // Use x-forwarded-proto header (set by reverse proxies like Nginx, Heroku, AWS)
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;

  if (protocol === 'https') {
    // Request is already HTTPS, continue
    return next();
  }

  // Redirect HTTP to HTTPS
  const httpsUrl = `https://${req.headers.host}${req.url}`;
  console.log(`🔒 Redirecting HTTP to HTTPS: ${httpsUrl}`);
  res.redirect(301, httpsUrl);
}
