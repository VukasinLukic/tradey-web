import { useState } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFollowing } from '../hooks/useFollowing';
import { useFollowers } from '../hooks/useFollowers';
import { useFollowUser } from '../hooks/useFollowUser';
import { useUserProfile } from '../hooks/useUserProfile';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState, EmptyIcons } from '../components/ui/EmptyState';

export function FollowingPage() {
  const { user } = useAuth();
  const { id } = useParams<{ id?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'following';
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>(
    initialTab as 'following' | 'followers'
  );

  // Use ID from URL parameter if provided, otherwise use current user's ID
  const userId = id || user?.uid;
  const isOwnProfile = !id || id === user?.uid;

  const { userProfile } = useUserProfile(userId);
  const { following, loading: followingLoading, refetch: refetchFollowing } = useFollowing(userId);
  const { followers, loading: followersLoading } = useFollowers(userId);
  const { toggleFollow, loading: followLoading } = useFollowUser();

  const handleTabChange = (tab: 'following' | 'followers') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleUnfollow = async (userId: string) => {
    const success = await toggleFollow(userId);
    if (success) {
      refetchFollowing();
    }
  };

  const isLoading = activeTab === 'following' ? followingLoading : followersLoading;
  const users = activeTab === 'following' ? following : followers;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-fayte text-5xl md:text-7xl text-tradey-black mb-2 tracking-tight uppercase">
          {isOwnProfile ? 'Connections' : `@${userProfile?.username || 'User'}'s Connections`}
        </h1>
        <p className="font-sans text-tradey-black/60 text-sm">
          {isOwnProfile ? 'Your trading community' : 'Trading community'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-tradey-black/20 mb-8">
        <button
          onClick={() => handleTabChange('following')}
          className={`flex-1 px-6 py-4 font-sans text-sm font-medium transition-colors ${
            activeTab === 'following'
              ? 'border-b-2 border-tradey-red text-tradey-black'
              : 'text-tradey-black/50 hover:text-tradey-black'
          }`}
        >
          Following ({following.length})
        </button>
        <button
          onClick={() => handleTabChange('followers')}
          className={`flex-1 px-6 py-4 font-sans text-sm font-medium transition-colors ${
            activeTab === 'followers'
              ? 'border-b-2 border-tradey-red text-tradey-black'
              : 'text-tradey-black/50 hover:text-tradey-black'
          }`}
        >
          Followers ({followers.length})
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingState message={activeTab === 'following' ? 'Učitavanje pratilaca...' : 'Učitavanje followera...'} size="md" />
      ) : users.length === 0 ? (
        <EmptyState
          icon={<EmptyIcons.NoPeople />}
          title={activeTab === 'following' ? 'Još ne pratite nikoga' : 'Još nemate followera'}
          description={
            activeTab === 'following'
              ? 'Istražujte marketplace i zapratite druge tradere!'
              : isOwnProfile
                ? 'Podelite svoje artikle da biste dobili više followera.'
                : 'Ovaj korisnik još nema followera.'
          }
          actionLabel={activeTab === 'following' && isOwnProfile ? 'Istražite Marketplace' : undefined}
          actionLink={activeTab === 'following' && isOwnProfile ? '/marketplace' : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((userItem) => (
            <div
              key={userItem.uid}
              className="flex items-center gap-4 p-4 border border-tradey-black/10 hover:border-tradey-red/30 transition-colors bg-white"
            >
              {/* Avatar */}
              <Link to={`/user/${userItem.uid}`} className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-tradey-black/10 flex items-center justify-center overflow-hidden">
                  {userItem.avatarUrl ? (
                    <img
                      src={userItem.avatarUrl}
                      alt={userItem.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-fayte text-2xl text-tradey-black">
                      {userItem.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </Link>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/user/${userItem.uid}`}
                  className="font-sans text-tradey-black font-semibold hover:text-tradey-red transition-colors block truncate"
                >
                  @{userItem.username}
                </Link>
                {userItem.location && (
                  <p className="font-sans text-tradey-black/60 text-sm flex items-center gap-1 mt-1">
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
                    {userItem.location}
                  </p>
                )}
              </div>

              {/* Action Button - Only show unfollow for Following tab and own profile */}
              {activeTab === 'following' && isOwnProfile && (
                <button
                  onClick={() => handleUnfollow(userItem.uid)}
                  disabled={followLoading}
                  className="px-4 py-2 border border-tradey-black/20 text-tradey-black font-sans text-sm hover:border-tradey-red hover:text-tradey-red transition-colors disabled:opacity-50"
                >
                  {followLoading ? 'Loading...' : 'Unfollow'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 