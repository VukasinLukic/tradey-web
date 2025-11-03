import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import firestoreService from '../services/firestore.service';
import { COLLECTIONS } from '../shared/constants/firebasePaths';
import { sendMessageSchema, createChatSchema } from '../shared/constants/validationSchemas';
import { Chat, Message } from '../shared/types';
import { asyncHandler } from '../middleware/errorHandler';
import { db } from '../config/firebaseAdmin';
import admin from 'firebase-admin';

export class ChatController {
  /**
   * GET /api/chats
   * Get all chats for the authenticated user
   * Protected route - requires authentication
   */
  getChats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;

    // Get chats where user is a participant
    const allChats = await firestoreService.queryDocuments<Chat>(
      COLLECTIONS.CHATS,
      {
        filters: [['participants', 'array-contains', userId]],
        orderBy: { field: 'updatedAt', direction: 'desc' },
      }
    );

    // Filter out chats that user has deleted (soft delete)
    const chats = allChats.filter(chat => {
      const deletedFor = (chat.deletedFor as string[]) || [];
      return !deletedFor.includes(userId);
    });

    res.json(chats);
  });

  /**
   * GET /api/chats/:chatId
   * Get a specific chat by ID
   * Protected route - requires authentication and participation
   */
  getChat = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { chatId } = req.params;
    const userId = req.user!.uid;

    const chat = await firestoreService.getDocument<Chat>(COLLECTIONS.CHATS, chatId);

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    // Check if user is a participant
    if (!chat.participants.includes(userId)) {
      res.status(403).json({ error: 'Forbidden: You are not a participant in this chat' });
      return;
    }

    res.json(chat);
  });

  /**
   * POST /api/chats
   * Create a new chat with another user
   * Protected route - requires authentication
   */
  createChat = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;

    // Validate request body
    const validation = createChatSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        errors: validation.error.issues,
      });
      return;
    }

    const { participantId } = validation.data;

    // Prevent chat with self
    if (participantId === userId) {
      res.status(400).json({ error: 'You cannot create a chat with yourself' });
      return;
    }

    // Check if participant exists
    const participantExists = await firestoreService.documentExists(COLLECTIONS.USERS, participantId);
    if (!participantExists) {
      res.status(404).json({ error: 'Participant not found' });
      return;
    }

    // Check if chat already exists between these two users
    const existingChats = await firestoreService.queryDocuments<Chat>(
      COLLECTIONS.CHATS,
      {
        filters: [['participants', 'array-contains', userId]],
      }
    );

    const existingChat = existingChats.find(chat =>
      chat.participants.includes(participantId) && chat.participants.length === 2
    );

    if (existingChat) {
      res.json(existingChat);
      return;
    }

    // Create new chat
    const newChat = {
      participants: [userId, participantId],
      lastMessage: '',
      lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const createdChat = await firestoreService.createDocument(COLLECTIONS.CHATS, newChat);

    res.status(201).json(createdChat);
  });

  /**
   * GET /api/chats/:chatId/messages
   * Get messages from a chat (paginated)
   * Protected route - requires authentication and participation
   */
  getMessages = async (req: AuthRequest, res: Response) => {
    const { chatId } = req.params;
    const userId = req.user!.uid;
    const { limit = 50, cursor } = req.query;

    try {
      // Check if chat exists and user is a participant
      const chat = await firestoreService.getDocument<Chat>(COLLECTIONS.CHATS, chatId);
      
      if (!chat) {
        res.status(404).json({ error: 'Chat not found' });
        return;
      }

      if (!chat.participants.includes(userId)) {
        res.status(403).json({ error: 'Forbidden: You are not a participant in this chat' });
        return;
      }

      // Query messages
      let query = db
        .collection(COLLECTIONS.CHATS)
        .doc(chatId)
        .collection(COLLECTIONS.MESSAGES)
        .orderBy('createdAt', 'desc')
        .limit(Number(limit));

    // Apply cursor for pagination
    if (cursor) {
      const cursorDoc = await db
        .collection(COLLECTIONS.CHATS)
        .doc(chatId)
        .collection(COLLECTIONS.MESSAGES)
        .doc(cursor as string)
        .get();

      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

      const snapshot = await query.get();
      
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      // Get next cursor (last message ID)
      const nextCursor = messages.length > 0 ? messages[messages.length - 1].id : null;

      res.json({
        messages,
        nextCursor,
        hasMore: messages.length === Number(limit),
      });
    } catch (error: any) {
      console.error('❌ ERROR in getMessages:');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      
      // Check if it's a Firestore index error
      if (error.code === 9 || error.message?.includes('index') || error.message?.includes('Index')) {
        console.error('\n⚠️⚠️⚠️  FIRESTORE INDEX REQUIRED  ⚠️⚠️⚠️\n');
        console.error('📝 CREATE INDEX BY CLICKING THIS LINK:');
        
        if (error.message) {
          const indexUrlMatch = error.message.match(/(https:\/\/console\.firebase\.google\.com\/[^\s]+)/);
          if (indexUrlMatch) {
            console.error(`\n✅ ${indexUrlMatch[1]}\n`);
          }
        }
        
        console.error('OR manually:');
        console.error('1. Go to: https://console.firebase.google.com/project/vibe-hakaton/firestore/indexes');
        console.error('2. Click "Create Index"');
        console.error('3. Collection ID: messages');
        console.error('4. ✅ CHECK "Collection group"');
        console.error('5. Field: createdAt, Order: Descending');
        console.error('6. Click "Create"\n');
        
        res.status(500).json({ 
          error: 'Firestore index required. Check server console for instructions.',
          details: error.message 
        });
        return;
      }
      
      // Generic error
      res.status(500).json({ 
        error: 'Failed to fetch messages',
        details: error.message 
      });
    }
  };

  /**
   * POST /api/chats/:chatId/messages
   * Send a message in a chat
   * Protected route - requires authentication and participation
   */
  sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { chatId } = req.params;
    const userId = req.user!.uid;

    // Check if chat exists and user is a participant
    const chat = await firestoreService.getDocument<Chat>(COLLECTIONS.CHATS, chatId);
    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    if (!chat.participants.includes(userId)) {
      res.status(403).json({ error: 'Forbidden: You are not a participant in this chat' });
      return;
    }

    // Validate request body
    const validation = sendMessageSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        errors: validation.error.issues,
      });
      return;
    }

    const { text } = validation.data;

    // Create message
    const newMessage = {
      chatId,
      senderId: userId,
      text,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      readBy: [userId], // Sender has read it
    };

    const messageRef = await db
      .collection(COLLECTIONS.CHATS)
      .doc(chatId)
      .collection(COLLECTIONS.MESSAGES)
      .add(newMessage);

    // Update chat's last message
    await firestoreService.updateDocument(COLLECTIONS.CHATS, chatId, {
      lastMessage: text,
      lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Fetch created message
    const messageDoc = await messageRef.get();
    const message = {
      id: messageDoc.id,
      ...messageDoc.data(),
    };

    res.status(201).json(message);
  });

  /**
   * POST /api/chats/:chatId/messages/:messageId/read
   * Mark a message as read
   * Protected route - requires authentication and participation
   */
  markMessageAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { chatId, messageId } = req.params;
    const userId = req.user!.uid;

    // Check if chat exists and user is a participant
    const chat = await firestoreService.getDocument<Chat>(COLLECTIONS.CHATS, chatId);
    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    if (!chat.participants.includes(userId)) {
      res.status(403).json({ error: 'Forbidden: You are not a participant in this chat' });
      return;
    }

    // Update message readBy array
    const messageRef = db
      .collection(COLLECTIONS.CHATS)
      .doc(chatId)
      .collection(COLLECTIONS.MESSAGES)
      .doc(messageId);

    await messageRef.update({
      readBy: admin.firestore.FieldValue.arrayUnion(userId),
    });

    res.json({ success: true });
  });

  /**
   * POST /api/chats/:chatId/read-all
   * Mark all messages in a chat as read
   * Protected route - requires authentication and participation
   */
  markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { chatId } = req.params;
    const userId = req.user!.uid;

    // Check if chat exists and user is a participant
    const chat = await firestoreService.getDocument<Chat>(COLLECTIONS.CHATS, chatId);
    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    if (!chat.participants.includes(userId)) {
      res.status(403).json({ error: 'Forbidden: You are not a participant in this chat' });
      return;
    }

    // Get all messages (we'll filter unread ones)
    const messagesSnapshot = await db
      .collection(COLLECTIONS.CHATS)
      .doc(chatId)
      .collection(COLLECTIONS.MESSAGES)
      .get();

    // Filter to get only unread messages for this user
    const unreadDocs = messagesSnapshot.docs.filter(doc => {
      const data = doc.data();
      const readBy = data.readBy || [];
      return !readBy.includes(userId);
    });

    // Update unread messages in batch
    if (unreadDocs.length > 0) {
      const batch = db.batch();
      unreadDocs.forEach(doc => {
        batch.update(doc.ref, {
          readBy: admin.firestore.FieldValue.arrayUnion(userId),
        });
      });

      await batch.commit();
    }

    res.json({ success: true, messagesMarked: unreadDocs.length });
  });

  /**
   * DELETE /api/chats/:chatId
   * Delete a chat (removes it for the current user only)
   * Protected route - requires authentication and participation
   */
  deleteChat = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { chatId } = req.params;
    const userId = req.user!.uid;

    // Check if chat exists and user is a participant
    const chat = await firestoreService.getDocument<Chat>(COLLECTIONS.CHATS, chatId);
    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    if (!chat.participants.includes(userId)) {
      res.status(403).json({ error: 'Forbidden: You are not a participant in this chat' });
      return;
    }

    // Implement soft delete using deletedFor field
    // This tracks which users have "deleted" the chat from their view
    const deletedFor = (chat.deletedFor as string[]) || [];

    if (!deletedFor.includes(userId)) {
      // Add user to deletedFor array
      await firestoreService.arrayUnion(COLLECTIONS.CHATS, chatId, 'deletedFor', userId);
    }

    // Check if both participants have deleted the chat
    const allParticipantsDeleted = chat.participants.every((p: string) =>
      [...deletedFor, userId].includes(p)
    );

    if (allParticipantsDeleted) {
      // If both users have deleted it, permanently delete the chat and messages
      try {
        const messagesSnapshot = await db
          .collection(COLLECTIONS.CHATS)
          .doc(chatId)
          .collection(COLLECTIONS.MESSAGES)
          .get();

        const batch = db.batch();
        messagesSnapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();

        // Delete chat document
        await firestoreService.deleteDocument(COLLECTIONS.CHATS, chatId);

        res.json({ message: 'Chat permanently deleted', permanent: true });
      } catch (error) {
        console.error('Error permanently deleting chat:', error);
        res.json({ message: 'Chat hidden from your view', permanent: false });
      }
    } else {
      res.json({ message: 'Chat hidden from your view', permanent: false });
    }
  });
}

export default new ChatController();
