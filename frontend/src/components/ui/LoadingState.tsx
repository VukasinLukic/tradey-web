interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

/**
 * Modern loading state component with TRADEY branding
 */
export function LoadingState({
  fullScreen = false,
}: LoadingStateProps) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-tradey-white z-50'
    : 'min-h-screen flex flex-col items-center justify-center bg-tradey-white';

  // Wave animation for each letter
  const letters = 'TRADEY'.split('');

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center">
        {/* Wave animated TRADEY text */}
        <div className="flex items-center justify-center" style={{ height: '120px' }}>
          {letters.map((letter, index) => (
            <span
              key={`tradey-letter-${index}`}
              className="font-fayte text-8xl text-tradey-red uppercase inline-block animate-bounce"
              style={{
                animationDuration: '1s',
                animationDelay: `${index * 0.1}s`,
                animationIterationCount: 'infinite',
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Simple spinner (kept for backward compatibility)
 */
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} border-4 border-tradey-black/20 border-t-tradey-red rounded-full animate-spin`} />
  );
}

/**
 * Inline loading indicator for buttons
 */
export function InlineLoader({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-5 w-5 text-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Skeleton loader for content
 */
export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-tradey-black/10 rounded ${className}`} />
  );
}

/**
 * Card skeleton for post/product cards
 */
export function CardSkeleton() {
  return (
    <div className="border border-tradey-black/10 p-4 space-y-4">
      <SkeletonLoader className="h-48 w-full" />
      <SkeletonLoader className="h-4 w-3/4" />
      <SkeletonLoader className="h-4 w-1/2" />
      <div className="flex gap-2">
        <SkeletonLoader className="h-8 w-20" />
        <SkeletonLoader className="h-8 w-20" />
      </div>
    </div>
  );
}
