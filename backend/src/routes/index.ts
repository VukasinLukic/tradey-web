import { Router } from 'express';
import healthRouter from './health';
import postsRouter from './posts.routes';
import usersRouter from './users.routes';
import chatRouter from './chat.routes';
import reportRouter from './report.routes';
import adminRouter from './admin.routes';

const router = Router();

// Health check route (no /api prefix needed here)
router.use('/', healthRouter);

// API routes
router.use('/posts', postsRouter);
router.use('/users', usersRouter);
router.use('/chats', chatRouter);
router.use('/reports', reportRouter);
router.use('/admin', adminRouter);

export default router;
