import { useState } from 'react';
import { usersApi } from '../services/api';

export function useFollowUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const toggleFollow = async (userId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await usersApi.toggleFollow(userId);
      return true;
    } catch (err) {
      console.error('Error toggling follow:', err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { toggleFollow, loading, error };
}
