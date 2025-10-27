import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { postsApi } from '../../services/api';
import type { Post, PostStatus } from '../../types/entities';

interface ProductCardProps {
  post: Post;
  showSaveButton?: boolean;
  showAuthor?: boolean;
}

export function ProductCard({ post, showSaveButton = false, showAuthor = true }: ProductCardProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsSaved((post.savedBy || []).includes(user?.uid || ''));
  }, [post.savedBy, user?.uid]);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    setIsSaving(true);
    try {
      await postsApi.toggleSave(post.id);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/user/${post.authorId}`;
  };

  // Status overlay config
  const getStatusConfig = (status: PostStatus) => {
    switch (status) {
      case 'traded':
        return { label: 'TRADED', bgColor: 'bg-tradey-red/90' };
      case 'reserved':
        return { label: 'RESERVED', bgColor: 'bg-yellow-500/90' };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig(post.status || 'available');

  // Minimal style badge - just the style text
  const styleBadge = post.style;

  return (
    <Link to={`/item/${post.id}`} className="group block">
      {/* Image with overlays */}
      <div className="aspect-[3/4] relative overflow-hidden bg-gray-50 mb-3">
        <img
          src={post.images[0]}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Status overlay */}
        {statusConfig && (
          <div className={`absolute inset-0 ${statusConfig.bgColor} flex items-center justify-center`}>
            <span className="font-sans text-sm text-white tracking-wider font-semibold">
              {statusConfig.label}
            </span>
          </div>
        )}

        {/* Style badge - Minimal */}
        {styleBadge && (
          <div className="absolute top-2 left-2 z-10">
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 font-sans text-[10px] font-medium tracking-wide uppercase text-tradey-black shadow-sm">
              {styleBadge}
            </div>
          </div>
        )}

        {/* Save button (top-right) */}
        {showSaveButton && user && (
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-white transition-all hover:scale-110 active:scale-100 z-10"
            aria-label="Save post"
          >
            <svg
              className={`w-6 h-6 transition-colors ${
                isSaved ? 'fill-tradey-red stroke-tradey-red' : 'fill-none stroke-tradey-black'
              }`}
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Author info */}
      {showAuthor && (
        <div
          onClick={handleAuthorClick}
          className="flex items-center gap-2 mb-2 hover:opacity-70 transition-opacity cursor-pointer"
        >
          {post.authorAvatarUrl ? (
            <img
              src={post.authorAvatarUrl}
              alt={post.authorUsername}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-tradey-black/10 flex items-center justify-center">
              <span className="font-sans text-xs text-tradey-black">
                {post.authorUsername.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="font-sans text-xs text-tradey-black/60">
            {post.authorUsername}
          </span>
        </div>
      )}

      {/* Product info */}
      <div className="space-y-1">
        <h3 className="font-sans text-tradey-black text-sm font-medium truncate group-hover:text-tradey-red transition-colors">
          {post.title}
        </h3>
        <p className="font-sans text-tradey-black/50 text-xs uppercase tracking-wide">
          {post.brand}
        </p>
        <div className="flex items-center justify-between">
          <p className="font-sans text-tradey-black/60 text-xs">
            Size {post.size}
          </p>
        </div>
      </div>
    </Link>
  );
}
