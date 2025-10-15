import { useState, useEffect } from 'react';
import { postsApi } from '../services/api';
import type { Post } from '../types/entities';

export function usePost(postId: string | undefined) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await postsApi.getById(postId);
        setPost(response.data);
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setError(err);

        // Handle 404 - post not found
        if (err.response?.status === 404) {
          console.log("Post not found");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return { post, loading, error };
} 