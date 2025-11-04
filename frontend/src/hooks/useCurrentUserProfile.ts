import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { usersApi } from '../services/api';
import type { UserProfile } from '../types/entities';

/**
 * Hook to get the full profile of the currently authenticated user
 * Includes blockedUsers field for filtering
 */
export function useCurrentUserProfile() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      setUserProfile(null);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await usersApi.getById(user.uid);
        setUserProfile(response.data);
      } catch (err) {
        console.error('Error fetching current user profile:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.uid]);

  const refetch = async () => {
    if (!user?.uid) return;

    setLoading(true);
    setError(null);
    try {
      const response = await usersApi.getById(user.uid);
      setUserProfile(response.data);
    } catch (err) {
      console.error('Error refetching current user profile:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { userProfile, loading, error, refetch, blockedUsers: userProfile?.blockedUsers || [] };
}
