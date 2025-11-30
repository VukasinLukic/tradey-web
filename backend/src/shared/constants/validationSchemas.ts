import { z } from 'zod';

// Post validation schemas
export const createPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
  brand: z.string().min(1, 'Brand is required'),
  condition: z.enum(['NEW', 'MINT', 'VERY_GOOD', 'GOOD', 'FAIR']),
  size: z.string().min(1, 'Size is required'),
  type: z.string().min(1, 'Type is required'),
  style: z.string().min(1, 'Style is required'),
  tradePreferences: z.string().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required').max(5, 'Maximum 5 images allowed'),
  tags: z.array(z.string()).optional().default([]),
  gender: z.enum(['male', 'female', 'unisex']).optional().default('unisex')
});

export const updatePostSchema = createPostSchema.partial();

// User validation schemas
export const createUserProfileSchema = z.object({
  uid: z.string().min(1, 'User ID is required'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be less than 30 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{9,15}$/, 'Phone number must be 9-15 digits (digits only)'),
  location: z.string().min(1, 'Location is required'),
});

export const updateUserProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  bio: z.string().max(500).optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  phone: z.string().regex(/^\d{9,15}$/).optional().or(z.literal(''))
});

// Chat validation schemas
export const sendMessageSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
});

export const createChatSchema = z.object({
  participantId: z.string().min(1, 'Participant ID is required'),
});

