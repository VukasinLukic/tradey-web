import { useState, useEffect } from 'react';
import { chatApi } from '../services/api';
import type { Chat } from '../types/entities';

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatApi.getChats();
      setChats(response.data);
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createChat = async (participantId: string): Promise<Chat | null> => {
    try {
      const response = await chatApi.createChat(participantId);
      const newChat = response.data;
      setChats(prev => [newChat, ...prev]);
      return newChat;
    } catch (err) {
      console.error('Error creating chat:', err);
      setError(err as Error);
      return null;
    }
  };

  const deleteChat = async (chatId: string): Promise<boolean> => {
    try {
      await chatApi.deleteChat(chatId);
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      return true;
    } catch (err) {
      console.error('Error deleting chat:', err);
      setError(err as Error);
      return false;
    }
  };

  const refetch = () => {
    fetchChats();
  };

  return { chats, loading, error, createChat, deleteChat, refetch };
}
