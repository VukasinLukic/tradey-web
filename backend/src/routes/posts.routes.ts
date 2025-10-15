import { Router } from 'express';
import postController from '../controllers/postController';
import { authenticate, optionalAuthenticate } from '../middleware/authMiddleware';
import { postCreationLimiter } from '../middleware/rateLimiter';
import multer from 'multer';

const router = Router();

// Configure multer for image uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5, // Max 5 files
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * Public Routes
 */

// GET /api/posts - Get all posts with filters
router.get('/', optionalAuthenticate, postController.getPosts);

// GET /api/posts/:id - Get single post
router.get('/:id', optionalAuthenticate, postController.getPost);

/**
 * Protected Routes (require authentication)
 */

// POST /api/posts - Create new post
router.post(
  '/',
  authenticate,
  postCreationLimiter,
  upload.array('images', 5),
  postController.createPost
);

// PUT /api/posts/:id - Update post (owner only)
router.put(
  '/:id',
  authenticate,
  upload.array('images', 5),
  postController.updatePost
);

// DELETE /api/posts/:id - Delete post (owner only)
router.delete('/:id', authenticate, postController.deletePost);

// POST /api/posts/:id/like - Toggle like
router.post('/:id/like', authenticate, postController.toggleLike);

// POST /api/posts/:id/toggle-availability - Toggle availability (owner only)
router.post('/:id/toggle-availability', authenticate, postController.toggleAvailability);

export default router;
