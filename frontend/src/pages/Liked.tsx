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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-fayte text-5xl md:text-7xl text-tradey-white mb-4">
          Liked Items
        </h1>
        <p className="font-garamond text-tradey-blue text-lg">
          Your saved items for future trades
        </p>
      </div>

      {/* Content */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-tradey-red/30 rounded-lg">
          <svg
            className="w-20 h-20 text-tradey-red/50 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h2 className="font-garamond text-2xl text-tradey-white mb-2">
            No liked items yet
          </h2>
          <p className="font-garamond text-tradey-blue mb-6">
            Start exploring and save items you love!
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-tradey-red text-tradey-white font-garamond font-bold rounded-md hover:opacity-90 transition-opacity"
          >
            Browse Items
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map(post => (
            <div key={post.id} className="relative group">
              <PostCard post={post} />
              {/* Unlike button overlay */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleUnlike(post.id);
                }}
                className="absolute top-2 right-2 w-10 h-10 bg-tradey-black/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-tradey-red hover:scale-110"
                aria-label="Unlike item"
              >
                <svg
                  className="w-5 h-5 text-tradey-white fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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