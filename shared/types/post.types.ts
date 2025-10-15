// Enum-like object for clothing conditions
export const ClothingConditions = {
  NEW: 'Novo (sa etiketom)',
  MINT: 'Kao novo (bez etikete)',
  VERY_GOOD: 'Vrlo dobro očuvano',
  GOOD: 'Dobro očuvano (vidljivi znaci korišćenja)',
  FAIR: 'Korišćeno (sa manama)',
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

