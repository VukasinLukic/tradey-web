import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import { auth } from '../firebase/config';

// API Base URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Axios instance configured for TRADEY backend API
 * Automatically includes Firebase JWT token in Authorization header
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

/**
 * Request interceptor - Automatically add Firebase JWT to all requests
 */
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Get fresh token
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle common errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        console.error('Unauthorized - token invalid or expired, redirecting to login');
        // Redirect to login page
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error('Forbidden - insufficient permissions');
      }

      // Handle 404 Not Found
      if (error.response.status === 404) {
        console.error('Resource not found');
      }
    } else if (error.request) {
      console.error('No response from server');
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Posts API
 */
export const postsApi = {
  /**
   * Get all posts with optional filters
   * @param params - Query parameters (q, tag, creator, limit, condition, size)
   */
  getAll: (params?: {
    q?: string;
    tag?: string;
    creator?: string;
    limit?: number;
    condition?: string;
    size?: string;
  }) => apiClient.get('/posts', { params }),

  /**
   * Get single post by ID
   */
  getById: (id: string) => apiClient.get(`/posts/${id}`),

  /**
   * Create new post with images
   * @param data - FormData with post data and images
   */
  create: (data: FormData) => apiClient.post('/posts', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  /**
   * Update post (owner only)
   * @param id - Post ID
   * @param data - FormData with updated data
   */
  update: (id: string, data: FormData) => apiClient.put(`/posts/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  /**
   * Delete post (owner only)
   */
  delete: (id: string) => apiClient.delete(`/posts/${id}`),

  /**
   * Toggle like on post
   */
  toggleLike: (id: string) => apiClient.post(`/posts/${id}/like`),

  /**
   * Toggle post availability (owner only)
   */
  toggleAvailability: (id: string) => apiClient.post(`/posts/${id}/toggle-availability`),
};

/**
 * Users API
 */
export const usersApi = {
  /**
   * Create user profile
   * @param data - User profile data (uid, username, email, phone, location)
   */
  createProfile: (data: {
    uid: string;
    username: string;
    email: string;
    phone: string;
    location: string;
  }) => apiClient.post('/users', data),

  /**
   * Get user profile by ID
   */
  getById: (id: string) => apiClient.get(`/users/${id}`),

  /**
   * Get user's posts
   */
  getUserPosts: (id: string, params?: { limit?: number }) =>
    apiClient.get(`/users/${id}/posts`, { params }),

  /**
   * Get user's following list
   */
  getFollowing: (id: string) => apiClient.get(`/users/${id}/following`),

  /**
   * Update user profile (owner only)
   * @param id - User ID
   * @param data - FormData with updated profile data (can include avatar file)
   */
  update: (id: string, data: FormData) => apiClient.put(`/users/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  /**
   * Follow/unfollow user
   */
  toggleFollow: (id: string) => apiClient.post(`/users/${id}/follow`),

  /**
   * Get liked posts (owner only)
   */
  getLikedPosts: (id: string) => apiClient.get(`/users/${id}/liked`),

  /**
   * Get feed from followed users
   */
  getFeed: (id: string, params?: { limit?: number }) =>
    apiClient.get(`/users/${id}/feed`, { params }),
};

/**
 * Chat API
 */
export const chatApi = {
  /**
   * Get all user's chats
   */
  getChats: () => apiClient.get('/chats'),

  /**
   * Create new chat
   * @param participantId - ID of the other user
   */
  createChat: (participantId: string) =>
    apiClient.post('/chats', { participantId }),

  /**
   * Get specific chat
   */
  getChat: (chatId: string) => apiClient.get(`/chats/${chatId}`),

  /**
   * Delete chat
   */
  deleteChat: (chatId: string) => apiClient.delete(`/chats/${chatId}`),

  /**
   * Get messages from chat (paginated)
   * @param chatId - Chat ID
   * @param params - Pagination params (limit, cursor)
   */
  getMessages: (chatId: string, params?: { limit?: number; cursor?: string }) =>
    apiClient.get(`/chats/${chatId}/messages`, { params }),

  /**
   * Send message in chat
   * @param chatId - Chat ID
   * @param text - Message text
   */
  sendMessage: (chatId: string, text: string) =>
    apiClient.post(`/chats/${chatId}/messages`, { text }),

  /**
   * Mark message as read
   */
  markMessageAsRead: (chatId: string, messageId: string) =>
    apiClient.post(`/chats/${chatId}/messages/${messageId}/read`),

  /**
   * Mark all messages as read in a chat
   */
  markAllAsRead: (chatId: string) => apiClient.post(`/chats/${chatId}/read-all`),
};

/**
 * Health check
 */
export const healthApi = {
  check: () => apiClient.get('/health'),
};

// Export the axios instance for custom requests if needed
export default apiClient;
