import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
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
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data() as UserProfile);
        } else {
          console.log('No such user profile!');
          setError(new Error('User profile not found.'));
        }
      } catch (err: any) {
        console.error('Error fetching user profile:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [uid]);

  return { userProfile, loading, error };
} 