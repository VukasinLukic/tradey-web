import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useUserPosts } from '../hooks/useUserPosts';
import { useFollowUser } from '../hooks/useFollowUser';
import { useFollowers } from '../hooks/useFollowers';
import { useCreateChat } from '../hooks/useCreateChat';
import { LoadingState } from '../components/ui/LoadingState';
import { useState } from 'react';
import { usersApi } from '../services/api';
import type { Review } from '../shared/types/user.types';
import { ReportButton } from '../components/moderation/ReportButton';
import { BlockButton } from '../components/moderation/BlockButton';
import { TrustBadge } from '../components/ui/TrustBadge';
import { getUserBadges } from '../utils/badges';

export function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { userProfile, loading: profileLoading, refetch: refetchProfile } = useUserProfile(id);
  const { posts, loading: postsLoading } = useUserPosts(id);
  const { toggleFollow, loading: followLoading } = useFollowUser();
  const { followers, refetch: refetchFollowers } = useFollowers(id);
  const { createChat, loading: chatLoading } = useCreateChat();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // Fetch current user's profile to check if following
  const { userProfile: currentUserProfile, refetch: refetchCurrentUser } = useUserProfile(user?.uid);

  const isOwnProfile = user?.uid === id;

  // Calculate isFollowing from current user's following array
  const isFollowing = currentUserProfile?.following?.includes(id || '') || false;

  const handleFollow = async () => {
    if (id) {
      const success = await toggleFollow(id);
      if (success) {
        // Refetch current user's profile to update following state
        refetchCurrentUser();
        // Refetch followers count to update display
        refetchFollowers();
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!id || !user || !reviewComment.trim()) return;

    setReviewLoading(true);
    try {
      await usersApi.addReview(id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      // Refetch profile to update reviews
      refetchProfile();

      // Reset form and close modal
      setReviewRating(5);
      setReviewComment('');
      setShowReviewModal(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!id || !userProfile) return;
    // Just create chat without initial message
    await createChat(id);
  };

  if (profileLoading) {
    return <LoadingState />;
  }

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <p className="text-tradey-red font-avarabold text-lg">
          User not found
        </p>
        <Link to="/marketplace" className="text-tradey-blue hover:underline mt-4 block">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  // Calculate followers count from actual followers data
  const followersCount = followers.length;

  return (
    <div className="min-h-screen bg-tradey-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white border border-tradey-black/10 p-8 mb-8 relative shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Picture */}
            <div className="w-32 h-32 rounded-full bg-tradey-black/5 flex-shrink-0 flex items-center justify-center border-2 border-tradey-black/10 relative overflow-hidden">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-fayte text-5xl text-tradey-black">
                  {userProfile.username.charAt(0).toUpperCase()}
                </span>
              )}
              {/* Role Badge */}
              {userProfile?.role && userProfile.role !== 'user' && (
                <div className="absolute -bottom-2 px-3 py-1 bg-tradey-red text-white font-sans text-xs uppercase">
                  {userProfile.role}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-grow text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <h1 className="font-fayte text-3xl md:text-4xl text-tradey-black uppercase">
                  @{userProfile.username}
                </h1>
                {/* Trust Badges */}
                {getUserBadges(userProfile, posts.length).map((badge) => (
                  <TrustBadge key={badge} type={badge} />
                ))}
              </div>

              {/* Following / Followers Count */}
              <div className="flex gap-6 justify-center md:justify-start mb-4">
                <Link to={`/following/${id}?tab=following`} className="text-center hover:opacity-70 transition-opacity">
                  <p className="font-sans text-xl text-tradey-black font-medium">
                    {userProfile.following?.length || 0}
                  </p>
                  <p className="font-sans text-tradey-black/60 text-xs uppercase tracking-wide">Following</p>
                </Link>
                <Link to={`/following/${id}?tab=followers`} className="text-center hover:opacity-70 transition-opacity">
                  <p className="font-sans text-xl text-tradey-black font-medium">{followersCount}</p>
                  <p className="font-sans text-tradey-black/60 text-xs uppercase tracking-wide">Followers</p>
                </Link>
                <div className="text-center">
                  <p className="font-sans text-xl text-tradey-black font-medium">{posts.length}</p>
                  <p className="font-sans text-tradey-black/60 text-xs uppercase tracking-wide">Items</p>
                </div>
              </div>

              {/* Bio and Location */}
              {userProfile.bio && (
                <p className="font-sans text-tradey-black text-sm mb-3 max-w-2xl">
                  {userProfile.bio}
                </p>
              )}
              {userProfile.location && (
                <p className="flex items-center gap-2 text-tradey-black/60 font-sans text-sm justify-center md:justify-start">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {userProfile.location}
                </p>
              )}

              {/* Rating Display - Always show, even with 0 reviews */}
              <div className="flex items-center gap-2 justify-center md:justify-start mt-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(userProfile.rating || 0)
                          ? 'fill-yellow-400 stroke-yellow-400'
                          : 'fill-none stroke-tradey-black/20'
                      }`}
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  ))}
                </div>
                <span className="font-sans text-sm text-tradey-black/60">
                  {(userProfile.rating || 0).toFixed(1)} ({userProfile.totalReviews || 0} {userProfile.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {!isOwnProfile && user && (
              <div className="w-full md:w-auto flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {/* Follow Button */}
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`px-12 py-3 font-sans text-sm font-medium transition-all ${
                      isFollowing
                        ? 'bg-white border border-tradey-black/20 text-tradey-black hover:bg-tradey-black/5'
                        : 'bg-tradey-red text-white hover:bg-red-700'
                    }`}
                  >
                    {followLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                </div>

                {/* Send Message Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={chatLoading}
                  className="w-full px-6 py-2 bg-tradey-black text-white font-sans text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {chatLoading ? 'Sending...' : 'Send Message'}
                </button>

                {/* Leave Review Button */}
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="w-full px-6 py-2 border border-tradey-black/20 text-tradey-black font-sans text-sm hover:border-tradey-black hover:bg-tradey-black/5 transition-colors"
                >
                  Leave a Review
                </button>

                {/* Report & Block Buttons */}
                <div className="pt-1 flex justify-center gap-4">
                  <ReportButton targetType="user" targetId={id!} />
                  <BlockButton
                    userId={id!}
                    username={userProfile.username}
                    isBlocked={currentUserProfile?.blockedUsers?.includes(id!) || false}
                    onBlockToggle={refetchCurrentUser}
                  />
                </div>
              </div>
            )}

            {isOwnProfile && (
              <div className="w-full md:w-auto">
                <Link
                  to="/profile"
                  className="block px-8 py-3 bg-tradey-black text-white font-sans text-sm font-medium hover:bg-tradey-black/90 transition-colors text-center"
                >
                  View My Profile
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Items Section */}
        <div>
          <h2 className="font-fayte text-3xl text-tradey-black mb-6 uppercase">
            {isOwnProfile ? 'Your Items' : `${userProfile.username}'s Items`}
          </h2>

          {postsLoading ? (
            <LoadingState />
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/item/${post.id}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] relative overflow-hidden bg-gray-50 mb-3">
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Style badge - Minimal */}
                    {post.style && (
                      <div className="absolute top-2 left-2 z-10">
                        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 font-sans text-[10px] font-medium tracking-wide uppercase text-tradey-black shadow-sm">
                          {post.style}
                        </div>
                      </div>
                    )}

                    {!post.isAvailable && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <span className="font-sans text-xs text-tradey-black/60 tracking-wider">
                          TRADED
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-sans text-tradey-black text-sm font-medium truncate group-hover:text-tradey-red transition-colors">
                      {post.title}
                    </h3>
                    <p className="font-sans text-tradey-black/50 text-xs uppercase tracking-wide">
                      {post.brand}
                    </p>
                    <p className="font-sans text-tradey-black/60 text-xs">
                      Size {post.size}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border border-tradey-black/10 bg-tradey-black/5">
              <svg
                className="w-16 h-16 text-tradey-black/20 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="font-fayte text-xl text-tradey-black mb-2 uppercase">No items yet</h3>
              <p className="font-sans text-tradey-black/60 text-sm">
                {isOwnProfile ? 'Start trading by posting your first item!' : 'This user hasn\'t posted anything yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        {userProfile.reviews && userProfile.reviews.length > 0 && (
          <div className="bg-white border border-tradey-black/10 p-8 mt-8 shadow-sm">
            <h2 className="font-fayte text-2xl text-tradey-black mb-6 uppercase">
              Reviews ({userProfile.totalReviews})
            </h2>
            <div className="space-y-6 max-h-[600px] overflow-y-auto">
              {userProfile.reviews.map((review: Review) => {
                // Parse the date properly - handle both Firestore Timestamp and ISO string
                let reviewDate: Date;
                if (review.createdAt && typeof review.createdAt === 'object' && 'seconds' in review.createdAt) {
                  // Firestore Timestamp
                  reviewDate = new Date((review.createdAt as any).seconds * 1000);
                } else if (review.createdAt) {
                  // ISO string or other date format
                  reviewDate = new Date(review.createdAt);
                } else {
                  reviewDate = new Date(); // Fallback to now
                }

                return (
                  <div key={review.id} className="pb-6 border-b border-tradey-black/10 last:border-0">
                    <div className="flex items-start gap-4">
                      {/* Reviewer Avatar */}
                      <Link to={`/user/${review.reviewerId}`} className="flex-shrink-0">
                        {review.reviewerAvatarUrl ? (
                          <img
                            src={review.reviewerAvatarUrl}
                            alt={review.reviewerUsername}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-tradey-black/10 flex items-center justify-center">
                            <span className="font-sans text-lg text-tradey-black">
                              {review.reviewerUsername.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </Link>

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between mb-2">
                          <Link
                            to={`/user/${review.reviewerId}`}
                            className="font-sans font-semibold text-tradey-black hover:text-tradey-red transition-colors"
                          >
                            {review.reviewerUsername}
                          </Link>
                          <span className="font-sans text-xs text-tradey-black/40">
                            {reviewDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        {/* Star Rating */}
                        <div className="flex gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 stroke-yellow-400'
                                  : 'fill-none stroke-tradey-black/20'
                              }`}
                              strokeWidth={1.5}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              />
                            </svg>
                          ))}
                        </div>

                        {/* Review Comment */}
                        <p className="font-sans text-sm text-tradey-black/80 whitespace-pre-wrap leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && (
          <div
            className="fixed inset-0 bg-tradey-black/60 flex items-center justify-center z-50 px-4"
            onClick={() => setShowReportModal(false)}
          >
            <div
              className="bg-white border border-tradey-black/10 p-8 max-w-md w-full shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">Report User</h3>
              <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
                Report inappropriate behavior or content. Our team will review your report.
              </p>
              <textarea
                placeholder="Describe the issue..."
                className="w-full h-32 px-4 py-3 bg-white border border-tradey-black/20 text-tradey-black font-sans text-sm placeholder:text-tradey-black/40 focus:outline-none focus:border-tradey-red resize-none mb-6"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-6 py-3 border border-tradey-black/20 text-tradey-black font-sans text-sm font-medium hover:bg-tradey-black/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement report functionality
                    setShowReportModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-tradey-red text-white font-sans text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div
            className="fixed inset-0 bg-tradey-black/60 flex items-center justify-center z-50 px-4"
            onClick={() => setShowReviewModal(false)}
          >
            <div
              className="bg-white border border-tradey-black/10 p-8 max-w-md w-full shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">Leave a Review</h3>

              {/* Rating Selector */}
              <div className="mb-6">
                <label className="font-sans text-sm font-semibold text-tradey-black mb-3 block">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <svg
                        className={`w-8 h-8 ${
                          star <= reviewRating
                            ? 'fill-yellow-400 stroke-yellow-400'
                            : 'fill-none stroke-tradey-black/20 hover:stroke-yellow-400'
                        }`}
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <div className="mb-6">
                <label className="font-sans text-sm font-semibold text-tradey-black mb-3 block">
                  Your Review
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this user..."
                  className="w-full h-32 px-4 py-3 bg-white border border-tradey-black/20 text-tradey-black font-sans text-sm placeholder:text-tradey-black/40 focus:outline-none focus:border-tradey-red resize-none"
                  disabled={reviewLoading}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  disabled={reviewLoading}
                  className="flex-1 px-6 py-3 border border-tradey-black/20 text-tradey-black font-sans text-sm font-medium hover:bg-tradey-black/5 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={reviewLoading || !reviewComment.trim()}
                  className="flex-1 px-6 py-3 bg-tradey-red text-white font-sans text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
