import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../hooks/useMarketplace';
import { useLikePost } from '../hooks/useLikePost';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState, EmptyIcons } from '../components/ui/EmptyState';
import { ClothingConditions } from '../shared/types/post.types';
import type { ClothingCondition, Post } from '../shared/types/post.types';
import { StickyFooter, FooterContent } from '../components/navigation/StickyFooter';
import { CLOTHING_STYLES } from '../constants/clothing';

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
  const [minimumLoadingPassed, setMinimumLoadingPassed] = useState(false);

  // Ensure minimum loading time to prevent UI flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumLoadingPassed(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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

          {/* Style Filter */}
          <select
            value={filters.style || ''}
            onChange={(e) => updateFilters({ style: e.target.value || undefined })}
            className="px-4 py-2 border border-tradey-black/20 rounded-none text-tradey-black font-sans text-sm focus:outline-none focus:border-tradey-red transition-colors bg-white cursor-pointer"
          >
            <option value="">All Styles</option>
            {CLOTHING_STYLES.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {(filters.search || filters.size || filters.condition || filters.style) && (
            <button
              onClick={resetFilters}
              className="text-tradey-red font-sans text-sm hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results count */}
        {(filters.search || filters.size || filters.condition || filters.style) && (
          <p className="text-tradey-black/60 font-sans text-sm mt-4">
            {totalResults} {totalResults === 1 ? 'item' : 'items'}
          </p>
        )}
      </div>

      {/* Product Grid - Clean, minimal like the image */}
      {posts.length === 0 ? (
        <EmptyState
          icon={
            (filters.search || filters.size || filters.condition || filters.style)
              ? <EmptyIcons.NoSearch />
              : <EmptyIcons.NoItems />
          }
          title={
            (filters.search || filters.size || filters.condition || filters.style)
              ? 'Nema rezultata'
              : 'Nema artikala'
          }
          description={
            (filters.search || filters.size || filters.condition || filters.style)
              ? 'Pokušajte sa drugačijim filterima ili pretragom.'
              : 'Trenutno nema dostupnih artikala. Budite prvi koji će podeliti nešto!'
          }
          actionLabel={
            (filters.search || filters.size || filters.condition || filters.style)
              ? 'Uklonite filtere'
              : undefined
          }
          onAction={(filters.search || filters.size || filters.condition || filters.style) ? resetFilters : undefined}
        />
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

      <StickyFooter heightValue="80dvh">
        <FooterContent />
      </StickyFooter>
    </>
  );
}

// Product Card - Clean, minimal inspired by bizus.cz
function ProductCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const { toggleLike, loading } = useLikePost();
  const [isHovered, setIsHovered] = useState(false);

  // Fetch current user's profile to check liked posts
  const { userProfile: currentUserProfile, refetch: refetchCurrentUser } = useUserProfile(user?.uid);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      const success = await toggleLike(post.id);
      if (success) {
        refetchCurrentUser();
      }
    }
  };

  // Calculate if post is liked by current user
  const isLiked = currentUserProfile?.likedPosts?.includes(post.id) || false;

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
            className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-white transition-all transform hover:scale-125 active:scale-110 hover:rotate-12"
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
