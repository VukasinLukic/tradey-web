import { Router } from 'express';
import reportController from '../controllers/reportController';
import { authenticate } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

/**
 * Protected Routes (require authentication)
 */

// POST /api/reports - Create new report
router.post('/', authenticate, reportController.createReport);

// GET /api/reports - Get all reports (admin only)
router.get('/', requireAdmin, reportController.getReports);

// PUT /api/reports/:id - Update report status (admin only)
router.put('/:id', requireAdmin, reportController.updateReport);

export default router;
