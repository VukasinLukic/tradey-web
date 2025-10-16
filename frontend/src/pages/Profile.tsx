import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useUserPosts } from '../hooks/useUserPosts';
import { Spinner } from '../components/ui/Spinner';
import { PostCard } from '../components/post/PostCard';

export function ProfilePage() {
  const { user } = useAuth();
  const { userProfile, loading: profileLoading } = useUserProfile(user?.uid);
  const { posts, loading: postsLoading } = useUserPosts(user?.uid);

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
        <p className="text-tradey-red font-garamond text-lg">
          Error loading profile. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-tradey-black border-2 border-tradey-red/30 rounded-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Profile Picture */}
          <div className="w-32 h-32 rounded-full bg-tradey-red/30 flex-shrink-0 flex items-center justify-center border-2 border-tradey-red">
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
          </div>

          {/* Profile Info */}
          <div className="flex-grow">
            <h1 className="font-fayte text-4xl md:text-5xl text-tradey-white mb-2">
              {userProfile.username}
            </h1>
            <div className="space-y-1 font-garamond text-tradey-blue mb-4">
              <p className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {userProfile.location}
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {userProfile.email}
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {userProfile.phone}
              </p>
            </div>
            {userProfile.bio && (
              <p className="font-garamond text-tradey-white mt-4">
                {userProfile.bio}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-auto flex flex-col gap-3">
            <Link to="/post/new">
              <button className="w-full px-6 py-3 bg-tradey-red text-tradey-white font-garamond font-bold rounded-lg hover:opacity-90 transition-opacity">
                Post New Item
              </button>
            </Link>
            <Link to="/chat">
              <button className="w-full px-6 py-3 bg-tradey-blue text-tradey-black font-garamond font-bold rounded-lg hover:opacity-90 transition-opacity">
                Messages
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-tradey-black border-2 border-tradey-red/30 rounded-lg p-6 text-center">
          <p className="font-fayte text-3xl text-tradey-red mb-1">{posts.length}</p>
          <p className="font-garamond text-tradey-blue">Items Posted</p>
        </div>
        <div className="bg-tradey-black border-2 border-tradey-red/30 rounded-lg p-6 text-center">
          <p className="font-fayte text-3xl text-tradey-red mb-1">
            {userProfile.following?.length || 0}
          </p>
          <p className="font-garamond text-tradey-blue">Following</p>
        </div>
        <div className="bg-tradey-black border-2 border-tradey-red/30 rounded-lg p-6 text-center">
          <p className="font-fayte text-3xl text-tradey-red mb-1">
            {userProfile.likedPosts?.length || 0}
          </p>
          <p className="font-garamond text-tradey-blue">Liked Items</p>
        </div>
        <div className="bg-tradey-black border-2 border-tradey-red/30 rounded-lg p-6 text-center">
          <p className="font-fayte text-3xl text-tradey-red mb-1">
            {posts.filter(p => p.isAvailable).length}
          </p>
          <p className="font-garamond text-tradey-blue">Available</p>
        </div>
      </div>

      {/* My Items Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-fayte text-3xl md:text-4xl text-tradey-white">My Items</h2>
          <Link
            to="/liked"
            className="font-garamond text-tradey-blue hover:text-tradey-red transition-colors"
          >
            View Liked Items →
          </Link>
        </div>

        {postsLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map(post => (
              <div key={post.id} className="relative">
                <PostCard post={post} />
                {/* Availability Badge */}
                {!post.isAvailable && (
                  <div className="absolute top-2 left-2 px-3 py-1 bg-tradey-red/90 backdrop-blur-sm rounded-full">
                    <span className="font-garamond text-xs text-tradey-white font-bold">
                      TRADED
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="font-garamond text-2xl text-tradey-white mb-2">
              No items posted yet
            </h3>
            <p className="font-garamond text-tradey-blue mb-6">
              Start trading by posting your first item!
            </p>
            <Link
              to="/post/new"
              className="px-6 py-3 bg-tradey-red text-tradey-white font-garamond font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Post Your First Item
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 