import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useUserPosts } from '../hooks/useUserPosts';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { PostCard } from '../components/post/PostCard';
// TODO: Implement a hook to fetch user data from Firestore
// import { useUserData } from '../hooks/useUserData'; 

export function ProfilePage() {
  const { user } = useAuth();
  const { userProfile, loading: profileLoading } = useUserProfile(user?.uid);
  const { posts, loading: postsLoading } = useUserPosts(user?.uid);
  // const { userData, loading: userDataLoading } = useUserData(user?.uid);

  if (profileLoading) {
    return <div className="flex justify-center mt-16"><Spinner size="lg" /></div>;
  }

  if (!userProfile) {
    return <div className="text-center text-red-500">Error loading profile. Please try again.</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
        {/* Profile Picture Placeholder */}
        <div className="w-32 h-32 bg-gray-800 rounded-full flex-shrink-0"></div>
        <div className="flex-grow">
          <h1 className="text-3xl font-bold">{userProfile.username}</h1>
          <p className="text-gray-400">{userProfile.location}</p>
          <p className="text-gray-500 text-sm mt-1">{userProfile.email} | {userProfile.phone}</p>
          {/* Reviews placeholder */}
          <div className="mt-2 text-sm text-yellow-400">
            ★★★★☆ (15 Reviews)
          </div>
        </div>
        <div className="w-full md:w-auto">
          <Link to="/post/new">
            <Button>Post New Item</Button>
          </Link>
        </div>
      </div>
      
      <hr className="border-gray-800 my-8" />

      <div>
        <h2 className="text-2xl font-semibold mb-4">My Items</h2>
        {postsLoading ? (
          <div className="flex justify-center"><Spinner /></div>
        ) : (
          posts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-lg">
              <p className="text-gray-500">You haven't posted any items yet.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
} 