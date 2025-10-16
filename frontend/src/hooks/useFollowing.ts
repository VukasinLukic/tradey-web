import { useState, useEffect } from 'react';
import { usersApi } from '../services/api';
import type { SimplifiedUser } from './useFollowers';

export function useFollowing(userId: string | undefined) {
  const [following, setFollowing] = useState<SimplifiedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchFollowing = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await usersApi.getFollowing(userId);
        setFollowing(response.data);
      } catch (err) {
        console.error('Error fetching following:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [userId]);

  const refetch = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await usersApi.getFollowing(userId);
      setFollowing(response.data);
    } catch (err) {
      console.error('Error refetching following:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { following, loading, error, refetch };
}

