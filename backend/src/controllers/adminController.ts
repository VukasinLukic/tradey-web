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
   * DELETE /api/admin/users/:id
   * Delete a user account (admin action)
   * Protected route - requires admin
   */
  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Get user to delete avatar
    const user = await firestoreService.getDocument<any>(COLLECTIONS.USERS, id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Delete avatar from storage
    if (user.avatarUrl) {
      try {
        await storageService.deleteImage(user.avatarUrl);
      } catch (error) {
        console.error('Error deleting avatar:', error);
      }
    }

    // Delete all user's posts
    const userPosts = await firestoreService.queryDocuments<any>(
      COLLECTIONS.POSTS,
      {
        filters: [['authorId', '==', id]],
        limit: 1000,
      }
    );

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

    // Delete user from Firestore
    await firestoreService.deleteDocument(COLLECTIONS.USERS, id);

    res.json({ message: 'User and all their content deleted successfully' });
  });
}

export default new AdminController();
