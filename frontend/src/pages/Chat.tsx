import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useChats } from '../hooks/useChats';
import { useChatMessages } from '../hooks/useChatMessages';
import { LoadingState } from '../components/ui/LoadingState';
import { Avatar } from '../components/ui/Avatar';
import { EmojiPicker } from '../components/chat/EmojiPicker';
import { fetchMultipleUsers } from '../hooks/useUserData';

interface UserData {
  uid: string;
  username: string;
  avatarUrl?: string;
}

export function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { chats, loading: chatsLoading, error: chatsError } = useChats();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { messages, loading: messagesLoading, sendMessage, markAllAsRead } = useChatMessages(selectedChatId);
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userDataMap, setUserDataMap] = useState<Map<string, UserData>>(new Map());
  const [minimumLoadingPassed, setMinimumLoadingPassed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Ensure minimum loading time
  useEffect(() => {
    const timer = setTimeout(() => setMinimumLoadingPassed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch all participant data when chats load
  useEffect(() => {
    const loadUserData = async () => {
      if (!chats || chats.length === 0) return;

      const userIds = new Set<string>();
      chats.forEach(chat => {
        chat.participants.forEach(id => {
          if (id !== user?.uid) userIds.add(id);
        });
      });

      const userData = await fetchMultipleUsers(Array.from(userIds));
      setUserDataMap(userData);
    };

    loadUserData();
  }, [chats, user?.uid]);

  // Auto-select first chat (only on desktop, not mobile)
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768; // md breakpoint
    if (!chatsLoading && chats.length > 0 && !selectedChatId && isDesktop) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, chatsLoading, selectedChatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark as read when selecting chat
  useEffect(() => {
    if (selectedChatId) {
      markAllAsRead();
    }
  }, [selectedChatId, markAllAsRead]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [messageText]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const success = await sendMessage(messageText.trim());
    if (success) {
      setMessageText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTimestamp = (date: unknown) => {
    if (!date) return '';

    let messageDate: Date;
    const timestamp = date as { _seconds?: number; seconds?: number };
    if (timestamp._seconds) {
      messageDate = new Date(timestamp._seconds * 1000);
    } else if (timestamp.seconds) {
      messageDate = new Date(timestamp.seconds * 1000);
    } else {
      messageDate = new Date(date as string | number | Date);
    }

    if (isNaN(messageDate.getTime())) return '';

    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'sada';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return messageDate.toLocaleDateString('sr-RS', { day: 'numeric', month: 'short' });
  };

  const getOtherParticipant = (chatParticipants: string[]) => {
    const otherId = chatParticipants.find(id => id !== user?.uid);
    return otherId ? userDataMap.get(otherId) : null;
  };

  if (chatsLoading || !minimumLoadingPassed) {
    return <LoadingState />;
  }

  if (chatsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-tradey-red font-sans text-lg">
          Greška pri učitavanju poruka. Molimo pokušajte ponovo.
        </p>
      </div>
    );
  }

  const selectedChatData = chats.find(c => c.id === selectedChatId);
  const selectedUser = selectedChatData ? getOtherParticipant(selectedChatData.participants) : null;

  return (
    <div className="h-screen flex flex-col bg-tradey-white">
      {/* Mobile: Full screen chat, Desktop: Split view */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat List Sidebar */}
        <div className={`${
          selectedChatId ? 'hidden md:flex' : 'flex'
        } w-full md:w-96 flex-col border-r border-tradey-black/10 bg-white`}>
          {/* Header */}
          <div className="pt-16 md:pt-6 pb-4 pl-6 pr-6 md:pl-40 md:pr-6 border-b border-tradey-black/10">
            <h1 className="font-fayte text-6xl md:text-6xl text-tradey-black uppercase tracking-tight">
              Messages
            </h1>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-20 h-20 bg-tradey-black/5 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-tradey-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="font-sans text-tradey-black/50 text-sm">
                  Još nemate konverzacija
                </p>
              </div>
            ) : (
              chats.map(chat => {
                const otherUser = getOtherParticipant(chat.participants);
                const isSelected = selectedChatId === chat.id;

                return (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-tradey-black/5 transition-colors border-b border-tradey-black/5 ${
                      isSelected ? 'bg-tradey-red/5 border-l-4 border-l-tradey-red' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <Avatar
                      src={otherUser?.avatarUrl}
                      alt={otherUser?.username || 'User'}
                      userId={otherUser?.uid}
                      size="lg"
                      clickable
                    />

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-sans font-semibold text-tradey-black text-sm truncate">
                          {otherUser?.username || 'User'}
                        </p>
                        <span className="font-sans text-xs text-tradey-black/40 ml-2 flex-shrink-0">
                          {formatTimestamp(chat.lastMessageAt)}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-tradey-black/50 truncate">
                        {chat.lastMessage || 'Nova konverzacija'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className={`${
          !selectedChatId ? 'hidden md:flex' : 'flex'
        } flex-1 flex-col bg-tradey-white`}>
          {!selectedChatId ? (
            /* Empty State - No chat selected */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-tradey-black/5 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-tradey-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h2 className="font-fayte text-3xl text-tradey-black uppercase mb-2">
                Izaberite konverzaciju
              </h2>
              <p className="font-sans text-tradey-black/60 text-sm">
                Kliknite na konverzaciju sa leve strane
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="px-3 py-3 pt-14 md:pt-4 md:p-4 border-b border-tradey-black/10 bg-white flex items-center gap-3">
                {/* Back button (mobile only) */}
                <button
                  onClick={() => setSelectedChatId(null)}
                  className="md:hidden p-1 hover:bg-tradey-black/5 rounded-full transition-colors flex-shrink-0"
                  title="Nazad na listu chatova"
                >
                  <svg className="w-5 h-5 text-tradey-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* User Info */}
                <Avatar
                  src={selectedUser?.avatarUrl}
                  alt={selectedUser?.username || 'User'}
                  userId={selectedUser?.uid}
                  size="md"
                  clickable
                />
                <button
                  onClick={() => selectedUser && navigate(`/user/${selectedUser.uid}`)}
                  className="flex-1 text-left hover:opacity-70 transition-opacity"
                >
                  <p className="font-sans font-semibold text-tradey-black text-lg">
                    {selectedUser?.username || 'User'}
                  </p>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-tradey-white to-tradey-black/5">
                {messagesLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-8 h-8 border-4 border-tradey-red/20 border-t-tradey-red rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="font-sans text-tradey-black/50 text-sm">
                      Nema poruka. Započnite konverzaciju!
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isOwn = message.senderId === user?.uid;
                    const messageUser = isOwn ? null : userDataMap.get(message.senderId);
                    const prevMessage = index > 0 ? messages[index - 1] : null;
                    const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

                    return (
                      <div
                        key={message.id}
                        className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        <div className="w-8 flex-shrink-0">
                          {showAvatar && !isOwn && (
                            <Avatar
                              src={messageUser?.avatarUrl}
                              alt={messageUser?.username || 'User'}
                              userId={messageUser?.uid}
                              size="sm"
                              clickable
                            />
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isOwn
                                ? 'bg-tradey-red text-white rounded-br-sm'
                                : 'bg-white border border-tradey-black/10 text-tradey-black rounded-bl-sm'
                            }`}
                          >
                            <p className="font-sans text-sm whitespace-pre-wrap break-words">
                              {message.text}
                            </p>
                          </div>
                          <span
                            className={`font-sans text-xs text-tradey-black/40 mt-1 px-2 ${
                              isOwn ? 'text-right' : 'text-left'
                            }`}
                          >
                            {formatTimestamp(message.createdAt)}
                          </span>
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
                className="p-4 border-t border-tradey-black/10 bg-white relative"
              >
                <div className="flex items-end gap-2">
                  {/* Emoji Picker Button */}
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-tradey-black/60 hover:text-tradey-red hover:bg-tradey-red/5 rounded-full transition-colors flex-shrink-0"
                    title="Dodaj emoji"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Napišite poruku..."
                    rows={1}
                    className="flex-1 px-4 py-3 border border-tradey-black/20 rounded-2xl text-tradey-black font-sans text-sm placeholder:text-tradey-black/30 focus:outline-none focus:border-tradey-red transition-colors resize-none max-h-32 overflow-y-auto"
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="p-3 bg-tradey-red text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                    title="Pošalji (Enter)"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>

                {/* Emoji Picker Popup */}
                {showEmojiPicker && (
                  <EmojiPicker
                    onEmojiSelect={handleEmojiSelect}
                    onClose={() => setShowEmojiPicker(false)}
                  />
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
