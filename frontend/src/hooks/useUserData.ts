import { useState, useEffect } from 'react';
import { usersApi } from '../services/api';

interface UserData {
  uid: string;
  username: string;
  avatarUrl?: string;
}

/**
 * Hook to fetch and cache user data (username, avatar)
 * Used in chat to display user info without multiple API calls
 */
export function useUserData(userId: string | undefined) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setUserData(null);
      return;
    }

    // Check cache first
    const cached = userDataCache.get(userId);
    if (cached) {
      setUserData(cached);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await usersApi.getById(userId);
        const data: UserData = {
          uid: response.data.uid,
          username: response.data.username,
          avatarUrl: response.data.avatarUrl,
        };

        // Cache the result
        userDataCache.set(userId, data);
        setUserData(data);
      } catch (err) {
        console.error(`Failed to fetch user ${userId}:`, err);
        setError(err as Error);
        // Fallback data
        setUserData({
          uid: userId,
          username: `User ${userId.substring(0, 8)}`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { userData, loading, error };
}

// Simple in-memory cache to avoid repeated API calls
const userDataCache = new Map<string, UserData>();

/**
 * Clear user data cache (useful after profile updates)
 */
export function clearUserDataCache(userId?: string) {
  if (userId) {
    userDataCache.delete(userId);
  } else {
    userDataCache.clear();
  }
}

/**
 * Batch fetch multiple users at once
 */
export async function fetchMultipleUsers(userIds: string[]): Promise<Map<string, UserData>> {
  const result = new Map<string, UserData>();
  const uncachedIds: string[] = [];

  // Check cache first
  userIds.forEach(id => {
    const cached = userDataCache.get(id);
    if (cached) {
      result.set(id, cached);
    } else {
      uncachedIds.push(id);
    }
  });

  // Fetch uncached users
  if (uncachedIds.length > 0) {
    await Promise.all(
      uncachedIds.map(async (userId) => {
        try {
          const response = await usersApi.getById(userId);
          const data: UserData = {
            uid: response.data.uid,
            username: response.data.username,
            avatarUrl: response.data.avatarUrl,
          };
          userDataCache.set(userId, data);
          result.set(userId, data);
        } catch (error) {
          console.error(`Failed to fetch user ${userId}:`, error);
          const fallback: UserData = {
            uid: userId,
            username: `User ${userId.substring(0, 8)}`,
          };
          result.set(userId, fallback);
        }
      })
    );
  }

  return result;
}
