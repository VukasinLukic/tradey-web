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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-tradey-red font-sans text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      {/* Header - Minimal clean */}
      <div className="mb-12">
        <h1 className="font-fayte text-7xl md:text-9xl text-tradey-black mb-2 tracking-tight uppercase">
          SHOP
        </h1>
      </div>

      {/* Filters - Minimal horizontal bar */}
      <div className="mb-10 pb-6 border-b border-tradey-black/10">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="flex-1 min-w-[200px] px-4 py-2 border border-tradey-black/20 rounded-none text-tradey-black font-sans text-sm placeholder:text-tradey-black/40 focus:outline-none focus:border-tradey-red transition-colors bg-white"
          />

          {/* Size Filter */}
          <select
            value={filters.size || ''}
            onChange={(e) => updateFilters({ size: e.target.value || undefined })}
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

          {/* Condition Filter */}
          <select
            value={filters.condition || ''}
            onChange={(e) => updateFilters({ condition: e.target.value as ClothingCondition || undefined })}
            className="px-4 py-2 border border-tradey-black/20 rounded-none text-tradey-black font-sans text-sm focus:outline-none focus:border-tradey-red transition-colors bg-white cursor-pointer"
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
            className="px-4 py-2 border border-tradey-black/20 rounded-none text-tradey-black font-sans text-sm focus:outline-none focus:border-tradey-red transition-colors bg-white cursor-pointer"
          >
            <option value="recent">Newest</option>
            <option value="popular">Popular</option>
          </select>

          {/* Clear Filters */}
          {(filters.search || filters.size || filters.condition) && (
            <button
              onClick={resetFilters}
              className="text-tradey-red font-sans text-sm hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results count */}
        {(filters.search || filters.size || filters.condition) && (
          <p className="text-tradey-black/60 font-sans text-sm mt-4">
            {totalResults} {totalResults === 1 ? 'item' : 'items'}
          </p>
        )}
      </div>

      {/* Product Grid - Clean, minimal like the image */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="font-sans text-tradey-black/40 text-lg mb-4">No items found</p>
          {(filters.search || filters.size || filters.condition) && (
            <button
              onClick={resetFilters}
              className="px-6 py-2 border border-tradey-black text-tradey-black font-sans text-sm hover:bg-tradey-black hover:text-white transition-all"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {posts.map((post) => (
              <ProductCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination - Minimal */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-16 pt-10 border-t border-tradey-black/10">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="font-sans text-sm text-tradey-black disabled:text-tradey-black/30 hover:underline disabled:no-underline transition-all"
              >
                Previous
              </button>
              <span className="font-sans text-sm text-tradey-black/60">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="font-sans text-sm text-tradey-black disabled:text-tradey-black/30 hover:underline disabled:no-underline transition-all"
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

// Product Card - Clean, minimal inspired by bizus.cz
function ProductCard({ post }: { post: any }) {
  const { user } = useAuth();
  const { toggleLike, loading } = useLikePost();
  const [isHovered, setIsHovered] = useState(false);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      await toggleLike(post.id);
    }
  };

  // Placeholder for likes
  const isLiked = false;

  return (
    <Link
      to={`/item/${post.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image - Clean, no borders */}
      <div className="aspect-[3/4] relative overflow-hidden bg-gray-50 mb-3">
        <img
          src={post.images[0]}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Minimal availability indicator */}
        {!post.isAvailable && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="font-sans text-xs text-tradey-black/60 tracking-wider">
              SOLD
            </span>
          </div>
        )}

        {/* Like button - appears on hover */}
        {user && isHovered && (
          <button
            onClick={handleLikeClick}
            disabled={loading}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-white transition-all"
          >
            <svg
              className={`w-4 h-4 ${isLiked ? 'fill-tradey-red stroke-tradey-red' : 'fill-none stroke-tradey-black'}`}
              strokeWidth={1.5}
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

      {/* Info - Minimal, clean typography */}
      <div className="space-y-1">
        <h3 className="font-sans text-tradey-black text-sm font-medium truncate group-hover:text-tradey-red transition-colors">
          {post.title}
        </h3>
        <p className="font-sans text-tradey-black/50 text-xs uppercase tracking-wide">
          {post.brand}
        </p>
        <div className="flex items-center justify-between">
          <p className="font-sans text-tradey-black/60 text-xs">
            Size {post.size}
          </p>
        </div>
      </div>
    </Link>
  );
}
