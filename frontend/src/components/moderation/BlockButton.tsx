import { useState } from 'react';
import { usersApi } from '../../services/api';

interface BlockButtonProps {
  userId: string;
  username: string;
  isBlocked: boolean;
  onBlockToggle?: () => void;
  className?: string;
}

export function BlockButton({ userId, username, isBlocked, onBlockToggle, className = '' }: BlockButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleToggleBlock = async () => {
    setLoading(true);
    try {
      await usersApi.toggleBlock(userId);
      setShowConfirmModal(false);
      if (onBlockToggle) {
        onBlockToggle();
      }
    } catch (error) {
      console.error('Error toggling block:', error);
      alert('Failed to update block status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (isBlocked) {
      // Unblock directly without confirmation
      handleToggleBlock();
    } else {
      // Show confirmation for blocking
      setShowConfirmModal(true);
    }
  };

  return (
    <>
      {/* Block/Unblock Button */}
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center gap-2 text-sm font-sans transition-colors ${
          isBlocked
            ? 'text-tradey-black/60 hover:text-green-600'
            : 'text-tradey-black/60 hover:text-tradey-red'
        } disabled:opacity-50 ${className}`}
      >
        {isBlocked ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <span>{loading ? 'Unblocking...' : 'Unblock'}</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <span>{loading ? 'Blocking...' : 'Block User'}</span>
          </>
        )}
      </button>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            {/* Warning Icon */}
            <div className="w-16 h-16 bg-tradey-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-tradey-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="font-fayte text-2xl text-tradey-black mb-3 uppercase text-center">
              Block @{username}?
            </h3>

            <div className="space-y-2 mb-6">
              <p className="font-sans text-tradey-black/80 text-sm text-center">
                When you block this user:
              </p>
              <ul className="font-sans text-tradey-black/70 text-sm space-y-1 list-disc list-inside">
                <li>They won't be able to message you</li>
                <li>You won't see their posts or activity</li>
                <li>They won't be notified that you blocked them</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
                className="flex-1 py-3 bg-white border border-tradey-black/20 text-tradey-black font-sans text-sm font-semibold rounded-full hover:bg-tradey-black/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleBlock}
                disabled={loading}
                className="flex-1 py-3 bg-tradey-red hover:bg-tradey-red/80 text-white font-sans text-sm font-semibold rounded-full transition-colors disabled:opacity-50"
              >
                {loading ? 'Blocking...' : 'Block User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
