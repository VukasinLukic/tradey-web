import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '../../services/api';
import type { Post } from '../../types/entities';

export function FeaturedItemsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        const response = await postsApi.getAll({ limit: 4 });
        setPosts(response.data.posts || []);
      } catch (error) {
        console.error('Error fetching latest posts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLatestPosts();
  }, []);

  return (
    <section className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-fayte text-4xl md:text-6xl text-tradey-black text-center mb-4">
          See what's on TRADEY
        </h2>

        <p className="font-garamond text-lg md:text-xl text-center text-gray-600 mb-16 max-w-2xl mx-auto">
          Explore the latest unique pieces from our community of conscious fashion lovers
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/item/${post.id}`}
                className="group cursor-pointer"
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={post.images?.[0] || 'https://via.placeholder.com/400'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-fayte text-lg text-tradey-black truncate group-hover:text-tradey-red transition-colors">
                  {post.title}
                </h3>
                <p className="font-garamond text-sm text-gray-600">{post.brand}</p>
                <p className="font-garamond text-xs text-gray-500 mt-1">{post.authorLocation}</p>
              </Link>
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

