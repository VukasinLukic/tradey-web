export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: Date;
  updatedAt: Date;
  deletedFor?: string[]; // Users who have "deleted" this chat (soft delete)
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  readBy: string[];
}

