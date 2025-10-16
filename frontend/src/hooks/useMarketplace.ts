import { useState, useEffect, useMemo } from 'react';
import type { Post, ClothingCondition } from '../../../shared/types/post.types';
import api from '../services/api';

export interface MarketplaceFilters {
  search: string;
  style?: string;
  size?: string;
  type?: string;
  color?: string;
  condition?: ClothingCondition;
  sortBy?: 'recent' | 'popular';
}

export function useMarketplace() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    search: '',
    sortBy: 'recent',
  });
  const [page, setPage] = useState(1);
  const postsPerPage = 20;

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/posts');
        // Backend returns array directly, not { posts: [...] }
        setPosts(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching posts:', err);
        setError(err.response?.data?.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by search (title, description, brand, author)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.description.toLowerCase().includes(searchLower) ||
          post.brand.toLowerCase().includes(searchLower) ||
          post.authorUsername.toLowerCase().includes(searchLower)
      );
    }

    // Filter by size
    if (filters.size) {
      result = result.filter((post) => post.size === filters.size);
    }

    // Filter by condition
    if (filters.condition) {
      result = result.filter((post) => post.condition === filters.condition);
    }

    // Sort
    if (filters.sortBy === 'recent') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === 'popular') {
      // Sort by likes count (if available) - for now just recent
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [posts, filters]);

  // Trending posts (most recent 5)
  const trendingPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [posts]);

  // Paginated posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, page]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const updateFilters = (newFilters: Partial<MarketplaceFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      sortBy: 'recent',
    });
    setPage(1);
  };

  return {
    posts: paginatedPosts,
    allPosts: filteredPosts,
    trendingPosts,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    page,
    setPage,
    totalPages,
    totalResults: filteredPosts.length,
  };
}
