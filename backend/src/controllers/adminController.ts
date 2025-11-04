import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { adminLogin, adminLogout } from '../middleware/adminMiddleware';
import firestoreService from '../services/firestore.service';
import storageService from '../services/storage.service';
import { COLLECTIONS } from '../shared/constants/firebasePaths';

export class AdminController {
  /**
   * POST /api/admin/login
   * Admin login endpoint
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password required' });
      return;
    }

    const token = adminLogin(username, password);

    if (token) {
      res.json({
        message: 'Login successful',
        token,
        expiresIn: '24h', // Not really implemented, just for frontend
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  /**
   * POST /api/admin/logout
   * Admin logout endpoint
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    const token = req.headers['x-admin-token'] as string;

    if (token) {
      adminLogout(token);
    }

    res.json({ message: 'Logout successful' });
  });

  /**
   * GET /api/admin/stats
   * Get platform statistics
   * Protected route - requires admin
   */
  getStats = asyncHandler(async (req: Request, res: Response) => {
    // Get counts
    const users = await firestoreService.queryDocuments(COLLECTIONS.USERS, { limit: 10000 });
    const posts = await firestoreService.queryDocuments(COLLECTIONS.POSTS, { limit: 10000 });
    const reports = await firestoreService.queryDocuments(COLLECTIONS.REPORTS, { limit: 10000 });

    const pendingReports = reports.filter((r: any) => r.status === 'pending').length;
    const bannedUsers = users.filter((u: any) => u.isBanned).length;

    res.json({
      totalUsers: users.length,
      totalPosts: posts.length,
      totalReports: reports.length,
      pendingReports,
      bannedUsers,
    });
  });

  /**
   * DELETE /api/admin/posts/:id
   * Delete a post (admin action)
   * Protected route - requires admin
   */
  deletePost = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Get post to delete images
    const post = await firestoreService.getDocument<any>(COLLECTIONS.POSTS, id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Delete images from storage
    if (post.images && Array.isArray(post.images)) {
      for (const imageUrl of post.images) {
        try {
          await storageService.deleteImage(imageUrl);
        } catch (error) {
          console.error('Error deleting image:', error);
          // Continue even if image deletion fails
        }
      }
    }

    // Delete post from Firestore
    await firestoreService.deleteDocument(COLLECTIONS.POSTS, id);

    res.json({ message: 'Post deleted successfully' });
  });

  /**
   * POST /api/admin/users/:id/ban
   * Ban a user and delete all their content
   * Protected route - requires admin
   */
  toggleBan = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Get user
    const user = await firestoreService.getDocument<any>(COLLECTIONS.USERS, id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    console.log(`🔨 Starting ban process for user: ${id}`);

    // 1. Delete avatar from storage
    if (user.avatarUrl) {
      try {
        await storageService.deleteImage(user.avatarUrl);
        console.log('✅ Avatar deleted');
      } catch (error) {
        console.error('Error deleting avatar:', error);
      }
    }

    // 2. Delete all user's posts and their images
    const userPosts = await firestoreService.queryDocuments<any>(
      COLLECTIONS.POSTS,
      {
        filters: [['authorId', '==', id]],
        limit: 1000,
      }
    );

    console.log(`📦 Found ${userPosts.length} posts to delete`);

    for (const post of userPosts) {
      // Delete post images
      if (post.images && Array.isArray(post.images)) {
        for (const imageUrl of post.images) {
          try {
            await storageService.deleteImage(imageUrl);
          } catch (error) {
            console.error('Error deleting post image:', error);
          }
        }
      }
      // Delete post
      await firestoreService.deleteDocument(COLLECTIONS.POSTS, post.id);
    }

    console.log('✅ All posts deleted');

    // 3. Delete all chats where user is a participant
    const allChats = await firestoreService.queryDocuments<any>(
      COLLECTIONS.CHATS,
      { limit: 10000 }
    );

    const userChats = allChats.filter((chat: any) =>
      chat.participants?.includes(id)
    );

    console.log(`💬 Found ${userChats.length} chats to delete`);

    for (const chat of userChats) {
      await firestoreService.deleteDocument(COLLECTIONS.CHATS, chat.id);
    }

    console.log('✅ All chats deleted');

    // 4. Remove user from other users' following/followers arrays
    const allUsers = await firestoreService.queryDocuments<any>(
      COLLECTIONS.USERS,
      { limit: 10000 }
    );

    for (const otherUser of allUsers) {
      let needsUpdate = false;
      const updates: any = {};

      if (otherUser.following?.includes(id)) {
        updates.following = otherUser.following.filter((uid: string) => uid !== id);
        needsUpdate = true;
      }

      if (otherUser.followers?.includes(id)) {
        updates.followers = otherUser.followers.filter((uid: string) => uid !== id);
        needsUpdate = true;
      }

      if (needsUpdate) {
        await firestoreService.updateDocument(COLLECTIONS.USERS, otherUser.uid, updates);
      }
    }

    console.log('✅ Removed from following/followers lists');

    // 5. Delete user profile
    await firestoreService.deleteDocument(COLLECTIONS.USERS, id);

    console.log('✅ User profile deleted');
    console.log(`🔨 Ban complete for user: ${id}`);

    res.json({
      message: 'User banned and all content deleted successfully',
      deletedPosts: userPosts.length,
      deletedChats: userChats.length
    });
  });

  /**
   * DELETE /api/admin/users/:id
   * Delete a user account (admin action) - kept for backwards compatibility
   * Protected route - requires admin
   */
  deleteUser = this.toggleBan;
}

export default new AdminController();
