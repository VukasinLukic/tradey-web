import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api/health
 * Health check endpoint for monitoring and Docker healthcheck
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'TRADEY Backend API',
    version: '1.0.0',
  });
});

export default router;
