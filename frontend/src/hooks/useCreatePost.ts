import { useState } from 'react';
import { postsApi } from '../services/api';
import type { Post } from '../types/entities';

export function useCreatePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPost = async (postData: {
    title: string;
    description: string;
    brand?: string;
    condition: string;
    size?: string;
    tradePreferences?: string;
    images: File[];
  }): Promise<Post | null> => {
    setLoading(true);
    setError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('description', postData.description);
      formData.append('condition', postData.condition);

      if (postData.brand) {
        formData.append('brand', postData.brand);
      }
      if (postData.size) {
        formData.append('size', postData.size);
      }
      if (postData.tradePreferences) {
        formData.append('tradePreferences', postData.tradePreferences);
      }

      // Append all images
      postData.images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await postsApi.create(formData);
      return response.data;
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading, error };
}
