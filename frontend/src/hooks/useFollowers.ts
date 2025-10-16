import { useState, useEffect } from 'react';
import { usersApi } from '../services/api';

export interface SimplifiedUser {
  uid: string;
  username: string;
  avatarUrl?: string;
  location: string;
}

export function useFollowers(userId: string | undefined) {
  const [followers, setFollowers] = useState<SimplifiedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchFollowers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await usersApi.getFollowers(userId);
        setFollowers(response.data);
      } catch (err) {
        console.error('Error fetching followers:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [userId]);

  const refetch = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await usersApi.getFollowers(userId);
      setFollowers(response.data);
    } catch (err) {
      console.error('Error refetching followers:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { followers, loading, error, refetch };
}

