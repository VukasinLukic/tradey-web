import type { Post } from '../../types/entities';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  // Use a placeholder if there are no images for some reason
  const imageUrl = post.images?.[0] || 'https://via.placeholder.com/500';

  return (
    <Link to={`/item/${post.id}`} className="block group">
      <div className="w-full aspect-square overflow-hidden rounded-lg bg-gray-900">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="mt-2 text-sm font-semibold text-white truncate">{post.title}</h3>
      <p className="mt-1 text-xs text-gray-400">{post.brand}</p>
    </Link>
  );
}
