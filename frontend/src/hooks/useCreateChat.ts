import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export function useCreateChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createChat = async (recipientId: string, initialMessage?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Create or get existing chat
      const response = await api.post('/chats', {
        participantId: recipientId,
      });

      const chatId = response.data.id;

      // Send initial message if provided
      if (initialMessage) {
        await api.post(`/chats/${chatId}/messages`, {
          text: initialMessage,
        });
      }

      // Navigate to chat page
      navigate('/chat');

      return chatId;
    } catch (err: unknown) {
      console.error('Error creating chat:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to start conversation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createChat,
    loading,
    error,
  };
}
