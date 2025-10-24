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

      // Set Content-Type only for non-FormData requests
      // FormData will automatically set correct Content-Type with boundary
      if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
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
 * Response interceptor - Handle common errors with user-friendly messages
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    // Create a user-friendly error message
    let userMessage = 'Nešto je pošlo po zlu. Molimo pokušajte ponovo.';

    if (error.response) {
      const { status, data } = error.response;

      // Use backend error message if available
      const backendMessage = data?.error || data?.message;

      switch (status) {
        case 400:
          userMessage = backendMessage || 'Neispravni podaci. Proverite unete informacije.';
          break;
        case 401:
          userMessage = 'Niste prijavljeni. Molimo prijavite se ponovo.';
          console.error('Unauthorized - token invalid or expired');
          // Redirect to login page
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          }
          break;
        case 403:
          userMessage = 'Nemate dozvolu za ovu akciju.';
          break;
        case 404:
          userMessage = backendMessage || 'Traženi sadržaj ne postoji.';
          break;
        case 409:
          userMessage = backendMessage || 'Konflikt podataka. Molimo proverite i pokušajte ponovo.';
          break;
        case 429:
          userMessage = backendMessage || 'Previše zahteva. Molimo sačekajte nekoliko minuta.';
          break;
        case 500:
        case 502:
        case 503:
          userMessage = 'Problem sa serverom. Molimo pokušajte ponovo za nekoliko trenutaka.';
          break;
        default:
          userMessage = backendMessage || `Greška ${status}. Molimo pokušajte ponovo.`;
      }

      console.error(`API Error ${status}:`, userMessage);
    } else if (error.request) {
      // Network error - no response received
      userMessage = 'Nema internet konekcije. Proverite vašu mrežu.';
      console.error('Network error - no response from server');
    } else {
      // Error in request setup
      userMessage = 'Greška prilikom slanja zahteva. Molimo pokušajte ponovo.';
      console.error('Request setup error:', error.message);
    }

    // Attach user-friendly message to error object
    const enhancedError = {
      ...error,
      userMessage,
      originalMessage: error.message,
    };

    return Promise.reject(enhancedError);
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
  create: (data: FormData) => apiClient.post('/posts', data),

  /**
   * Update post (owner only)
   * @param id - Post ID
   * @param data - FormData with updated data
   */
  update: (id: string, data: FormData) => apiClient.put(`/posts/${id}`, data),

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
   * Get user's followers list
   */
  getFollowers: (id: string) => apiClient.get(`/users/${id}/followers`),

  /**
   * Update user profile (owner only)
   * @param id - User ID
   * @param data - FormData with updated profile data (can include avatar file)
   */
  update: (id: string, data: FormData) => apiClient.put(`/users/${id}`, data),

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
