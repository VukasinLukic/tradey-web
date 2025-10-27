import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePost } from '../hooks/usePost';
import { useAuth } from '../hooks/useAuth';
import { useCreateChat } from '../hooks/useCreateChat';
import { useLikePost } from '../hooks/useLikePost';
import { useUserProfile } from '../hooks/useUserProfile';
import { LoadingState } from '../components/ui/LoadingState';
import { ClothingConditions } from '../shared/types/post.types';
import type { Comment, Post } from '../shared/types/post.types';
import { postsApi, usersApi } from '../services/api';
import { ProductCard } from '../components/post/ProductCard';

export function ItemViewPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { post, loading } = usePost(id);
  const { createChat, loading: chatLoading } = useCreateChat();
  const { toggleLike } = useLikePost();
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [moreLikeThis, setMoreLikeThis] = useState<Post[]>([]);
  const [moreLikeThisLoading, setMoreLikeThisLoading] = useState(false);

  const { userProfile: currentUserProfile, refetch: refetchCurrentUser } = useUserProfile(user?.uid);
  const { userProfile: sellerProfile } = useUserProfile(post?.authorId);

  useEffect(() => {
    if (post?.comments) {
      setComments(post.comments);
    }
  }, [post]);

  useEffect(() => {
    async function fetchMoreLikeThis() {
      if (!post || !user?.uid) return;

      setMoreLikeThisLoading(true);
      try {
        const response = await usersApi.getRecommendations(user.uid, { limit: 8 });
        const recommendations = Array.isArray(response.data) ? response.data : [];
        const filtered = recommendations.filter(p => p.id !== post.id).slice(0, 4);
        setMoreLikeThis(filtered);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        try {
          const fallback = await postsApi.getPosts({ limit: 5 });
          const posts = Array.isArray(fallback.data) ? fallback.data : [];
          const filtered = posts.filter(p => p.id !== post.id).slice(0, 4);
          setMoreLikeThis(filtered);
        } catch {
          setMoreLikeThis([]);
        }
      } finally {
        setMoreLikeThisLoading(false);
      }
    }

    fetchMoreLikeThis();
  }, [post, user?.uid]);

  const isLiked = currentUserProfile?.likedPosts?.includes(id || '') || false;

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

  const handleDelete = async () => {
    if (!id) return;
    setDeleteLoading(true);
    try {
      await postsApi.delete(id);
      navigate('/profile');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user || !commentText.trim()) return;

    setCommentLoading(true);
    try {
      const response = await postsApi.addComment(id, commentText.trim());
      const newComment = response.data;
      setComments(prev => [...prev, newComment]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLike = async () => {
    if (!id || !user) return;
    await toggleLike(id);
    refetchCurrentUser();
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="font-fayte text-2xl text-tradey-red mb-4 uppercase">Item not found</h2>
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm font-sans text-tradey-black/40">
          <Link to="/marketplace" className="hover:text-tradey-red transition-colors">
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-tradey-black/60">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-20">
          {/* LEFT: Image Gallery - 3 columns */}
          <div className="lg:col-span-3">
            <div className="aspect-[3/4] bg-gray-50 mb-4 overflow-hidden relative">
              <img
                src={currentMainImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              {/* Style Badge - Minimal */}
              {post.style && (
                <div className="absolute top-3 left-3 z-10">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 font-sans text-xs font-medium tracking-wide uppercase text-tradey-black shadow-sm">
                    {post.style}
                  </div>
                </div>
              )}
              {!post.isAvailable && (
                <div className="absolute inset-0 bg-tradey-black/70 flex items-center justify-center">
                  <span className="font-fayte text-white text-5xl px-10 py-5 bg-tradey-red uppercase">
                    TRADED
                  </span>
                </div>
              )}
            </div>
            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-20 h-20 overflow-hidden transition-all ${
                    img === currentMainImage
                      ? 'ring-2 ring-tradey-red'
                      : 'ring-1 ring-tradey-black/10 hover:ring-tradey-red/50'
                  }`}
                >
                  <img src={img} alt={`${post.title} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info - 2 columns */}
          <div className="lg:col-span-2">
            {/* Container with black border around everything */}
            <div className="border-2 border-tradey-black p-8 space-y-8">
            {/* Title & Brand - Large */}
            <div className="border-b border-tradey-black/10 pb-6">
              <h1 className="font-fayte text-5xl md:text-6xl text-tradey-black mb-3 uppercase leading-tight">
                {post.title}
              </h1>
              <p className="font-sans text-2xl text-tradey-black/50">{post.brand}</p>

              {/* Seller - Right below brand - Larger */}
              <Link
                to={`/user/${post.authorId}`}
                className="flex items-center gap-3 mt-6 group"
              >
                <span className="font-sans text-sm text-tradey-black/40 uppercase tracking-wide">Seller:</span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-tradey-black/5 ring-2 ring-tradey-black/10">
                    {sellerProfile?.avatarUrl ? (
                      <img
                        src={sellerProfile.avatarUrl}
                        alt={post.authorUsername}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-sans text-base text-tradey-black">
                          {post.authorUsername.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="font-sans text-base text-tradey-black font-semibold group-hover:text-tradey-red transition-colors">
                    @{post.authorUsername}
                  </span>
                </div>
              </Link>
            </div>

            {/* Specs Container - Organized Grid */}
            <div className="bg-tradey-black/[0.02] border border-tradey-black/10 p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Condition */}
                <div>
                  <p className="font-sans text-xs text-tradey-black/40 uppercase tracking-wide mb-2">Condition</p>
                  <p className="font-sans text-base text-tradey-black font-semibold">
                    {ClothingConditions[post.condition as keyof typeof ClothingConditions].split('(')[0].trim()}
                  </p>
                </div>

                {/* Size */}
                <div>
                  <p className="font-sans text-xs text-tradey-black/40 uppercase tracking-wide mb-2">Size</p>
                  <p className="font-sans text-2xl text-tradey-black font-bold">{post.size}</p>
                </div>

                {/* Location */}
                <div>
                  <p className="font-sans text-xs text-tradey-black/40 uppercase tracking-wide mb-2">Location</p>
                  <p className="font-sans text-base text-tradey-black font-semibold">{post.authorLocation}</p>
                </div>

                {/* Type */}
                <div>
                  <p className="font-sans text-xs text-tradey-black/40 uppercase tracking-wide mb-2">Type</p>
                  <p className="font-sans text-base text-tradey-black font-semibold">{post.type}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-l-2 border-tradey-black/10 pl-6">
              <p className="font-sans text-tradey-black/70 leading-relaxed whitespace-pre-wrap">
                {post.description}
              </p>
            </div>

            {/* Trade Preferences - Subtle */}
            {post.tradePreferences && (
              <div className="bg-tradey-red/5 border-l-4 border-tradey-red px-6 py-4">
                <p className="font-sans text-xs text-tradey-red/70 uppercase tracking-wide mb-2">Would NOT trade for</p>
                <p className="font-sans text-tradey-black/80">{post.tradePreferences}</p>
              </div>
            )}

            {/* Action Buttons - Minimal */}
            <div className="space-y-3 pt-4">
              {!isOwnPost && user && (
                <>
                  <button
                    onClick={handleContactSeller}
                    disabled={chatLoading}
                    className="w-full px-6 py-3 bg-tradey-black text-white font-sans text-sm uppercase tracking-wide hover:bg-tradey-red transition-colors disabled:opacity-50"
                  >
                    {chatLoading ? 'Loading...' : 'Contact Seller'}
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleLike}
                      className={`px-4 py-2 font-sans text-sm transition-all flex items-center justify-center gap-2 ${
                        isLiked
                          ? 'bg-tradey-red text-white'
                          : 'bg-tradey-black/5 text-tradey-black hover:bg-tradey-black/10'
                      }`}
                    >
                      <svg className={`w-4 h-4 ${isLiked ? 'fill-white' : 'fill-none'}`} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {isLiked ? 'Liked' : 'Like'}
                    </button>
                    <button
                      onClick={handleShare}
                      className="px-4 py-2 bg-tradey-black/5 text-tradey-black hover:bg-tradey-black/10 font-sans text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                  </div>
                </>
              )}
              {isOwnPost && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-tradey-black text-white font-sans text-sm hover:bg-tradey-red transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-tradey-black/5 text-tradey-red font-sans text-sm hover:bg-tradey-red/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>

        {/* Comments Section - Modern Rounded */}
        <div className="mb-20 max-w-4xl">
          <h3 className="font-fayte text-4xl text-tradey-black uppercase mb-8">
            Comments ({comments.length})
          </h3>

          {comments.length === 0 ? (
            <div className="bg-tradey-black/[0.02] rounded-2xl p-12 text-center">
              <p className="font-sans text-tradey-black/30 italic">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            <div className="space-y-6 mb-8">
              {comments.map((comment, index) => (
                <div
                  key={comment.id}
                  className={`flex items-start gap-4 pb-6 ${
                    index !== comments.length - 1 ? 'border-b border-tradey-black/5' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-tradey-black/5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {comment.avatarUrl ? (
                      <img
                        src={comment.avatarUrl}
                        alt={comment.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-sans text-sm text-tradey-black/50">
                        {comment.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="font-sans font-semibold text-tradey-black text-sm">
                        {comment.username}
                      </span>
                      <span className="font-sans text-xs text-tradey-black/30">
                        {(() => {
                          if (!comment.createdAt) return 'Just now';

                          try {
                            // Check if it's a Firestore Timestamp
                            if (typeof comment.createdAt === 'object' && 'seconds' in comment.createdAt) {
                              return new Date((comment.createdAt as any).seconds * 1000).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              });
                            }

                            // Try to parse as regular date
                            const date = new Date(comment.createdAt);
                            if (isNaN(date.getTime())) {
                              return 'Just now';
                            }

                            return date.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            });
                          } catch (error) {
                            return 'Just now';
                          }
                        })()}
                      </span>
                    </div>
                    <p className="font-sans text-tradey-black/70 text-sm leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {user && (
            <form onSubmit={handleAddComment} className="space-y-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-5 py-4 bg-white border-2 border-tradey-black/10 rounded-xl font-sans text-sm text-tradey-black placeholder:text-tradey-black/30 focus:outline-none focus:border-tradey-red transition-all resize-none"
                rows={3}
                disabled={commentLoading}
              />
              <button
                type="submit"
                disabled={commentLoading || !commentText.trim()}
                className="px-6 py-2 bg-tradey-black text-white font-sans text-sm uppercase tracking-wide hover:bg-tradey-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {commentLoading ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          )}
        </div>

        {/* More Like This Section */}
        {moreLikeThis.length > 0 && (
          <div className="mb-16">
            <h2 className="font-fayte text-6xl md:text-7xl text-tradey-black uppercase mb-12 text-center">
              MORE LIKE THIS
            </h2>
            {moreLikeThisLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {moreLikeThis.map((product) => (
                  <ProductCard key={product.id} post={product} showSaveButton={!!user} showAuthor={true} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Share Modal - Minimal */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-fayte text-2xl text-tradey-black uppercase mb-6">Share This Item</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={window.location.href}
                readOnly
                className="flex-1 px-4 py-3 bg-tradey-black/5 rounded-lg font-sans text-sm"
              />
              <button
                onClick={copyLinkToClipboard}
                className="px-6 py-3 bg-tradey-black text-white font-sans text-sm uppercase tracking-wide hover:bg-tradey-red transition-colors rounded-lg"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal - Minimal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-fayte text-2xl text-tradey-black uppercase mb-4">Delete Item?</h3>
            <p className="font-sans text-tradey-black/60 mb-8">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-tradey-black/5 text-tradey-black font-sans hover:bg-tradey-black/10 transition-colors rounded-lg"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 bg-tradey-red text-white font-sans hover:opacity-90 transition-opacity disabled:opacity-50 rounded-lg"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
