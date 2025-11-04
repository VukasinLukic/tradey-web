import { Timestamp, FieldValue } from 'firebase/firestore';

// Enum-like object for clothing conditions
export const ClothingConditions = {
  NEW: 'New (with tags)',
  MINT: 'Like new (without tags)',
  VERY_GOOD: 'Very good condition',
  GOOD: 'Good condition (visible signs of use)',
  FAIR: 'Used (with flaws)',
};
export type ClothingCondition = keyof typeof ClothingConditions;

export type PostStatus = 'available' | 'traded' | 'reserved';

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  text: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerUsername: string;
  reviewerAvatarUrl?: string;
  rating: number;
  comment: string;
  postId: string;
  createdAt: Date;
}

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  phone: string;
  location: string; // e.g., 'Stari Grad'
  avatarUrl?: string;
  bio?: string;
  following?: string[]; // UIDs of users this user follows
  followers?: string[]; // UIDs of users who follow this user
  likedPosts?: string[];
  blockedUsers?: string[]; // UIDs of users this user has blocked
  createdAt: Timestamp | Date;
  role?: 'user' | 'admin' | 'moderator';

  // New fields for personalization
  preferredStyles?: string[];
  size?: string;
  gender?: 'male' | 'female' | 'unisex';
  searchHistory?: string[];
  viewedItems?: string[];
  tradedItems?: string[];

  // Ratings & reviews
  rating?: number;
  totalReviews?: number;
  reviews?: Review[];
}

export interface Post {
  id: string;
  title: string;
  description: string;
  brand: string;
  condition: ClothingCondition;
  size: string;
  type: string; // Clothing type (e.g., T-Shirt, Jeans, Jacket)
  style: string; // Clothing style (e.g., Streetwear, Vintage, Casual)
  images: string[]; // Array of URLs to images in Firebase Storage
  tradePreferences: string; // "za sta je ne bi menjao"

  // Author Info
  authorId: string;
  authorUsername: string;
  authorLocation: string;
  authorAvatarUrl?: string;

  // New fields
  tags: string[];
  status: PostStatus;
  savedBy: string[];
  comments: Comment[];
  averageRating?: number;
  gender?: 'male' | 'female' | 'unisex';

  createdAt: Timestamp | Date | FieldValue;
  isAvailable: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  readBy: string[];
} 