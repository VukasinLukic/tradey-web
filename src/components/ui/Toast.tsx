import { useEffect } from 'react';
import { useUiStore } from '../../store/uiStore';

export function Toast() {
  const { message, type, hideToast } = useUiStore();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000); // Hide after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [message, hideToast]);

  if (!message) {
    return null;
  }

  const baseClasses = "fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white font-semibold transition-all duration-300";
  const typeClasses = {
    success: "bg-green-600",
    error: "bg-red-600",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      {message}
    </div>
  );
}
