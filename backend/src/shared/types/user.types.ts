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
  location: string;
  avatarUrl?: string;
  bio?: string;
  following?: string[];
  followers?: string[];
  likedPosts?: string[];
  createdAt: Date;
  role?: 'user' | 'admin';

  // New fields for personalization
  preferredStyles?: string[];
  size?: string;
  gender?: 'male' | 'female' | 'unisex';
  searchHistory?: string[];
  viewedItems?: string[];
  tradedItems?: string[];

  // Ratings & reviews
  rating: number;
  totalReviews: number;
  reviews: Review[];
}

