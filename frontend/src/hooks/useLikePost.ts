import { useState } from 'react';
import { postsApi } from '../services/api';

export function useLikePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const toggleLike = async (postId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await postsApi.toggleLike(postId);
      return true;
    } catch (err: any) {
      console.error('Error toggling like:', err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { toggleLike, loading, error };
}
