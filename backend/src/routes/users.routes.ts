import { Router } from 'express';
import userController from '../controllers/userController';
import { authenticate, optionalAuthenticate } from '../middleware/authMiddleware';
import { validateImageFiles } from '../middleware/fileValidation';
import { requireAdmin } from '../middleware/adminMiddleware';
import multer from 'multer';

const router = Router();

// Configure multer for avatar uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB for avatars
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for avatars'));
    }
  },
});

/**
 * Protected Routes (authentication required)
 */

// POST /api/users - Create user profile
router.post('/', authenticate, userController.createUser);

/**
 * Public Routes
 */

// GET /api/users/:id - Get user profile
router.get('/:id', optionalAuthenticate, userController.getUser);

// GET /api/users/:id/posts - Get user's posts
router.get('/:id/posts', optionalAuthenticate, userController.getUserPosts);

// GET /api/users/:id/following - Get users that this user follows
router.get('/:id/following', optionalAuthenticate, userController.getFollowing);

// GET /api/users/:id/followers - Get users that follow this user
router.get('/:id/followers', optionalAuthenticate, userController.getFollowers);

/**
 * Protected Routes (require authentication)
 */

// PUT /api/users/:id - Update user profile (owner only)
router.put('/:id', authenticate, upload.single('avatar'), validateImageFiles, userController.updateUser);

// POST /api/users/:id/follow - Follow/unfollow user
router.post('/:id/follow', authenticate, userController.toggleFollow);

// GET /api/users/:id/liked - Get liked posts (owner only)
router.get('/:id/liked', authenticate, userController.getLikedPosts);

// GET /api/users/:id/feed - Get feed from followed users
router.get('/:id/feed', authenticate, userController.getFeed);

// POST /api/users/:id/preferences - Update user preferences
router.post('/:id/preferences', authenticate, userController.updatePreferences);

// POST /api/users/:id/review - Add review for user
router.post('/:id/review', authenticate, userController.addReview);

// PUT /api/users/:id/activity - Track user activity
router.put('/:id/activity', authenticate, userController.trackActivity);

// GET /api/users/:id/recommendations - Get personalized recommendations
router.get('/:id/recommendations', authenticate, userController.getRecommendations);

// POST /api/users/:id/block - Block/unblock user
router.post('/:id/block', authenticate, userController.toggleBlock);

// POST /api/users/:id/ban - Ban/unban user (admin only)
router.post('/:id/ban', requireAdmin, userController.toggleBan);

export default router;
