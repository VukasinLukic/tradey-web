// Enum-like object for clothing conditions
export const ClothingConditions = {
  NEW: 'New (with tags)',
  MINT: 'Like new (without tags)',
  VERY_GOOD: 'Very good condition',
  GOOD: 'Good condition (visible signs of use)',
  FAIR: 'Used (with flaws)',
};

export type ClothingCondition = keyof typeof ClothingConditions;

export interface Post {
  id: string;
  title: string;
  description: string;
  brand: string;
  condition: ClothingCondition;
  size: string;
  images: string[];
  tradePreferences: string;
  
  // Author Info
  authorId: string;
  authorUsername: string;
  authorLocation: string;

  createdAt: Date;
  isAvailable: boolean;
}

