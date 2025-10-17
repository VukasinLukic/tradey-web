import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import firestoreService from '../services/firestore.service';
import storageService from '../services/storage.service';
import { COLLECTIONS } from '../shared/constants/firebasePaths';
import { createUserProfileSchema, updateUserProfileSchema } from '../shared/constants/validationSchemas';
import { UserProfile } from '../shared/types';
import { asyncHandler } from '../middleware/errorHandler';

export class UserController {
  /**
   * POST /api/users
   * Create new user profile
   * Protected route - requires authentication
   */
  createUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;

    // Validate request body
    const validation = createUserProfileSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        errors: validation.error.issues,
      });
      return;
    }

    // Ensure the UID in the body matches the authenticated user
    if (validation.data.uid !== userId) {
      res.status(403).json({ error: 'Forbidden: You can only create your own profile' });
      return;
    }

    // Check if user already exists
    const existingUser = await firestoreService.getDocument<UserProfile>(COLLECTIONS.USERS, userId);
    if (existingUser) {
      res.status(409).json({ error: 'User profile already exists' });
      return;
    }

    // Check if username is unique
    const usersWithSameUsername = await firestoreService.queryDocuments(
      COLLECTIONS.USERS,
      {
        filters: [['username', '==', validation.data.username]],
        limit: 1,
      }
    );

    if (usersWithSameUsername.length > 0) {
      res.status(400).json({ error: 'Username already taken' });
      return;
    }

    // Create user profile
    const newUserProfile: UserProfile = {
      uid: validation.data.uid,
      username: validation.data.username,
      email: validation.data.email,
      phone: validation.data.phone,
      location: validation.data.location,
      createdAt: new Date(),
      following: [],
      likedPosts: [],
    };

    await firestoreService.setDocument(COLLECTIONS.USERS, userId, newUserProfile);

    res.status(201).json(newUserProfile);
  });
  /**
   * GET /api/users/:id
   * Get user profile by ID
   */
  getUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const user = await firestoreService.getDocument<UserProfile>(COLLECTIONS.USERS, id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Remove sensitive information if not the owner
    const isOwner = req.user?.uid === id;
    if (!isOwner) {
      // Remove sensitive fields for public view
      const publicUser = {
        uid: user.uid,
        username: user.username,
        location: user.location,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        createdAt: user.createdAt,
      };
      res.json(publicUser);
      return;
    }

    res.json(user);
  });

  /**
   * GET /api/users/:id/posts
   * Get all posts by a specific user
   */
  getUserPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { limit = 20 } = req.query;

    // Check if user exists
    const userExists = await firestoreService.documentExists(COLLECTIONS.USERS, id);
    if (!userExists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const posts = await firestoreService.queryDocuments(
      COLLECTIONS.POSTS,
      {
        filters: [['authorId', '==', id]],
        orderBy: { field: 'createdAt', direction: 'desc' },
        limit: Number(limit),
      }
    );

    res.json(posts);
  });

  /**
   * PUT /api/users/:id
   * Update user profile (owner only)
   * Protected route - requires authentication
   */
  updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.uid;

    console.log('🔍 UPDATE USER - Request received:');
    console.log('   User ID:', id);
    console.log('   Auth User ID:', userId);
    console.log('   Body:', req.body);
    console.log('   File:', req.file);

    // Check ownership
    if (id !== userId) {
      res.status(403).json({ error: 'Forbidden: You can only update your own profile' });
      return;
    }

    // Check if user exists
    const user = await firestoreService.getDocument<UserProfile>(COLLECTIONS.USERS, id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    console.log('✅ Current user data:', user);

    // Validate request body
    const validation = updateUserProfileSchema.safeParse(req.body);
    if (!validation.success) {
      console.error('❌ Validation failed:', validation.error.issues);
      res.status(400).json({
        error: 'Validation failed',
        errors: validation.error.issues,
      });
      return;
    }

    console.log('✅ Validation passed:', validation.data);

    // Handle avatar upload if provided
    let avatarUrl = validation.data.avatarUrl;
    if (req.file) {
      try {
        // Delete old avatar if exists
        if (user.avatarUrl) {
          await storageService.deleteImage(user.avatarUrl);
        }
        // Upload new avatar
        avatarUrl = await storageService.uploadAvatar(req.file, userId);
      } catch (error) {
        console.error('Error updating avatar:', error);
        // Continue with update even if avatar update fails
      }
    }

    // Check if username is being changed and ensure it's unique
    if (validation.data.username && validation.data.username !== user.username) {
      const usersWithSameUsername = await firestoreService.queryDocuments(
        COLLECTIONS.USERS,
        {
          filters: [['username', '==', validation.data.username]],
          limit: 1,
        }
      );

      if (usersWithSameUsername.length > 0) {
        res.status(400).json({ error: 'Username already taken' });
        return;
      }
    }

    // Update user
    const updateData: any = { ...validation.data };
    if (avatarUrl) {
      updateData.avatarUrl = avatarUrl;
    }

    await firestoreService.updateDocument(COLLECTIONS.USERS, id, updateData);

    // Fetch updated user
    const updatedUser = await firestoreService.getDocument<UserProfile>(COLLECTIONS.USERS, id);
    res.json(updatedUser);
  });

  /**
   * POST /api/users/:id/follow
   * Follow/unfollow a user
   * Protected route - requires authentication
   */
  toggleFollow = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params; // User to follow/unfollow
    const userId = req.user!.uid; // Current user

    // Prevent self-follow
    if (id === userId) {
      res.status(400).json({ error: 'You cannot follow yourself' });
      return;
    }

    // Check if target user exists
    const targetUserExists = await firestoreService.documentExists(COLLECTIONS.USERS, id);
    if (!targetUserExists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get current user's following list
    const currentUser = await firestoreService.getDocument<UserProfile>(COLLECTIONS.USERS, userId);
    const following = (currentUser?.following as string[]) || [];

    // Toggle follow
    if (following.includes(id)) {
      // Unfollow
      await firestoreService.arrayRemove(COLLECTIONS.USERS, userId, 'following', id);
      res.json({ following: false });
    } else {
      // Follow
      await firestoreService.arrayUnion(COLLECTIONS.USERS, userId, 'following', id);
      res.json({ following: true });
    }
  });

  /**
   * GET /api/users/:id/following
   * Get list of users that a user is following
   */
  getFollowing = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const user = await firestoreService.getDocument<UserProfile>(COLLECTIONS.USERS, id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const following = (user.following as string[]) || [];

    // Fetch full user profiles for following list
    const followingUsers = await Promise.all(
      following.map(async (userId) => {
        const followedUser = await firestoreService.getDocument<UserProfile>(COLLECTIONS.USERS, userId);
        if (followedUser) {
          return {
            uid: followedUser.uid,
            username: followedUser.username,
            avatarUrl: followedUser.avatarUrl,
            location: followedUser.location,
          };
        }
        return null;
      })
    );

    // Filter out null values
    const validFollowingUsers = followingUsers.filter(user => user !== null);

    res.json(validFollowingUsers);
  });

  /**
   * GET /api/users/:id/followers
   * Get list of users that follow this user
   */
  getFollowers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    // Check if target user exists
    const targetUser = await firestoreService.getDocument<UserProfile>(COLLECTIONS.USERS, id);
    if (!targetUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Query all users where following array contains this user's ID
    const allUsers = await firestoreService.queryDocuments<UserProfile>(
      COLLECTIONS.USERS,
      {
        filters: [['following', 'array-contains', id]],
      }
    );

    // Return simplified user data
    const followers = allUsers.map(user => ({
      uid: user.uid,
      username: user.username,
      avatarUrl: user.avatarUrl,
      location: user.location,
    }));

    res.json(followers);
  });

  /**
   * GET /api/users/:id/liked
   * Get list of posts that a user has liked
   * Protected route - owner only
   */
  getLikedPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.uid;

    // Check ownership
    if (id !== userId) {
      res.status(403).json({ error: 'Forbidden: You can only view your own liked posts' });
      return;
    }

    const user = await firestoreService.getDocument<UserProfile>(COLLECTIONS.USERS, id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const likedPosts = (user.likedPosts as string[]) || [];

    // Fetch full post data for liked posts
    const posts = await Promise.all(
      likedPosts.map(async (postId) => {
        return await firestoreService.getDocument(COLLECTIONS.POSTS, postId);
      })
    );

    // Filter out null values (deleted posts)
    const validPosts = posts.filter(post => post !== null);

    res.json(validPosts);
  });

  /**
   * GET /api/users/:id/feed
   * Get feed of posts from users that the current user follows
   * Protected route - requires authentication
   */
  getFeed = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;
    const { limit = 20 } = req.query;

    const user = await firestoreService.getDocument<UserProfile>(COLLECTIONS.USERS, userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const following = (user.following as string[]) || [];

    if (following.length === 0) {
      res.json([]);
      return;
    }

    // Firestore 'in' query limit is 10, so we need to batch if following > 10
    const batchSize = 10;
    let allPosts: any[] = [];

    for (let i = 0; i < following.length; i += batchSize) {
      const batch = following.slice(i, i + batchSize);

      const posts = await firestoreService.queryDocuments(
        COLLECTIONS.POSTS,
        {
          filters: [
            ['authorId', 'in', batch],
            ['isAvailable', '==', true]
          ],
          orderBy: { field: 'createdAt', direction: 'desc' },
          limit: Number(limit),
        }
      );

      allPosts = [...allPosts, ...posts];
    }

    // Sort all posts by createdAt and limit
    allPosts.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    const limitedPosts = allPosts.slice(0, Number(limit));

    res.json(limitedPosts);
  });
}

export default new UserController();
