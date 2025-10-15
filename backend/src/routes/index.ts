import { Router } from 'express';
import healthRouter from './health';
import postsRouter from './posts.routes';
import usersRouter from './users.routes';
import chatRouter from './chat.routes';

const router = Router();

// Health check route (no /api prefix needed here)
router.use('/', healthRouter);

// API routes
router.use('/posts', postsRouter);
router.use('/users', usersRouter);
router.use('/chats', chatRouter);

export default router;
