import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useUserPosts } from '../hooks/useUserPosts';
import { Spinner } from '../components/ui/Spinner';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

export function ProfilePage() {
  const { user } = useAuth();
  const { userProfile, loading: profileLoading } = useUserProfile(user?.uid);
  const { posts, loading: postsLoading } = useUserPosts(user?.uid);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
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
          Error loading profile. Please try again.
        </p>
      </div>
    );
  }

  // Calculate followers count (in a real app, backend would track this)
  const followersCount = 0; // TODO: Implement followers tracking

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header - Minimalist Lookbook Style */}
      <div className="bg-tradey-white/5 border-2 border-tradey-red/30 rounded-lg p-8 md:p-12 mb-12">
        <div className="flex flex-col items-center text-center mb-8">
          {/* Profile Picture */}
          <div className="w-40 h-40 rounded-full bg-tradey-red/20 flex items-center justify-center border-4 border-tradey-red/40 mb-6">
            {userProfile.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="font-fayte text-7xl text-tradey-white">
                {userProfile.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Username */}
          <h1 className="font-avarabold text-5xl md:text-6xl text-tradey-white mb-4">
            {userProfile.username}
          </h1>

          {/* Stats */}
          <div className="flex gap-8 mb-6">
            <div className="text-center">
              <p className="font-fayte text-3xl text-tradey-red">{posts.length}</p>
              <p className="font-sans text-tradey-blue text-sm">Items</p>
            </div>
            <div className="text-center">
              <p className="font-fayte text-3xl text-tradey-red">
                {userProfile.following?.length || 0}
              </p>
              <p className="font-sans text-tradey-blue text-sm">Following</p>
            </div>
            <div className="text-center">
              <p className="font-fayte text-3xl text-tradey-red">{followersCount}</p>
              <p className="font-sans text-tradey-blue text-sm">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-fayte text-3xl text-tradey-red">
                {userProfile.likedPosts?.length || 0}
              </p>
              <p className="font-sans text-tradey-blue text-sm">Liked</p>
            </div>
          </div>

          {/* Bio */}
          {userProfile.bio && (
            <p className="font-avarabold text-tradey-white text-lg mb-4 max-w-2xl">
              {userProfile.bio}
            </p>
          )}

          {/* Location */}
          {userProfile.location && (
            <p className="flex items-center gap-2 text-tradey-blue font-sans mb-6">
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

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-6 py-3 border-2 border-tradey-blue text-tradey-blue font-avarabold rounded-lg hover:bg-tradey-blue/10 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Profile
            </button>
            <Link
              to="/post/new"
              className="px-6 py-3 bg-tradey-red text-tradey-white font-avarabold rounded-lg hover:opacity-90 transition-opacity"
            >
              Post New Item
            </Link>
            <Link
              to="/chat"
              className="px-6 py-3 bg-tradey-blue text-tradey-black font-avarabold rounded-lg hover:opacity-90 transition-opacity"
            >
              Messages
            </Link>
            <Link
              to="/liked"
              className="px-6 py-3 border-2 border-tradey-red/30 text-tradey-white font-avarabold rounded-lg hover:bg-tradey-red/10 transition-colors"
            >
              Liked Items
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-3 border-2 border-tradey-red/30 text-tradey-red font-avarabold rounded-lg hover:bg-tradey-red/10 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* My Items Section - Lookbook Style Grid */}
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-avarabold text-4xl text-tradey-white">My Collection</h2>
          <div className="h-[2px] flex-1 bg-tradey-red/30 ml-6"></div>
        </div>

        {postsLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/item/${post.id}`}
                className="group block"
              >
                <div className="bg-tradey-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Availability Overlay */}
                    {!post.isAvailable && (
                      <div className="absolute inset-0 bg-tradey-black/60 flex items-center justify-center">
                        <span className="font-avarabold text-tradey-white text-sm px-4 py-2 bg-tradey-red/90 rounded-lg">
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
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-tradey-red/30 rounded-lg bg-tradey-white/5">
            <svg
              className="w-24 h-24 text-tradey-red/50 mb-6"
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
            <h3 className="font-avarabold text-3xl text-tradey-white mb-3">
              Your closet is empty
            </h3>
            <p className="font-sans text-tradey-blue text-lg mb-8">
              Start your trading journey by posting your first item!
            </p>
            <Link
              to="/post/new"
              className="px-8 py-4 bg-tradey-red text-tradey-white font-avarabold text-lg rounded-lg hover:opacity-90 transition-opacity"
            >
              Post Your First Item
            </Link>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-tradey-black/90 flex items-center justify-center z-50 px-4 overflow-y-auto py-8"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-tradey-black border-2 border-tradey-red rounded-lg p-8 max-w-2xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-avarabold text-3xl text-tradey-white">Edit Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-tradey-blue hover:text-tradey-red transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-tradey-red/20 border-4 border-tradey-red/40 flex items-center justify-center mb-4 overflow-hidden">
                  {userProfile.avatarUrl ? (
                    <img
                      src={userProfile.avatarUrl}
                      alt={userProfile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-fayte text-6xl text-tradey-white">
                      {userProfile.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <label className="px-4 py-2 border-2 border-tradey-blue text-tradey-blue font-avarabold rounded-lg hover:bg-tradey-blue/10 transition-colors cursor-pointer">
                  Change Photo
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>

              {/* Username */}
              <div>
                <label className="block font-avarabold text-tradey-blue mb-2">Username</label>
                <input
                  type="text"
                  defaultValue={userProfile.username}
                  className="w-full px-4 py-3 bg-tradey-black border-2 border-tradey-red/30 rounded-lg text-tradey-white font-sans focus:outline-none focus:border-tradey-red"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block font-avarabold text-tradey-blue mb-2">Bio</label>
                <textarea
                  defaultValue={userProfile.bio}
                  placeholder="Tell us about your style..."
                  className="w-full h-24 px-4 py-3 bg-tradey-black border-2 border-tradey-red/30 rounded-lg text-tradey-white font-sans placeholder:text-tradey-blue/50 focus:outline-none focus:border-tradey-red resize-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block font-avarabold text-tradey-blue mb-2">Location</label>
                <input
                  type="text"
                  defaultValue={userProfile.location}
                  placeholder="City, Country"
                  className="w-full px-4 py-3 bg-tradey-black border-2 border-tradey-red/30 rounded-lg text-tradey-white font-sans placeholder:text-tradey-blue/50 focus:outline-none focus:border-tradey-red"
                />
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block font-avarabold text-tradey-blue mb-2">Email</label>
                <input
                  type="email"
                  value={userProfile.email}
                  readOnly
                  className="w-full px-4 py-3 bg-tradey-black/50 border-2 border-tradey-red/20 rounded-lg text-tradey-white/50 font-sans cursor-not-allowed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-tradey-red/30 text-tradey-white font-avarabold rounded-lg hover:bg-tradey-red/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-tradey-red text-tradey-white font-avarabold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
