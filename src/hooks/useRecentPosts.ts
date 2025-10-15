import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Post } from '../types/entities';

export function useRecentPosts(postLimit: number = 3) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('createdAt', 'desc'), limit(postLimit));
        const querySnapshot = await getDocs(q);
        const recentPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        setPosts(recentPosts);
      } catch (err) {
        console.error("Error fetching recent posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [postLimit]);

  return { posts, loading };
} 