import { useState } from 'react';
import { Link } from 'react-router-dom';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  userId?: string;
  clickable?: boolean;
  className?: string;
}

/**
 * Generate consistent color based on username/userId
 */
function getColorForUser(userId: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];

  // Simple hash function for consistent color
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Avatar component with automatic fallback to initials
 */
export function Avatar({
  src,
  alt,
  size = 'md',
  userId,
  clickable = false,
  className = ''
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  };

  const initial = alt.charAt(0).toUpperCase();
  const bgColor = userId ? getColorForUser(userId) : 'bg-tradey-red';

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const AvatarContent = () => (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center relative ${className} ${
        clickable ? 'cursor-pointer hover:ring-2 hover:ring-tradey-red transition-all' : ''
      }`}
    >
      {src && !imageError ? (
        <>
          {/* Loading placeholder */}
          {isLoading && (
            <div className={`absolute inset-0 ${bgColor} flex items-center justify-center`}>
              <span className="text-white font-semibold animate-pulse">
                {initial}
              </span>
            </div>
          )}
          {/* Actual image */}
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </>
      ) : (
        // Fallback to initials
        <div className={`w-full h-full ${bgColor} flex items-center justify-center`}>
          <span className="text-white font-semibold">
            {initial}
          </span>
        </div>
      )}
    </div>
  );

  // If clickable and userId provided, wrap in Link
  if (clickable && userId) {
    return (
      <Link to={`/user/${userId}`} onClick={(e) => e.stopPropagation()}>
        <AvatarContent />
      </Link>
    );
  }

  return <AvatarContent />;
}

/**
 * Avatar group - for showing multiple users (e.g., group chats)
 */
interface AvatarGroupProps {
  avatars: Array<{ src?: string | null; alt: string; userId?: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function AvatarGroup({ avatars, max = 3, size = 'sm' }: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {displayAvatars.map((avatar, index) => (
        <div key={index} className="ring-2 ring-white">
          <Avatar
            src={avatar.src}
            alt={avatar.alt}
            userId={avatar.userId}
            size={size}
          />
        </div>
      ))}
      {remaining > 0 && (
        <div className={`${
          size === 'xs' ? 'w-6 h-6 text-xs' :
          size === 'sm' ? 'w-8 h-8 text-sm' :
          size === 'md' ? 'w-10 h-10 text-base' :
          'w-12 h-12 text-lg'
        } rounded-full bg-tradey-black text-white flex items-center justify-center font-semibold ring-2 ring-white`}>
          +{remaining}
        </div>
      )}
    </div>
  );
}
