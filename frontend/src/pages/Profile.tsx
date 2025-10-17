import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useUserPosts } from '../hooks/useUserPosts';
import { Spinner } from '../components/ui/Spinner';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { usersApi } from '../services/api';
// Toast replacement - simple alert
const showToast = (message: string, type: 'success' | 'error') => {
  console.log(`[${type.toUpperCase()}]:`, message);
  if (type === 'error') {
    alert(`Error: ${message}`);
  }
};
import { StickyFooter, FooterContent } from '../components/navigation/StickyFooter';

export function ProfilePage() {
  const { user } = useAuth();
  const { userProfile, loading: profileLoading, refetch } = useUserProfile(user?.uid);
  const { posts, loading: postsLoading } = useUserPosts(user?.uid);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  // State for the edit form
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username || '');
      setBio(userProfile.bio || '');
      setLocation(userProfile.location || '');
      setAvatarPreview(userProfile.avatarUrl || null);
    }
  }, [userProfile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image is too large. Maximum size is 5MB.', 'error');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('bio', bio);
      formData.append('location', location);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await usersApi.update(user.uid, formData);
      
      showToast('Profile updated successfully!', 'success');
      setShowEditModal(false);
      refetch(); // Refetch profile data
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update profile.';
      showToast(errorMessage, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

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
    <>
      <div className="max-w-[1400px] mx-auto px-6 py-8 md:py-12">
        {/* Profile Header - Modern Grid Layout */}
        <div className="mb-16">
        {/* Top Row - Avatar + Name + Bio */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-tradey-red/20 to-tradey-red/5 overflow-hidden shadow-lg">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-tradey-red/30 to-tradey-red/10">
                  <span className="font-fayte text-6xl text-tradey-red">
                    {userProfile.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name & Bio */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h1 className="font-fayte text-5xl md:text-6xl lg:text-7xl text-tradey-black mb-2 tracking-tight uppercase break-words">
              {userProfile.username}
            </h1>

            {userProfile.location && (
              <div className="flex items-center gap-2 text-tradey-black/50 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-sans text-base">{userProfile.location}</span>
              </div>
            )}
            
            {userProfile.bio && (
              <p className="font-sans text-tradey-black/70 text-lg md:text-xl leading-relaxed max-w-2xl">
                {userProfile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Dashboard Cards Grid - Modern Minimalist Design */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Stats Card - Black Minimalist */}
          <div className="bg-tradey-black text-white p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-tradey-red/20 -translate-y-10 translate-x-10 rotate-45 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500"></div>
            
            <div className="relative z-10 flex flex-col justify-center h-full">
              <div className="space-y-6">
                <div className="group/stat hover:translate-x-2 transition-transform">
                  <div className="flex items-baseline justify-between">
                    <span className="font-sans text-lg uppercase tracking-wide text-white/60">Posts</span>
                    <span className="font-fayte text-6xl">{posts.length}</span>
                  </div>
                </div>
                
                <Link 
                  to="/following?tab=following"
                  className="block group/stat hover:translate-x-2 transition-transform"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-sans text-lg uppercase tracking-wide text-white/60 group-hover/stat:text-tradey-red transition-colors">Following</span>
                    <span className="font-fayte text-6xl group-hover/stat:text-tradey-red transition-colors">{userProfile.following?.length || 0}</span>
                  </div>
                </Link>
                
                <Link 
                  to="/following?tab=followers"
                  className="block group/stat hover:translate-x-2 transition-transform"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-sans text-lg uppercase tracking-wide text-white/60 group-hover/stat:text-tradey-red transition-colors">Followers</span>
                    <span className="font-fayte text-6xl group-hover/stat:text-tradey-red transition-colors">{followersCount}</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Edit Profile Card - Red Accent */}
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-white border-2 border-tradey-black/10 p-8 relative overflow-hidden group hover:border-tradey-red hover:scale-[1.02] transition-all duration-300"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-tradey-red/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 border-2 border-tradey-black/20 flex items-center justify-center mb-6 group-hover:border-tradey-red group-hover:rotate-90 transition-all duration-500">
                <svg className="w-12 h-12 stroke-tradey-black group-hover:stroke-tradey-red transition-colors" fill="none" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>
              <h3 className="font-fayte text-4xl text-tradey-black uppercase tracking-wide group-hover:text-tradey-red transition-colors">Edit</h3>
            </div>
          </button>

          {/* Messages Card - Blue Accent */}
          <Link
            to="/chat"
            className="bg-white border-2 border-tradey-black/10 p-8 relative overflow-hidden group hover:border-tradey-blue hover:scale-[1.02] transition-all duration-300"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-tradey-blue/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 border-2 border-tradey-black/20 flex items-center justify-center mb-6 group-hover:border-tradey-blue group-hover:-rotate-12 transition-all duration-500">
                <svg className="w-12 h-12 stroke-tradey-black group-hover:stroke-tradey-blue transition-colors" fill="none" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="font-fayte text-4xl text-tradey-black uppercase tracking-wide group-hover:text-tradey-blue transition-colors">Messages</h3>
            </div>
          </Link>

          {/* Liked Items Card - Heart Red */}
          <Link
            to="/liked"
            className="bg-white border-2 border-tradey-black/10 p-8 relative overflow-hidden group hover:border-tradey-red hover:scale-[1.02] transition-all duration-300"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-tradey-red/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 border-2 border-tradey-black/20 flex items-center justify-center mb-6 group-hover:border-tradey-red group-hover:scale-110 transition-all duration-500">
                <svg className="w-12 h-12 stroke-tradey-black group-hover:stroke-tradey-red group-hover:fill-tradey-red transition-all" fill="none" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="font-fayte text-4xl text-tradey-black uppercase tracking-wide group-hover:text-tradey-red transition-colors">Liked</h3>
            </div>
          </Link>
        </div>

        {/* Logout Button - Full Width, Minimal */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full bg-white border border-tradey-black/10 p-4 flex items-center justify-between group hover:border-tradey-red hover:bg-tradey-red/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-tradey-black/20 flex items-center justify-center group-hover:border-tradey-red transition-colors">
                <svg className="w-5 h-5 stroke-tradey-black/60 group-hover:stroke-tradey-red transition-colors" fill="none" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-sans text-sm text-tradey-black/60 group-hover:text-tradey-red font-medium transition-colors">Logout</h3>
                <p className="font-sans text-xs text-tradey-black/40">Sign out of account</p>
              </div>
            </div>
            <svg className="w-5 h-5 stroke-tradey-black/30 group-hover:stroke-tradey-red group-hover:translate-x-1 transition-all" fill="none" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* My Items Section */}
      <div>
        <div className="flex items-center gap-6 mb-10">
          <h2 className="font-fayte text-6xl md:text-7xl text-tradey-black uppercase tracking-tight">
            My Items
          </h2>
          <Link
            to="/post/new"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-tradey-red to-tradey-red/80 text-white rounded-full hover:shadow-lg transition-all group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden md:inline font-sans text-sm font-semibold">New Post</span>
          </Link>
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
              className="w-24 h-24 text-tradey-black/20 mb-8"
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
            <p className="font-sans text-tradey-black/40 text-xl mb-10">
              You haven't posted anything yet
            </p>
            <Link
              to="/post/new"
              className="flex items-center gap-3 px-10 py-4 bg-gradient-to-br from-tradey-red to-tradey-red/80 text-white font-sans text-lg font-semibold rounded-full hover:shadow-xl transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
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

            <form className="space-y-5" onSubmit={handleProfileUpdate}>
              {/* Avatar Upload */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden mb-4">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-tradey-red/10">
                      <span className="font-fayte text-4xl text-tradey-red">
                        {username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <label className="px-4 py-2 border border-tradey-black text-tradey-black font-sans text-xs hover:bg-tradey-black hover:text-white transition-all cursor-pointer">
                  Change Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>
                </label>
              </div>

              {/* Username */}
              <div>
                <label className="block font-sans text-tradey-black/60 text-xs uppercase tracking-wide mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-tradey-black/20 text-tradey-black font-sans text-sm focus:outline-none focus:border-tradey-red transition-colors"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block font-sans text-tradey-black/60 text-xs uppercase tracking-wide mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                  disabled={isUpdating}
                    className="flex-1 px-6 py-2 bg-tradey-red text-white font-sans text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isUpdating ? <Spinner size="sm" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <StickyFooter heightValue="80dvh">
        <FooterContent />
      </StickyFooter>
    </>
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
