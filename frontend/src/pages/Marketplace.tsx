import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../hooks/useMarketplace';
import { useLikePost } from '../hooks/useLikePost';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/ui/Spinner';
import { ClothingConditions } from '../../../shared/types/post.types';
import type { ClothingCondition } from '../../../shared/types/post.types';

export function MarketplacePage() {
  const {
    posts,
    trendingPosts,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    page,
    setPage,
    totalPages,
    totalResults,
  } = useMarketplace();

  const [stickyFilters, setStickyFilters] = useState(false);

  // Handle scroll for sticky filter bar
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setStickyFilters(window.scrollY > 400);
    });
  }

  const formatTimestamp = (date: Date | string) => {
    const postDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - postDate.getTime();
    const diffHours = Math.floor(diffMs / 3600000);

    // Show "NEW" badge for posts less than 48h old
    return diffHours < 48;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-tradey-red font-avarabold text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-fayte text-6xl md:text-8xl text-tradey-white mb-4">
          MARKETPLACE
        </h1>
        <p className="font-avarabold text-tradey-blue text-lg md:text-xl">
          Discover unique pieces from our community
        </p>
      </div>

      {/* Trending Section */}
      {trendingPosts.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-avarabold text-3xl text-tradey-white">Trending Now</h2>
            <div className="h-[2px] flex-1 bg-tradey-red/30 ml-6"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {trendingPosts.map((post) => (
              <ProductCard key={post.id} post={post} isNew={formatTimestamp(post.createdAt)} />
            ))}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div
        className={`bg-tradey-black border-2 border-tradey-red/30 rounded-lg p-6 mb-8 transition-all ${
          stickyFilters ? 'sticky top-4 z-40 shadow-2xl' : ''
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Search items, brands, users..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="w-full px-4 py-3 bg-tradey-black border-2 border-tradey-red/30 rounded-lg text-tradey-white font-sans placeholder:text-tradey-blue/50 focus:outline-none focus:border-tradey-red transition-colors"
            />
          </div>

          {/* Size Filter */}
          <select
            value={filters.size || ''}
            onChange={(e) => updateFilters({ size: e.target.value || undefined })}
            className="px-4 py-3 bg-tradey-black border-2 border-tradey-red/30 rounded-lg text-tradey-white font-sans focus:outline-none focus:border-tradey-red transition-colors"
          >
            <option value="">All Sizes</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>

          {/* Condition Filter */}
          <select
            value={filters.condition || ''}
            onChange={(e) => updateFilters({ condition: e.target.value as ClothingCondition || undefined })}
            className="px-4 py-3 bg-tradey-black border-2 border-tradey-red/30 rounded-lg text-tradey-white font-sans focus:outline-none focus:border-tradey-red transition-colors"
          >
            <option value="">All Conditions</option>
            {Object.entries(ClothingConditions).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={filters.sortBy || 'recent'}
            onChange={(e) => updateFilters({ sortBy: e.target.value as 'recent' | 'popular' })}
            className="px-4 py-3 bg-tradey-black border-2 border-tradey-red/30 rounded-lg text-tradey-white font-sans focus:outline-none focus:border-tradey-red transition-colors"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(filters.search || filters.size || filters.condition) && (
          <div className="mt-4 flex justify-between items-center">
            <p className="text-tradey-blue font-sans text-sm">
              {totalResults} {totalResults === 1 ? 'result' : 'results'} found
            </p>
            <button
              onClick={resetFilters}
              className="text-tradey-red font-avarabold text-sm hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-tradey-red/30 rounded-lg">
          <svg
            className="w-20 h-20 text-tradey-red/50 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="font-avarabold text-2xl text-tradey-white mb-2">No items found</h3>
          <p className="font-sans text-tradey-blue mb-6">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-3 bg-tradey-red text-tradey-white font-avarabold rounded-lg hover:opacity-90 transition-opacity"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
            {posts.map((post) => (
              <ProductCard key={post.id} post={post} isNew={formatTimestamp(post.createdAt)} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-6 py-3 border-2 border-tradey-red/30 text-tradey-white font-avarabold rounded-lg hover:bg-tradey-red/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-tradey-blue font-sans">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-6 py-3 border-2 border-tradey-red/30 text-tradey-white font-avarabold rounded-lg hover:bg-tradey-red/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Product Card Component with Like Button and Badges
function ProductCard({ post, isNew }: { post: any; isNew: boolean }) {
  const { user } = useAuth();
  const { toggleLike, loading } = useLikePost();

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      await toggleLike(post.id);
    }
  };

  // Calculate likes count and isLiked from post data (if backend provides it)
  const likesCount = 0; // TODO: Get from post data when backend implements it
  const isLiked = false; // TODO: Get from post data when backend implements it

  return (
    <Link to={`/item/${post.id}`} className="group block">
      <div className="relative bg-tradey-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Image */}
        <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Availability Overlay */}
          {!post.isAvailable && (
            <div className="absolute inset-0 bg-tradey-black/60 flex items-center justify-center">
              <span className="font-avarabold text-tradey-white text-lg px-4 py-2 bg-tradey-red/90 rounded-lg">
                TRADED
              </span>
            </div>
          )}

          {/* NEW Badge */}
          {isNew && post.isAvailable && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-tradey-red text-tradey-white font-avarabold text-xs rounded-full">
              NEW
            </div>
          )}

          {/* Condition Badge */}
          <div className="absolute top-3 right-3 px-3 py-1 bg-tradey-black/80 text-tradey-white font-sans text-xs rounded-full">
            {ClothingConditions[post.condition as keyof typeof ClothingConditions]}
          </div>

          {/* Like Button */}
          {user && (
            <button
              onClick={handleLikeClick}
              disabled={loading}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-tradey-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-tradey-white transition-colors"
            >
              <svg
                className={`w-5 h-5 ${isLiked ? 'fill-tradey-red text-tradey-red' : 'fill-none text-tradey-black'}`}
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 bg-tradey-white">
          <h3 className="font-avarabold text-tradey-black text-lg mb-1 truncate">
            {post.title}
          </h3>
          <p className="font-sans text-tradey-black/60 text-sm mb-2">{post.brand}</p>
          <div className="flex items-center justify-between">
            <span className="font-sans text-tradey-black/80 text-sm">Size {post.size}</span>
            {likesCount > 0 && (
              <span className="font-sans text-tradey-black/60 text-xs flex items-center gap-1">
                <svg className="w-4 h-4 fill-tradey-red" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {likesCount}
              </span>
            )}
          </div>
          {/* Author */}
          <div className="mt-3 pt-3 border-t border-tradey-black/10 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-tradey-red/20 flex items-center justify-center">
              <span className="font-avarabold text-tradey-red text-xs">
                {post.authorUsername.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="font-sans text-tradey-black/70 text-xs truncate">
              {post.authorUsername}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
