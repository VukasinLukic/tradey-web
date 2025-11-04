import { Router } from 'express';
import adminController from '../controllers/adminController';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

/**
 * Public admin routes
 */

// POST /api/admin/login - Admin login
router.post('/login', adminController.login);

// POST /api/admin/logout - Admin logout
router.post('/logout', adminController.logout);

/**
 * Protected admin routes (require admin authentication)
 */

// GET /api/admin/stats - Get platform statistics
router.get('/stats', requireAdmin, adminController.getStats);

// DELETE /api/admin/posts/:id - Delete post
router.delete('/posts/:id', requireAdmin, adminController.deletePost);

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', requireAdmin, adminController.deleteUser);

export default router;
