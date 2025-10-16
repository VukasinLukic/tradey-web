import { useState, useEffect, useCallback } from 'react';
import { chatApi } from '../services/api';
import type { Message } from '../types/entities';

export function useChatMessages(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await chatApi.getMessages(chatId);
      // Backend returns { messages: [...], nextCursor, hasMore }
      setMessages(response.data.messages || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    fetchMessages();
  }, [chatId, fetchMessages]);

  const sendMessage = async (text: string): Promise<boolean> => {
    if (!chatId) return false;

    try {
      const response = await chatApi.sendMessage(chatId, text);
      const newMessage = response.data;
      setMessages(prev => [...prev, newMessage]);
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err as Error);
      return false;
    }
  };

  const markAllAsRead = async (): Promise<boolean> => {
    if (!chatId) return false;

    try {
      await chatApi.markAllAsRead(chatId);
      return true;
    } catch (err) {
      console.error('Error marking messages as read:', err);
      return false;
    }
  };

  const refetch = () => {
    fetchMessages();
  };

  return { messages, loading, error, sendMessage, markAllAsRead, refetch };
}
