import { useState, useEffect } from 'react';
import { usersApi } from '../services/api';
import type { Post } from '../types/entities';

export function useUserPosts(userId: string | undefined) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await usersApi.getUserPosts(userId);
        setPosts(response.data);
      } catch (err: any) {
        console.error("Error fetching user posts:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  return { posts, loading, error };
} 