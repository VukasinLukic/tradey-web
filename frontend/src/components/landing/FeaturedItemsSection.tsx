import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postsApi, usersApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { ProductCard } from '../post/ProductCard';
import type { Post } from '../../types/entities';

export function FeaturedItemsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchPosts() {
      try {
        if (user?.uid) {
          // If user is logged in, try FOR YOU recommendations
          try {
            const response = await usersApi.getRecommendations(user.uid, { limit: 8 });
            const recommendations = Array.isArray(response.data) ? response.data : [];

            // If no recommendations, fallback to latest posts
            if (recommendations.length === 0) {
              const fallbackResponse = await postsApi.getPosts({ limit: 8 });
              const posts = fallbackResponse.data?.posts || fallbackResponse.data || [];
              setPosts(Array.isArray(posts) ? posts : []);
            } else {
              setPosts(recommendations);
            }
          } catch (err) {
            // If recommendations fail, show latest posts
            const fallbackResponse = await postsApi.getPosts({ limit: 8 });
            const posts = fallbackResponse.data?.posts || fallbackResponse.data || [];
            setPosts(Array.isArray(posts) ? posts : []);
          }
        } else {
          // If not logged in, show latest posts
          const response = await postsApi.getPosts({ limit: 8 });
          const posts = response.data?.posts || response.data || [];
          setPosts(Array.isArray(posts) ? posts : []);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Final fallback - try to get any posts
        try {
          const finalResponse = await postsApi.getPosts({ limit: 8 });
          const posts = finalResponse.data?.posts || finalResponse.data || [];
          setPosts(Array.isArray(posts) ? posts : []);
        } catch {
          setPosts([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [user?.uid]);

  return (
    <section className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-fayte text-4xl md:text-6xl text-tradey-black text-center mb-4">
          {user ? 'FOR YOU' : 'See what\'s on TRADEY'}
        </h2>

        <p className="font-garamond text-lg md:text-xl text-center text-gray-600 mb-16 max-w-2xl mx-auto">
          {user
            ? 'Personalized picks based on your style preferences and activity'
            : 'Explore the latest unique pieces from our community of conscious fashion lovers'
          }
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
            {posts.map((post) => (
              <ProductCard key={post.id} post={post} showSaveButton={!!user} showAuthor={true} />
            ))}
          </div>
        ) : (
          <div className="min-h-[400px] flex items-center justify-center mb-16">
            <p className="font-garamond text-xl text-gray-400">
              No products available yet
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center">
          <Link
            to="/marketplace"
            className="inline-block font-fayte text-lg px-12 py-4 bg-tradey-red text-white rounded-full hover:bg-opacity-90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Explore Marketplace
          </Link>
        </div>
      </div>
    </section>
  );
}

