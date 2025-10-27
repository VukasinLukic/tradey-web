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
      followers: [],
      likedPosts: [],
      rating: 0,
      totalReviews: 0,
      reviews: [],
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
        following: user.following,
        followers: user.followers,
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
      await firestoreService.arrayRemove(COLLECTIONS.USERS, id, 'followers', userId);
      res.json({ following: false });
    } else {
      // Follow
      await firestoreService.arrayUnion(COLLECTIONS.USERS, userId, 'following', id);
      await firestoreService.arrayUnion(COLLECTIONS.USERS, id, 'followers', userId);
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

  /**
   * POST /api/users/:id/preferences
   * Update user preferences
   * Protected route - owner only
   */
  updatePreferences = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.uid;
    const { preferredStyles, size, gender } = req.body;

    // Check ownership
    if (id !== userId) {
      res.status(403).json({ error: 'Forbidden: You can only update your own preferences' });
      return;
    }

    // Validate preferences
    const updates: any = {};
    if (preferredStyles && Array.isArray(preferredStyles)) {
      updates.preferredStyles = preferredStyles;
    }
    if (size) updates.size = size;
    if (gender && ['male', 'female', 'unisex'].includes(gender)) {
      updates.gender = gender;
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: 'No valid preferences provided' });
      return;
    }

    await firestoreService.updateDocument(COLLECTIONS.USERS, id, updates);

    res.json({ message: 'Preferences updated successfully', ...updates });
  });

  /**
   * POST /api/users/:id/review
   * Add a review for a user
   * Protected route - requires authentication
   */
  addReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params; // target user
    const userId = req.user!.uid; // reviewer
    const { rating, comment, postId } = req.body;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Rating must be between 1 and 5' });
      return;
    }

    if (!comment || typeof comment !== 'string') {
      res.status(400).json({ error: 'Comment is required' });
      return;
    }

    // Cannot review yourself
    if (id === userId) {
      res.status(400).json({ error: 'You cannot review yourself' });
      return;
    }

    // Get reviewer info
    const reviewer = await firestoreService.getDocument<any>(COLLECTIONS.USERS, userId);
    if (!reviewer) {
      res.status(404).json({ error: 'Reviewer not found' });
      return;
    }

    // Get target user
    const targetUser = await firestoreService.getDocument<any>(COLLECTIONS.USERS, id);
    if (!targetUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Create review object
    const review = {
      id: Date.now().toString(),
      reviewerId: userId,
      reviewerUsername: reviewer.username,
      reviewerAvatarUrl: reviewer.avatarUrl || undefined,
      rating,
      comment: comment.trim(),
      postId: postId || null,
      createdAt: new Date(),
    };

    // Add review to user
    await firestoreService.arrayUnion(COLLECTIONS.USERS, id, 'reviews', review);

    // Update average rating
    const currentReviews = targetUser.reviews || [];
    const allReviews = [...currentReviews, review];
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await firestoreService.updateDocument(COLLECTIONS.USERS, id, {
      rating: avgRating,
      totalReviews: allReviews.length,
    });

    res.json(review);
  });

  /**
   * PUT /api/users/:id/activity
   * Track user activity (view, search)
   * Protected route - owner only
   */
  trackActivity = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.uid;
    const { type, itemId, searchTerm } = req.body;

    // Check ownership
    if (id !== userId) {
      res.status(403).json({ error: 'Forbidden: You can only track your own activity' });
      return;
    }

    if (type === 'view' && itemId) {
      // Add to viewedItems (keep last 50)
      const user = await firestoreService.getDocument<any>(COLLECTIONS.USERS, id);
      const viewedItems = user?.viewedItems || [];
      const updated = [itemId, ...viewedItems.filter((i: string) => i !== itemId)].slice(0, 50);
      await firestoreService.updateDocument(COLLECTIONS.USERS, id, { viewedItems: updated });
    } else if (type === 'search' && searchTerm) {
      // Add to searchHistory (keep last 20)
      const user = await firestoreService.getDocument<any>(COLLECTIONS.USERS, id);
      const searchHistory = user?.searchHistory || [];
      const updated = [searchTerm, ...searchHistory.filter((t: string) => t !== searchTerm)].slice(0, 20);
      await firestoreService.updateDocument(COLLECTIONS.USERS, id, { searchHistory: updated });
    } else {
      res.status(400).json({ error: 'Invalid activity type or missing data' });
      return;
    }

    res.json({ message: 'Activity tracked' });
  });

  /**
   * GET /api/users/:id/recommendations
   * Get personalized recommendations for user
   * Protected route - owner only
   */
  getRecommendations = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.uid;
    const { limit = 20 } = req.query;

    // Check ownership
    if (id !== userId) {
      res.status(403).json({ error: 'Forbidden: You can only get your own recommendations' });
      return;
    }

    // Get user profile
    const user = await firestoreService.getDocument<any>(COLLECTIONS.USERS, id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { preferredStyles = [], size, gender, likedPosts = [], viewedItems = [], searchHistory = [] } = user;

    // Fetch all available posts
    const allPostsRaw = await firestoreService.queryDocuments<any>(
      COLLECTIONS.POSTS,
      {
        orderBy: { field: 'createdAt', direction: 'desc' },
        limit: 100, // Get more to score and filter
      }
    );

    // Filter available posts (backward compatibility with old posts)
    const allPosts = allPostsRaw.filter(post => {
      // If post has status field, check if it's available
      if (post.status) {
        return post.status === 'available';
      }
      // For old posts without status, check isAvailable
      return post.isAvailable !== false;
    });

    // Score each post
    const scoredPosts = allPosts.map(post => {
      let score = 0;

      // +3 points for each matching tag with preferred styles
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag: string) => {
          if (preferredStyles.includes(tag)) score += 3;
        });
      }

      // +2 points if size matches
      if (size && post.size === size) score += 2;

      // +2 points for similar to liked posts (same tags/brand)
      likedPosts.forEach((likedId: string) => {
        const liked = allPosts.find(p => p.id === likedId);
        if (liked) {
          if (post.tags?.some((t: string) => liked.tags?.includes(t))) score += 2;
          if (post.brand === liked.brand) score += 1;
        }
      });

      // +1 point if viewed before
      if (viewedItems.includes(post.id)) score += 1;

      // +1 point if search history matches
      searchHistory.forEach((term: string) => {
        const lowerTerm = term.toLowerCase();
        if (post.title.toLowerCase().includes(lowerTerm) ||
            post.brand.toLowerCase().includes(lowerTerm)) {
          score += 1;
        }
      });

      return { ...post, score };
    });

    // Sort by score desc and return top N
    const recommendations = scoredPosts
      .sort((a, b) => b.score - a.score)
      .slice(0, Number(limit))
      .map(post => ({
        ...post,
        tags: post.tags || [],
        status: post.status || 'available',
        savedBy: post.savedBy || [],
        comments: post.comments || [],
        authorAvatarUrl: post.authorAvatarUrl || undefined,
      }));

    res.json(recommendations);
  });
}

export default new UserController();
