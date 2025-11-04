import { useState, useEffect } from 'react';
import { usersApi } from '../services/api';
import type { Post } from '../types/entities';

export function useWishlistPosts(userId: string | undefined) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchWishlistPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await usersApi.getLikedPosts(userId);
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching wishlist posts:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistPosts();
  }, [userId]);

  const refetch = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await usersApi.getLikedPosts(userId);
      setPosts(response.data);
    } catch (err) {
      console.error('Error refetching wishlist posts:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { posts, loading, error, refetch };
}
