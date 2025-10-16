import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import firestoreService from '../services/firestore.service';
import storageService from '../services/storage.service';
import { COLLECTIONS } from 'shared/constants/firebasePaths';
import { createPostSchema, updatePostSchema } from 'shared/constants/validationSchemas';
import { Post } from 'shared/types';
import admin from 'firebase-admin';
import { asyncHandler } from '../middleware/errorHandler';

export class PostController {
  /**
   * GET /api/posts
   * Get list of posts with optional filters
   */
  getPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { q, tag, creator, limit = 20, condition, size } = req.query;

    const filters: Array<[string, FirebaseFirestore.WhereFilterOp, any]> = [];

    // Filter by creator
    if (creator) {
      filters.push(['authorId', '==', creator as string]);
    }

    // Filter by condition
    if (condition) {
      filters.push(['condition', '==', condition as string]);
    }

    // Filter by size
    if (size) {
      filters.push(['size', '==', size as string]);
    }

    // Filter by availability
    filters.push(['isAvailable', '==', true]);

    const posts = await firestoreService.queryDocuments<Post>(
      COLLECTIONS.POSTS,
      {
        filters,
        orderBy: { field: 'createdAt', direction: 'desc' },
        limit: Number(limit),
      }
    );

    // Client-side search filter for query (title, description, brand)
    let filteredPosts = posts;
    if (q) {
      const searchQuery = (q as string).toLowerCase();
      filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery) ||
        post.description.toLowerCase().includes(searchQuery) ||
        post.brand.toLowerCase().includes(searchQuery)
      );
    }

    res.json(filteredPosts);
  });

  /**
   * GET /api/posts/:id
   * Get a single post by ID
   */
  getPost = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const post = await firestoreService.getDocument<Post>(COLLECTIONS.POSTS, id);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json(post);
  });

  /**
   * POST /api/posts
   * Create a new post (with images)
   * Protected route - requires authentication
   */
  createPost = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;

    console.log('--- CREATE POST ---');
    console.log('Received body:', JSON.stringify(req.body, null, 2));
    console.log('Received files:', req.files);

    // Images are handled by multer, so we can omit them from body validation
    const bodySchema = createPostSchema.omit({ images: true });
    const validation = bodySchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        errors: validation.error.issues,
      });
      return;
    }

    // Get user data for author info
    const userDoc = await firestoreService.getDocument<any>(COLLECTIONS.USERS, userId);
    if (!userDoc) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Upload images if provided as files
    let imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      if (req.files.length > 5) {
        res.status(400).json({ error: 'Maximum 5 images allowed' });
        return;
      }
      try {
        imageUrls = await storageService.uploadImages(req.files as Express.Multer.File[], userId);
      } catch (error) {
        res.status(500).json({ error: 'Failed to upload images' });
        return;
      }
    } else {
      res.status(400).json({ error: 'At least one image is required' });
      return;
    }

    // Create post document
    const newPost = {
      ...validation.data,
      images: imageUrls,
      authorId: userId,
      authorUsername: userDoc.username,
      authorLocation: userDoc.location,
      isAvailable: true,
    };

    const createdPost = await firestoreService.createDocument(COLLECTIONS.POSTS, newPost);

    res.status(201).json(createdPost);
  });

  /**
   * PUT /api/posts/:id
   * Update a post (owner only)
   * Protected route - requires authentication
   */
  updatePost = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.uid;

    // Check if post exists
    const post = await firestoreService.getDocument<Post>(COLLECTIONS.POSTS, id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Check ownership
    if (post.authorId !== userId) {
      res.status(403).json({ error: 'Forbidden: You can only update your own posts' });
      return;
    }

    // Validate request body
    const validation = updatePostSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        errors: validation.error.issues,
      });
      return;
    }

    // Handle image updates if new files provided
    let imageUrls = validation.data.images;
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      try {
        // Delete old images
        if (post.images && post.images.length > 0) {
          await storageService.deleteImages(post.images);
        }
        // Upload new images
        imageUrls = await storageService.uploadImages(req.files as Express.Multer.File[], userId);
      } catch (error) {
        console.error('Error updating images:', error);
        // Continue with update even if image update fails
      }
    }

    // Update post
    const updateData: any = { ...validation.data };
    if (imageUrls) {
      updateData.images = imageUrls;
    }

    await firestoreService.updateDocument(COLLECTIONS.POSTS, id, updateData);

    // Fetch updated post
    const updatedPost = await firestoreService.getDocument<Post>(COLLECTIONS.POSTS, id);
    res.json(updatedPost);
  });

  /**
   * DELETE /api/posts/:id
   * Delete a post (owner only)
   * Protected route - requires authentication
   */
  deletePost = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.uid;

    // Check if post exists
    const post = await firestoreService.getDocument<Post>(COLLECTIONS.POSTS, id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Check ownership
    if (post.authorId !== userId) {
      res.status(403).json({ error: 'Forbidden: You can only delete your own posts' });
      return;
    }

    // Delete images from storage
    if (post.images && post.images.length > 0) {
      try {
        await storageService.deleteImages(post.images);
      } catch (error) {
        console.error('Error deleting images:', error);
        // Continue with post deletion even if image deletion fails
      }
    }

    // Delete post document
    await firestoreService.deleteDocument(COLLECTIONS.POSTS, id);

    res.json({ message: 'Post deleted successfully' });
  });

  /**
   * POST /api/posts/:id/like
   * Toggle like on a post
   * Protected route - requires authentication
   */
  toggleLike = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.uid;

    // Check if post exists
    const postExists = await firestoreService.documentExists(COLLECTIONS.POSTS, id);
    if (!postExists) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Get user's liked posts
    const user = await firestoreService.getDocument<any>(COLLECTIONS.USERS, userId);
    const likedPosts = (user?.likedPosts as string[]) || [];

    // Toggle like
    if (likedPosts.includes(id)) {
      // Unlike
      await firestoreService.arrayRemove(COLLECTIONS.USERS, userId, 'likedPosts', id);
      res.json({ liked: false });
    } else {
      // Like
      await firestoreService.arrayUnion(COLLECTIONS.USERS, userId, 'likedPosts', id);
      res.json({ liked: true });
    }
  });

  /**
   * POST /api/posts/:id/toggle-availability
   * Toggle post availability (owner only)
   * Protected route - requires authentication
   */
  toggleAvailability = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.uid;

    // Check if post exists
    const post = await firestoreService.getDocument<Post>(COLLECTIONS.POSTS, id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Check ownership
    if (post.authorId !== userId) {
      res.status(403).json({ error: 'Forbidden: You can only modify your own posts' });
      return;
    }

    // Toggle availability
    const newAvailability = !post.isAvailable;
    await firestoreService.updateDocument(COLLECTIONS.POSTS, id, {
      isAvailable: newAvailability,
    });

    res.json({ isAvailable: newAvailability });
  });
}

export default new PostController();
