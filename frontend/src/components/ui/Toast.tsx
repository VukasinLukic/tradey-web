import { useEffect } from 'react';

interface ToastProps {
  message: string;
  username?: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, username, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof onClose === 'function') {
        onClose();
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-white border-l-4 border-tradey-red shadow-lg rounded-lg p-4 max-w-sm">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <svg 
              className="w-6 h-6 text-tradey-red" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
              />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="font-sans text-sm font-semibold text-tradey-black">
              {username ? `${username} sent a message` : 'New message'}
            </p>
            <p className="font-sans text-sm text-tradey-black/70 truncate mt-1">
              {message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (typeof onClose === 'function') {
                onClose();
              }
            }}
            className="flex-shrink-0 text-tradey-black/40 hover:text-tradey-black transition-colors cursor-pointer"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
