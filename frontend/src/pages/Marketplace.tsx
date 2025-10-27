import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState, EmptyIcons } from '../components/ui/EmptyState';
import { ClothingConditions } from '../shared/types/post.types';
import type { Post } from '../shared/types/post.types';
import { StickyFooter, FooterContent } from '../components/navigation/StickyFooter';
import { CLOTHING_STYLES } from '../constants/clothing';
import { postsApi, usersApi } from '../services/api';
import { ProductCard as SharedProductCard } from '../components/post/ProductCard';

type FeedMode = 'all' | 'forYou';

export function MarketplacePage() {
  const { user } = useAuth();

  const [feedMode, setFeedMode] = useState<FeedMode>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [minimumLoadingPassed, setMinimumLoadingPassed] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [styleFilter, setStyleFilter] = useState('');

  const observerTarget = useRef<HTMLDivElement>(null);
  const LIMIT = 20;

  // Fetch posts based on mode
  const fetchPosts = useCallback(async (reset = false) => {
    const currentOffset = reset ? 0 : offset;

    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      let response: any;

      if (feedMode === 'forYou' && user) {
        // Fetch personalized recommendations
        response = await usersApi.getRecommendations(user.uid, { limit: LIMIT });
        // Recommendations don't support pagination, so disable hasMore
        setHasMore(false);
        if (reset) {
          setPosts(response.data);
        } else {
          setPosts(prev => [...prev, ...response.data]);
        }
      } else {
        // Fetch all posts with pagination
        const params: any = {
          limit: LIMIT,
          offset: currentOffset,
        };

        if (searchQuery) params.q = searchQuery;
        if (sizeFilter) params.size = sizeFilter;
        if (conditionFilter) params.condition = conditionFilter;
        if (styleFilter) params.style = styleFilter;

        response = await postsApi.getPosts(params);
        const { posts: newPosts, hasMore: more } = response.data;

        setHasMore(more);
        if (reset) {
          setPosts(newPosts);
        } else {
          setPosts(prev => [...prev, ...newPosts]);
        }
      }

      if (!reset) {
        setOffset(currentOffset + LIMIT);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [feedMode, user, offset, searchQuery, sizeFilter, conditionFilter, styleFilter]);

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumLoadingPassed(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Reset and fetch when mode or filters change
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchPosts(true);
  }, [feedMode, searchQuery, sizeFilter, conditionFilter, styleFilter]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchPosts(false);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadingMore, fetchPosts]);

  const clearFilters = () => {
    setSearchQuery('');
    setSizeFilter('');
    setConditionFilter('');
    setStyleFilter('');
  };

  const hasActiveFilters = searchQuery || sizeFilter || conditionFilter || styleFilter;

  if (loading || !minimumLoadingPassed) {
    return <LoadingState message="Učitavanje proizvoda..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-tradey-red font-sans text-lg">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-fayte text-7xl md:text-9xl text-tradey-black mb-2 tracking-tight uppercase">
            SHOP
          </h1>
        </div>

        {/* ALL / FOR YOU Toggle */}
        {user && (
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setFeedMode('all')}
              className={`px-6 py-2 font-sans text-sm transition-all ${
                feedMode === 'all'
                  ? 'bg-tradey-black text-white'
                  : 'bg-white text-tradey-black border border-tradey-black/20 hover:border-tradey-black'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setFeedMode('forYou')}
              className={`px-6 py-2 font-sans text-sm transition-all ${
                feedMode === 'forYou'
                  ? 'bg-tradey-red text-white'
                  : 'bg-white text-tradey-black border border-tradey-black/20 hover:border-tradey-red'
              }`}
            >
              FOR YOU
            </button>
          </div>
        )}

        {/* Filters - Only show in ALL mode */}
        {feedMode === 'all' && (
          <div className="mb-10 pb-6 border-b border-tradey-black/10">
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-[200px] px-4 py-2 border border-tradey-black/20 rounded-none text-tradey-black font-sans text-sm placeholder:text-tradey-black/40 focus:outline-none focus:border-tradey-red transition-colors bg-white"
              />

              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="px-4 py-2 border border-tradey-black/20 rounded-none text-tradey-black font-sans text-sm focus:outline-none focus:border-tradey-red transition-colors bg-white cursor-pointer"
              >
                <option value="">All Sizes</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>

              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="px-4 py-2 border border-tradey-black/20 rounded-none text-tradey-black font-sans text-sm focus:outline-none focus:border-tradey-red transition-colors bg-white cursor-pointer"
              >
                <option value="">All Conditions</option>
                {Object.entries(ClothingConditions).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>

              <select
                value={styleFilter}
                onChange={(e) => setStyleFilter(e.target.value)}
                className="px-4 py-2 border border-tradey-black/20 rounded-none text-tradey-black font-sans text-sm focus:outline-none focus:border-tradey-red transition-colors bg-white cursor-pointer"
              >
                <option value="">All Styles</option>
                {CLOTHING_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-tradey-red font-sans text-sm hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <p className="text-tradey-black/60 font-sans text-sm mt-4">
                {posts.length} {posts.length === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>
        )}

        {/* Product Grid */}
        {posts.length === 0 ? (
          <EmptyState
            icon={hasActiveFilters ? <EmptyIcons.NoSearch /> : <EmptyIcons.NoItems />}
            title={hasActiveFilters ? 'Nema rezultata' : 'Nema artikala'}
            description={
              hasActiveFilters
                ? 'Pokušajte sa drugačijim filterima ili pretragom.'
                : 'Trenutno nema dostupnih artikala. Budite prvi koji će podeliti nešto!'
            }
            actionLabel={hasActiveFilters ? 'Uklonite filtere' : undefined}
            onAction={hasActiveFilters ? clearFilters : undefined}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {posts.map((post) => (
                <SharedProductCard key={post.id} post={post} showSaveButton={true} showAuthor={true} />
              ))}
            </div>

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div ref={observerTarget} className="py-8 text-center">
                {loadingMore && (
                  <p className="font-sans text-sm text-tradey-black/60">Loading more...</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <StickyFooter heightValue="80dvh">
        <FooterContent />
      </StickyFooter>
    </>
  );
}
