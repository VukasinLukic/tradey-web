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
      <div className="flex justify-center items-center min-h-[70vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <p className="text-tradey-red font-sans text-lg">
          Error loading profile. Please try again.
        </p>
      </div>
    );
  }

  // Calculate followers count (placeholder)
  const followersCount = 0;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      {/* Profile Header - Clean, centered */}
      <div className="max-w-2xl mx-auto mb-16 text-center">
        {/* Avatar */}
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-100 overflow-hidden">
          {userProfile.avatarUrl ? (
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-tradey-red/10">
              <span className="font-fayte text-5xl text-tradey-red">
                {userProfile.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Username */}
        <h1 className="font-fayte text-5xl md:text-6xl text-tradey-black mb-4 tracking-tight uppercase">
          {userProfile.username}
        </h1>

        {/* Bio */}
        {userProfile.bio && (
          <p className="font-sans text-tradey-black/70 text-base leading-relaxed mb-6 max-w-xl mx-auto">
            {userProfile.bio}
          </p>
        )}

        {/* Location */}
        {userProfile.location && (
          <p className="font-sans text-tradey-black/50 text-sm flex items-center justify-center gap-2 mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {userProfile.location}
          </p>
        )}

        {/* Stats - Horizontal minimal */}
        <div className="flex items-center justify-center gap-8 mb-8 pb-8 border-b border-tradey-black/10">
          <div className="text-center">
            <p className="font-sans text-2xl text-tradey-black font-medium">{posts.length}</p>
            <p className="font-sans text-xs text-tradey-black/50 uppercase tracking-wide">Posts</p>
          </div>
          <div className="text-center">
            <p className="font-sans text-2xl text-tradey-black font-medium">
              {userProfile.following?.length || 0}
            </p>
            <p className="font-sans text-xs text-tradey-black/50 uppercase tracking-wide">Following</p>
          </div>
          <div className="text-center">
            <p className="font-sans text-2xl text-tradey-black font-medium">{followersCount}</p>
            <p className="font-sans text-xs text-tradey-black/50 uppercase tracking-wide">Followers</p>
          </div>
        </div>

        {/* Action Buttons - Minimal */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="px-6 py-2 border border-tradey-black text-tradey-black font-sans text-sm hover:bg-tradey-black hover:text-white transition-all"
          >
            Edit Profile
          </button>
          <Link
            to="/post/new"
            className="px-6 py-2 bg-tradey-red text-white font-sans text-sm hover:opacity-90 transition-opacity"
          >
            New Post
          </Link>
          <Link
            to="/chat"
            className="px-6 py-2 border border-tradey-black/20 text-tradey-black font-sans text-sm hover:border-tradey-black transition-colors"
          >
            Messages
          </Link>
          <Link
            to="/liked"
            className="px-6 py-2 border border-tradey-black/20 text-tradey-black font-sans text-sm hover:border-tradey-black transition-colors"
          >
            Liked
          </Link>
          <button
            onClick={handleLogout}
            className="px-6 py-2 text-tradey-black/50 font-sans text-sm hover:text-tradey-red transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* My Items Section */}
      <div>
        <div className="mb-8 pb-4 border-b border-tradey-black/10">
          <h2 className="font-fayte text-3xl text-tradey-black uppercase tracking-tight">
            My Items
          </h2>
        </div>

        {postsLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {posts.map((post) => (
              <ProductCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
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
            <p className="font-sans text-tradey-black/40 text-lg mb-8">
              You haven't posted anything yet
            </p>
            <Link
              to="/post/new"
              className="px-8 py-3 bg-tradey-red text-white font-sans text-sm hover:opacity-90 transition-opacity"
            >
              Post your first item
            </Link>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-tradey-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-white border border-tradey-black/20 max-w-lg w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-fayte text-2xl text-tradey-black uppercase">Edit Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-tradey-black/50 hover:text-tradey-black transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-5">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden mb-4">
                  {userProfile.avatarUrl ? (
                    <img
                      src={userProfile.avatarUrl}
                      alt={userProfile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-tradey-red/10">
                      <span className="font-fayte text-4xl text-tradey-red">
                        {userProfile.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <label className="px-4 py-2 border border-tradey-black text-tradey-black font-sans text-xs hover:bg-tradey-black hover:text-white transition-all cursor-pointer">
                  Change Photo
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>

              {/* Username */}
              <div>
                <label className="block font-sans text-tradey-black/60 text-xs uppercase tracking-wide mb-2">
                  Username
                </label>
                <input
                  type="text"
                  defaultValue={userProfile.username}
                  className="w-full px-4 py-2 border border-tradey-black/20 text-tradey-black font-sans text-sm focus:outline-none focus:border-tradey-red transition-colors"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block font-sans text-tradey-black/60 text-xs uppercase tracking-wide mb-2">
                  Bio
                </label>
                <textarea
                  defaultValue={userProfile.bio}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full px-4 py-2 border border-tradey-black/20 text-tradey-black font-sans text-sm placeholder:text-tradey-black/30 focus:outline-none focus:border-tradey-red transition-colors resize-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block font-sans text-tradey-black/60 text-xs uppercase tracking-wide mb-2">
                  Location
                </label>
                <input
                  type="text"
                  defaultValue={userProfile.location}
                  placeholder="City, Country"
                  className="w-full px-4 py-2 border border-tradey-black/20 text-tradey-black font-sans text-sm placeholder:text-tradey-black/30 focus:outline-none focus:border-tradey-red transition-colors"
                />
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block font-sans text-tradey-black/60 text-xs uppercase tracking-wide mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userProfile.email}
                  readOnly
                  className="w-full px-4 py-2 border border-tradey-black/10 text-tradey-black/40 font-sans text-sm bg-gray-50 cursor-not-allowed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-2 border border-tradey-black/20 text-tradey-black font-sans text-sm hover:border-tradey-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-tradey-red text-white font-sans text-sm hover:opacity-90 transition-opacity"
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

// Product Card - Minimal, same style as marketplace
function ProductCard({ post }: { post: any }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/item/${post.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="aspect-[3/4] relative overflow-hidden bg-gray-50 mb-3">
        <img
          src={post.images[0]}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Availability indicator */}
        {!post.isAvailable && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="font-sans text-xs text-tradey-black/60 tracking-wider">
              SOLD
            </span>
          </div>
        )}

        {/* Edit button - appears on hover */}
        {isHovered && (
          <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-white transition-all">
            <svg className="w-4 h-4 stroke-tradey-black" fill="none" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
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
  );
}
