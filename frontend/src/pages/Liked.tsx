import { useAuth } from '../hooks/useAuth';
import { useLikedPosts } from '../hooks/useLikedPosts';
import { useLikePost } from '../hooks/useLikePost';
import { Spinner } from '../components/ui/Spinner';
import { PostCard } from '../components/post/PostCard';
import { Link } from 'react-router-dom';

export function LikedPage() {
  const { user } = useAuth();
  const { posts, loading, error, refetch } = useLikedPosts(user?.uid);
  const { toggleLike } = useLikePost();

  const handleUnlike = async (postId: string) => {
    const success = await toggleLike(postId);
    if (success) {
      // Refetch liked posts to update the list
      refetch();
    }
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
        <p className="text-tradey-red font-garamond text-lg">
          Error loading liked posts. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-fayte text-5xl md:text-7xl text-tradey-black mb-2 tracking-tight uppercase">
          Liked
        </h1>
        <p className="font-sans text-tradey-black/60 text-sm">
          Your saved items for future trades
        </p>
      </div>

      {/* Content */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-tradey-black/20">
          <svg
            className="w-16 h-16 stroke-tradey-black/30 mb-6"
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
          <h2 className="font-sans text-xl text-tradey-black font-medium mb-2">
            No liked items yet
          </h2>
          <p className="font-sans text-tradey-black/50 text-sm mb-6">
            Start exploring and save items you love!
          </p>
          <Link
            to="/marketplace"
            className="px-6 py-3 bg-tradey-red text-white font-sans text-sm hover:opacity-90 transition-opacity"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {posts.map(post => (
            <div key={post.id} className="relative group">
              <PostCard post={post} />
              {/* Unlike button overlay */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleUnlike(post.id);
                }}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                aria-label="Unlike item"
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