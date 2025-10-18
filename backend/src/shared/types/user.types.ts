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
}

