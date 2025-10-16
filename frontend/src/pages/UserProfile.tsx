import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useUserPosts } from '../hooks/useUserPosts';
import { useFollowUser } from '../hooks/useFollowUser';
import { Spinner } from '../components/ui/Spinner';
import { useState } from 'react';

export function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { userProfile, loading: profileLoading, refetch } = useUserProfile(id);
  const { posts, loading: postsLoading } = useUserPosts(id);
  const { toggleFollow, loading: followLoading } = useFollowUser();
  const [showReportModal, setShowReportModal] = useState(false);

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
      }
    }
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
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

  // Calculate followers count (users who follow this profile)
  const followersCount = 0; // TODO: Implement followers tracking on backend

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-tradey-white/5 border-2 border-tradey-red/30 rounded-lg p-8 mb-8 relative">
        {/* Report Button (top right corner for non-own profiles) */}
        {!isOwnProfile && user && (
          <button
            onClick={() => setShowReportModal(true)}
            className="absolute top-4 right-4 text-tradey-blue/60 hover:text-tradey-red transition-colors"
            title="Report User"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
              />
            </svg>
          </button>
        )}

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Picture */}
          <div className="w-32 h-32 rounded-full bg-tradey-red/20 flex-shrink-0 flex items-center justify-center border-4 border-tradey-red/40 relative">
            {userProfile.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="font-fayte text-6xl text-tradey-white">
                {userProfile.username.charAt(0).toUpperCase()}
              </span>
            )}
            {/* Role Badge */}
            {userProfile?.role && userProfile.role !== 'user' && (
              <div className="absolute -bottom-2 px-3 py-1 bg-tradey-red text-tradey-white font-avarabold text-xs rounded-full uppercase">
                {userProfile.role}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-grow text-center md:text-left">
            <h1 className="font-avarabold text-4xl md:text-5xl text-tradey-white mb-2">
              {userProfile.username}
            </h1>

            {/* Following / Followers Count */}
            <div className="flex gap-6 justify-center md:justify-start mb-4">
              <div className="text-center">
                <p className="font-fayte text-2xl text-tradey-red">
                  {userProfile.following?.length || 0}
                </p>
                <p className="font-sans text-tradey-blue text-sm">Following</p>
              </div>
              <div className="text-center">
                <p className="font-fayte text-2xl text-tradey-red">{followersCount}</p>
                <p className="font-sans text-tradey-blue text-sm">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-fayte text-2xl text-tradey-red">{posts.length}</p>
                <p className="font-sans text-tradey-blue text-sm">Items</p>
              </div>
            </div>

            {/* Bio and Location */}
            {userProfile.bio && (
              <p className="font-avarabold text-tradey-white text-lg mb-3 max-w-2xl">
                {userProfile.bio}
              </p>
            )}
            {userProfile.location && (
              <p className="flex items-center gap-2 text-tradey-blue font-sans justify-center md:justify-start">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </div>

          {/* Action Buttons */}
          {!isOwnProfile && user && (
            <div className="w-full md:w-auto flex flex-col gap-3">
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`px-8 py-3 font-avarabold rounded-lg transition-all ${
                  isFollowing
                    ? 'bg-transparent border-2 border-tradey-red text-tradey-red hover:bg-tradey-red/10'
                    : 'bg-tradey-red text-tradey-white hover:opacity-90'
                }`}
              >
                {followLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          )}

          {isOwnProfile && (
            <div className="w-full md:w-auto">
              <Link
                to="/profile"
                className="block px-8 py-3 bg-tradey-blue text-tradey-black font-avarabold rounded-lg hover:opacity-90 transition-opacity text-center"
              >
                View My Profile
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Items Section */}
      <div>
        <h2 className="font-avarabold text-3xl text-tradey-white mb-6">
          {isOwnProfile ? 'Your Items' : `${userProfile.username}'s Items`}
        </h2>

        {postsLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/item/${post.id}`}
                className="group block"
              >
                <div className="bg-tradey-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {!post.isAvailable && (
                      <div className="absolute inset-0 bg-tradey-black/60 flex items-center justify-center">
                        <span className="font-avarabold text-tradey-white text-lg px-4 py-2 bg-tradey-red/90 rounded-lg">
                          TRADED
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-avarabold text-tradey-black text-lg mb-1 truncate">
                      {post.title}
                    </h3>
                    <p className="font-sans text-tradey-black/60 text-sm">{post.brand}</p>
                    <p className="font-sans text-tradey-black/80 text-sm mt-2">Size {post.size}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
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
            <h3 className="font-avarabold text-2xl text-tradey-white mb-2">No items yet</h3>
            <p className="font-sans text-tradey-blue">
              {isOwnProfile ? 'Start trading by posting your first item!' : 'This user hasn\'t posted anything yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div
          className="fixed inset-0 bg-tradey-black/80 flex items-center justify-center z-50 px-4"
          onClick={() => setShowReportModal(false)}
        >
          <div
            className="bg-tradey-black border-2 border-tradey-red rounded-lg p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-avarabold text-2xl text-tradey-white mb-4">Report User</h3>
            <p className="font-sans text-tradey-blue mb-6">
              Report inappropriate behavior or content. Our team will review your report.
            </p>
            <textarea
              placeholder="Describe the issue..."
              className="w-full h-32 px-4 py-3 bg-tradey-black border-2 border-tradey-red/30 rounded-lg text-tradey-white font-sans placeholder:text-tradey-blue/50 focus:outline-none focus:border-tradey-red resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-6 py-3 border-2 border-tradey-red/30 text-tradey-white font-avarabold rounded-lg hover:bg-tradey-red/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement report functionality
                  setShowReportModal(false);
                }}
                className="flex-1 px-6 py-3 bg-tradey-red text-tradey-white font-avarabold rounded-lg hover:opacity-90 transition-opacity"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
