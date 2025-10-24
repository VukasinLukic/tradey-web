import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useChats } from '../hooks/useChats';
import { useChatMessages } from '../hooks/useChatMessages';
import { Spinner } from '../components/ui/Spinner';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState, EmptyIcons } from '../components/ui/EmptyState';
import { Toast } from '../components/ui/Toast';
import { usersApi } from '../services/api';

export function ChatPage() {
  const { user } = useAuth();
  const { chats, loading: chatsLoading, error: chatsError } = useChats();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { messages, loading: messagesLoading, sendMessage, markAllAsRead } = useChatMessages(selectedChatId);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; username: string } | null>(null);
  const lastToastMessageIdRef = useRef<string | null>(null);
  const [usernames, setUsernames] = useState<Record<string, string>>({});
  const [minimumLoadingPassed, setMinimumLoadingPassed] = useState(false);

  // Ensure minimum loading time to prevent UI flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumLoadingPassed(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Memoized toast close handler
  const handleToastClose = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Fetch usernames for all chat participants
  useEffect(() => {
    const fetchUsernames = async () => {
      if (!chats || chats.length === 0) return;

      const userIds = new Set<string>();
      chats.forEach(chat => {
        chat.participants.forEach(id => {
          if (id !== user?.uid) {
            userIds.add(id);
          }
        });
      });

      const usernameMap: Record<string, string> = {};
      await Promise.all(
        Array.from(userIds).map(async (userId) => {
          try {
            const response = await usersApi.getById(userId);
            usernameMap[userId] = response.data.username || `User ${userId.substring(0, 8)}`;
          } catch (error) {
            console.error(`Failed to fetch username for ${userId}:`, error);
            usernameMap[userId] = `User ${userId.substring(0, 8)}`;
          }
        })
      );

      setUsernames(usernameMap);
    };

    fetchUsernames();
  }, [chats, user?.uid]);

  // Auto-select first chat when chats load
  useEffect(() => {
    if (!chatsLoading && chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, chatsLoading, selectedChatId]);

  // Reset message count when changing chats
  useEffect(() => {
    lastToastMessageIdRef.current = null;
    setToastMessage(null);
  }, [selectedChatId]);

  // Detect new messages and show toast
  useEffect(() => {
    if (messages.length > 0) {
      const newMessage = messages[messages.length - 1];
      if (
        newMessage?.senderId &&
        newMessage.senderId !== user?.uid &&
        newMessage.id !== lastToastMessageIdRef.current
      ) {
        lastToastMessageIdRef.current = newMessage.id;
        setToastMessage({
          text: newMessage.text,
          username: usernames[newMessage.senderId] || `User ${newMessage.senderId.substring(0, 8)}`,
        });
      }
    }
  }, [messages, user?.uid, usernames]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when chat is selected
  useEffect(() => {
    if (selectedChatId) {
      markAllAsRead();
    }
  }, [selectedChatId, markAllAsRead]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const success = await sendMessage(messageText.trim());
    if (success) {
      setMessageText('');
    }
  };

  const formatTimestamp = (date: unknown) => {
    if (!date) return 'Just now';

    // Handle Firebase Timestamp object
    let messageDate: Date;
    const timestamp = date as { _seconds?: number; seconds?: number };
    if (timestamp._seconds) {
      // Firebase Timestamp format
      messageDate = new Date(timestamp._seconds * 1000);
    } else if (timestamp.seconds) {
      // Alternative Firebase Timestamp format
      messageDate = new Date(timestamp.seconds * 1000);
    } else {
      // Regular Date or string
      messageDate = new Date(date as string | number | Date);
    }
    
    // Check if date is valid
    if (isNaN(messageDate.getTime())) {
      return 'Just now';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return messageDate.toLocaleDateString();
  };

  if (chatsLoading || !minimumLoadingPassed) {
    return <LoadingState message="Učitavanje poruka..." size="lg" />;
  }

  if (chatsError) {
    return (
      <div className="text-center py-12">
        <p className="text-tradey-red font-garamond text-lg">
          Greška pri učitavanju poruka. Molimo pokušajte ponovo.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
        <h1 className="font-fayte text-5xl md:text-7xl text-tradey-black mb-2 tracking-tight uppercase">
          Messages
        </h1>
        <p className="font-sans text-tradey-black/60 text-sm">
          Connect with other traders
        </p>
      </div>

      {/* Chat Layout */}
      <div className="border border-tradey-black/20 overflow-hidden flex flex-col md:flex-row h-[600px]">
        {/* Chats List - Left Sidebar */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-tradey-black/20 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center">
                <EmptyIcons.NoMessages />
                <p className="font-sans text-tradey-black/50 text-sm mt-4">
                  Još nemate konverzacija
                </p>
              </div>
            </div>
          ) : (
            chats.map(chat => {
              const otherParticipantId = chat.participants.find(id => id !== user?.uid);
              const displayUsername = otherParticipantId
                ? (usernames[otherParticipantId] || `User ${otherParticipantId.substring(0, 8)}`)
                : 'Unknown User';
              return (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`w-full p-4 border-b border-tradey-black/10 hover:bg-tradey-black/5 transition-colors text-left ${
                    selectedChatId === chat.id ? 'bg-tradey-black/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar placeholder */}
                    <div className="w-12 h-12 rounded-full bg-tradey-black/10 flex-shrink-0 flex items-center justify-center">
                      <span className="font-sans text-tradey-black text-sm font-medium">
                        {displayUsername.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-medium text-tradey-black text-sm truncate">
                        {displayUsername}
                      </p>
                      <p className="font-sans text-xs text-tradey-black/50 truncate">
                        {chat.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                    <div className="text-xs text-tradey-black/40 font-sans">
                      {formatTimestamp(chat.lastMessageAt)}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Messages Area - Right Side */}
        <div className="flex-1 flex flex-col bg-white">
          {!selectedChatId ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <EmptyState
                icon={<EmptyIcons.NoMessages />}
                title="Izaberite konverzaciju"
                description="Kliknite na konverzaciju sa leve strane da počnete razmenu poruka"
              />
            </div>
          ) : (
            <>
              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-tradey-black/5">
                {messagesLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="font-sans text-tradey-black/50 text-sm">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  messages.map(message => {
                    const isOwn = message.senderId === user?.uid;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 ${
                            isOwn
                              ? 'bg-tradey-red text-white'
                              : 'bg-white border border-tradey-black/20 text-tradey-black'
                          }`}
                        >
                          <p className="font-sans text-sm">{message.text}</p>
                          <p
                            className={`text-xs mt-1 font-sans ${
                              isOwn ? 'text-white/70' : 'text-tradey-black/40'
                            }`}
                          >
                            {formatTimestamp(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-tradey-black/20 p-4 flex gap-3 bg-white"
              >
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-tradey-black/20 text-tradey-black font-sans text-sm placeholder:text-tradey-black/30 focus:outline-none focus:border-tradey-red transition-colors"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="px-6 py-3 bg-tradey-red text-white font-sans text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
        </div>

      {/* Toast notification for new messages */}
      {toastMessage && (
        <Toast
          message={toastMessage.text}
          username={toastMessage.username}
          onClose={handleToastClose}
        />
      )}
    </div>
  );
} 