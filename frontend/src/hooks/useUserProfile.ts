import { useState, useEffect } from 'react';
import { usersApi } from '../services/api';
import type { UserProfile } from '../types/entities';

export function useUserProfile(uid: string | undefined) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await usersApi.getById(uid);
        setUserProfile(response.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err as Error);
        setUserProfile(null); // Clear profile on error

        // Handle 404 - user not found
        const axiosError = err as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          console.log('User profile not found');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [uid]);

  const refetch = () => {
    if (uid) {
      const fetchUserProfile = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await usersApi.getById(uid);
          setUserProfile(response.data);
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError(err as Error);
          setUserProfile(null); // Clear profile on error
          const axiosError = err as { response?: { status?: number } };
          if (axiosError.response?.status === 404) {
            console.log('User profile not found');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    }
  };

  return { userProfile, loading, error, refetch };
} 