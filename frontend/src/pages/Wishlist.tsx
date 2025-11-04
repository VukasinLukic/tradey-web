import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWishlistPosts } from '../hooks/useWishlistPosts';
import { useLikePost } from '../hooks/useLikePost';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { PostCard } from '../components/post/PostCard';

export function WishlistPage() {
  const { user } = useAuth();
  const { posts, loading, error, refetch } = useWishlistPosts(user?.uid);
  const { toggleLike } = useLikePost();
  const [minimumLoadingPassed, setMinimumLoadingPassed] = useState(false);

  // Ensure minimum loading time to prevent UI flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumLoadingPassed(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveFromWishlist = async (postId: string) => {
    const success = await toggleLike(postId);
    if (success) {
      // Refetch wishlist posts to update the list
      refetch();
    }
  };

  if (loading || !minimumLoadingPassed) {
    return <LoadingState message="Učitavanje wishliste..." size="lg" />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-tradey-red font-garamond text-lg">
          Greška pri učitavanju wishliste. Molimo pokušajte ponovo.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-fayte text-5xl md:text-7xl text-tradey-black mb-2 tracking-tight uppercase">
          Wishlist
        </h1>
        <p className="font-sans text-tradey-black/60 text-sm">
          Your saved items for future trades
        </p>
      </div>

      {/* Content */}
      {posts.length === 0 ? (
        <EmptyState
          icon={
            <svg
              className="w-16 h-16 stroke-tradey-black/30"
              fill="none"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          }
          title="Još nemate artikala u wishlisti"
          description="Istražujte marketplace i dodajte artikle u wishlistu!"
          actionLabel="Istražite Marketplace"
          actionLink="/marketplace"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {posts.map(post => (
            <div key={post.id} className="relative group">
              <PostCard post={post} />
              {/* Remove from wishlist button overlay */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveFromWishlist(post.id);
                }}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                aria-label="Remove from wishlist"
              >
                <svg
                  className="w-4 h-4 fill-tradey-red"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 