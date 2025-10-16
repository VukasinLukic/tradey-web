import { useState, useEffect } from 'react';
import { postsApi } from '../services/api';
import type { Post } from '../types/entities';

export function useRecentPosts(postLimit: number = 3) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await postsApi.getAll({ limit: postLimit });
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching recent posts:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [postLimit]);

  return { posts, loading, error };
} 