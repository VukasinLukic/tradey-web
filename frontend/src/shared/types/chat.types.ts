export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  readBy: string[];
}

