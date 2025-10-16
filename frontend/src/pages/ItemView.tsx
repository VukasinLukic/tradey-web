import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { usePost } from '../hooks/usePost';
import { useAuth } from '../hooks/useAuth';
import { useCreateChat } from '../hooks/useCreateChat';
import { useLikePost } from '../hooks/useLikePost';
import { useMarketplace } from '../hooks/useMarketplace';
import { useUserProfile } from '../hooks/useUserProfile';
import { Spinner } from '../components/ui/Spinner';
import { ClothingConditions } from '../../../shared/types/post.types';

export function ItemViewPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { post, loading } = usePost(id);
  const { createChat, loading: chatLoading } = useCreateChat();
  const { toggleLike } = useLikePost();
  const { allPosts } = useMarketplace();
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Fetch current user's profile to check liked posts
  const { userProfile: currentUserProfile, refetch: refetchCurrentUser } = useUserProfile(user?.uid);

  // Calculate if post is liked by current user
  const isLiked = currentUserProfile?.likedPosts?.includes(id || '') || false;
  const likesCount = 0; // TODO: Implement likes count on backend

  // Related products (same author or similar size/condition)
  const relatedProducts = useMemo(() => {
    if (!post) return [];
    return allPosts
      .filter(
        (p) =>
          p.id !== post.id &&
          (p.authorId === post.authorId || p.size === post.size || p.condition === post.condition)
      )
      .slice(0, 4);
  }, [post, allPosts]);

  const handleContactSeller = async () => {
    if (!post || !user) return;
    const message = `Hey, I'm interested in "${post.title}". Can we discuss a trade?`;
    await createChat(post.authorId, message);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post?.title,
          text: `Check out this item: ${post?.title}`,
          url: window.location.href,
        })
        .catch(() => setShowShareModal(true));
    } else {
      setShowShareModal(true);
    }
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="font-avarabold text-2xl text-tradey-red mb-4">Item not found</h2>
        <Link to="/marketplace" className="text-tradey-blue hover:underline">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const images = post.images || [];
  const currentMainImage = mainImage || images[0];
  const isOwnPost = user?.uid === post.authorId;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm font-sans text-tradey-black">
        <Link to="/marketplace" className="hover:text-tradey-red transition-colors">
          Marketplace
        </Link>
        <span>/</span>
        <span className="text-tradey-black/60">{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-[3/4] bg-gray-100 mb-4 overflow-hidden relative">
            <img
              src={currentMainImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            {!post.isAvailable && (
              <div className="absolute inset-0 bg-tradey-black/70 flex items-center justify-center">
                <span className="font-fayte text-tradey-white text-2xl px-6 py-3 bg-tradey-red">
                  TRADED
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(img)}
                className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-all ${
                  img === currentMainImage
                    ? 'border-tradey-red'
                    : 'border-tradey-black/20 hover:border-tradey-red/60'
                }`}
              >
                <img src={img} alt={`${post.title} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Post Details */}
        <div className="bg-white p-8 shadow-sm border border-tradey-black/10">
          {/* Title & Brand */}
          <div className="mb-6">
            <h1 className="font-fayte text-4xl md:text-5xl text-tradey-black mb-2 uppercase">
              {post.title}
            </h1>
            <p className="font-sans text-2xl text-tradey-black/60">{post.brand}</p>
          </div>

          <hr className="border-tradey-black/10 my-6" />

          {/* Details Grid */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-tradey-black/5">
              <span className="font-sans text-tradey-black/60 font-medium">Condition:</span>
              <span className="font-sans text-tradey-black font-semibold">
                {ClothingConditions[post.condition as keyof typeof ClothingConditions]}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-tradey-black/5">
              <span className="font-sans text-tradey-black/60 font-medium">Size:</span>
              <span className="font-sans text-tradey-black font-semibold">{post.size}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-tradey-black/5">
              <span className="font-sans text-tradey-black/60 font-medium">Location:</span>
              <span className="font-sans text-tradey-black font-semibold">{post.authorLocation}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-tradey-black/5">
              <span className="font-sans text-tradey-black/60 font-medium">Seller:</span>
              <Link
                to={`/user/${post.authorId}`}
                className="font-sans text-tradey-red font-semibold hover:underline transition-colors"
              >
                @{post.authorUsername}
              </Link>
            </div>
          </div>

          <hr className="border-tradey-black/10 my-6" />

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-sans text-tradey-black font-semibold text-lg mb-3">Description</h3>
            <p className="font-sans text-tradey-black/70 whitespace-pre-wrap leading-relaxed">
              {post.description}
            </p>
          </div>

          {/* Trade Preferences */}
          {post.tradePreferences && (
            <div className="mb-6 bg-tradey-red/5 p-4 border border-tradey-red/20">
              <h3 className="font-sans text-tradey-red font-semibold text-sm mb-2">Would NOT trade for:</h3>
              <p className="font-sans text-tradey-black/70">{post.tradePreferences}</p>
            </div>
          )}

          <hr className="border-tradey-black/10 my-6" />

          {/* Actions */}
          <div className="space-y-3">
            {!isOwnPost && post.isAvailable && user && (
              <button
                onClick={handleContactSeller}
                disabled={chatLoading}
                className="w-full px-6 py-4 bg-tradey-red text-white font-sans text-base font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {chatLoading ? 'Starting conversation...' : 'Contact Seller'}
              </button>
            )}

            {!user && (
              <Link
                to="/login"
                className="block w-full px-6 py-4 bg-tradey-red text-white font-sans text-base font-semibold hover:opacity-90 transition-opacity text-center"
              >
                Login to Contact Seller
              </Link>
            )}

            <div className="flex gap-3">
              {user && id && !isOwnPost && (
                <button
                  onClick={async () => {
                    const success = await toggleLike(id);
                    if (success) {
                      refetchCurrentUser();
                    }
                  }}
                  className={`flex-1 px-6 py-3 border-2 ${
                    isLiked
                      ? 'border-tradey-red bg-tradey-red/10 text-tradey-red'
                      : 'border-tradey-black/20 text-tradey-black hover:border-tradey-red hover:text-tradey-red'
                  } font-sans font-semibold hover:bg-tradey-red/5 transition-colors flex items-center justify-center gap-2`}
                >
                  <svg
                    className={`w-5 h-5 ${isLiked ? 'fill-tradey-red' : 'fill-none'}`}
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
                  {isLiked ? 'Liked' : 'Like'} {likesCount > 0 && `(${likesCount})`}
                </button>
              )}

              <button
                onClick={handleShare}
                className="px-6 py-3 border-2 border-tradey-black/20 text-tradey-black hover:border-tradey-black font-sans font-semibold hover:bg-tradey-black/5 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="font-avarabold text-3xl text-tradey-white mb-8">More like this</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedPost) => (
              <Link key={relatedPost.id} to={`/item/${relatedPost.id}`} className="group">
                <div className="bg-tradey-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={relatedPost.images[0]}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-avarabold text-tradey-black text-lg truncate">
                      {relatedPost.title}
                    </h3>
                    <p className="font-sans text-tradey-black/60 text-sm">{relatedPost.brand}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-tradey-black/80 flex items-center justify-center z-50 px-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-tradey-black border-2 border-tradey-red rounded-lg p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-avarabold text-2xl text-tradey-white mb-4">Share this item</h3>
            <div className="flex items-center gap-3 bg-tradey-red/10 border-2 border-tradey-red/30 rounded-lg p-3 mb-4">
              <input
                type="text"
                value={window.location.href}
                readOnly
                className="flex-1 bg-transparent text-tradey-white font-sans text-sm focus:outline-none"
              />
              <button
                onClick={copyLinkToClipboard}
                className="px-4 py-2 bg-tradey-red text-tradey-white font-avarabold rounded-lg hover:opacity-90 transition-opacity"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full px-6 py-3 border-2 border-tradey-red/30 text-tradey-white font-avarabold rounded-lg hover:bg-tradey-red/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
