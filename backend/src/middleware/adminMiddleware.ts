import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

/**
 * Hardcoded admin credentials
 * In production, this should be an environment variable
 * For now, using a simple username/password system
 */
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'tradey_admin_2025_secure', // Change this!
};

/**
 * Simple admin session storage (in-memory)
 * In production, use Redis or similar
 */
const adminSessions = new Set<string>();

/**
 * Admin authentication middleware
 * Checks if the request has valid admin credentials or session
 */
export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  // Check for admin session token
  const adminToken = req.headers['x-admin-token'] as string;

  if (adminToken && adminSessions.has(adminToken)) {
    // Valid admin session
    req.isAdmin = true;
    return next();
  }

  // No valid session
  res.status(403).json({
    error: 'Forbidden',
    message: 'Admin authentication required',
  });
}

/**
 * Admin login function
 * Validates credentials and creates session
 */
export function adminLogin(username: string, password: string): string | null {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // Generate simple session token
    const token = `admin_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    adminSessions.add(token);
    return token;
  }
  return null;
}

/**
 * Admin logout function
 * Removes session
 */
export function adminLogout(token: string): boolean {
  return adminSessions.delete(token);
}

// Extend AuthRequest type
declare module './authMiddleware' {
  interface AuthRequest {
    isAdmin?: boolean;
  }
}
