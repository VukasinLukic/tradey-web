import { z } from 'zod';

// Post validation schemas
export const createPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
  brand: z.string().min(1, 'Brand is required'),
  condition: z.enum(['NEW', 'MINT', 'VERY_GOOD', 'GOOD', 'FAIR']),
  size: z.string().min(1, 'Size is required'),
  tradePreferences: z.string().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required').max(5, 'Maximum 5 images allowed')
});

export const updatePostSchema = createPostSchema.partial();

// User validation schemas
export const updateUserProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  phone: z.string().regex(/^\d{9,10}$/).optional()
});

// Chat validation schemas
export const sendMessageSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
});

export const createChatSchema = z.object({
  participantId: z.string().min(1, 'Participant ID is required'),
});

