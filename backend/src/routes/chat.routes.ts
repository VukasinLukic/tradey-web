import { Router } from 'express';
import chatController from '../controllers/chatController';
import { authenticate } from '../middleware/authMiddleware';
import { chatLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * All chat routes are protected (require authentication)
 */

// GET /api/chats - Get all chats for user
router.get('/', authenticate, chatController.getChats);

// POST /api/chats - Create new chat
router.post('/', authenticate, chatController.createChat);

// GET /api/chats/:chatId - Get specific chat
router.get('/:chatId', authenticate, chatController.getChat);

// DELETE /api/chats/:chatId - Delete chat
router.delete('/:chatId', authenticate, chatController.deleteChat);

// GET /api/chats/:chatId/messages - Get messages (paginated)
router.get('/:chatId/messages', authenticate, chatController.getMessages);

// POST /api/chats/:chatId/messages - Send message
router.post('/:chatId/messages', authenticate, chatLimiter, chatController.sendMessage);

// POST /api/chats/:chatId/messages/:messageId/read - Mark message as read
router.post('/:chatId/messages/:messageId/read', authenticate, chatController.markMessageAsRead);

// POST /api/chats/:chatId/read-all - Mark all messages as read
router.post('/:chatId/read-all', authenticate, chatController.markAllAsRead);

export default router;
