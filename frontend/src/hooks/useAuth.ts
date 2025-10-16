import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase/config';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Force token refresh to ensure it's valid
          await user.getIdToken(true);
          setUser(user);
        } catch (error) {
          console.error('Error refreshing token:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Set up automatic token refresh every 45 minutes (Firebase tokens expire after 1 hour)
    const tokenRefreshInterval = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          await currentUser.getIdToken(true);
          console.log('Token refreshed successfully');
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }
    }, 45 * 60 * 1000); // 45 minutes

    // Cleanup subscription and interval on unmount
    return () => {
      unsubscribe();
      clearInterval(tokenRefreshInterval);
    };
  }, []);

  return { user, loading };
}
