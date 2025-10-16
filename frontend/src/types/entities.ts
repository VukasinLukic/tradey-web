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

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  phone: string;
  location: string; // e.g., 'Stari Grad'
  createdAt: Timestamp | Date;
  // futher properties
  // following: string[];
  // likes: string[];
}

export interface Post {
  id: string;
  title: string;
  description: string;
  brand: string;
  condition: ClothingCondition;
  size: string;
  images: string[]; // Array of URLs to images in Firebase Storage
  tradePreferences: string; // "za sta je ne bi menjao"
  
  // Author Info
  authorId: string;
  authorUsername: string;
  authorLocation: string;

  createdAt: Timestamp | Date | FieldValue;
  isAvailable: boolean;
} 