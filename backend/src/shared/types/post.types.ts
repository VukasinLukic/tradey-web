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

export interface Post {
  id: string;
  title: string;
  description: string;
  brand: string;
  condition: ClothingCondition;
  size: string;
  type: string;
  style: string;
  images: string[];
  tradePreferences: string;

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

  createdAt: Date;
  isAvailable: boolean;
}

