// Types pour la messagerie
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  timestamp: Date;
  readAt?: Date;
  editedAt?: Date;
  replyTo?: string; // ID du message auquel on répond
  attachments?: MessageAttachment[];
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  LOCATION = 'location',
  SYSTEM = 'system' // Messages système (réservation, etc.)
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'document';
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface Conversation {
  id: string;
  itemId: string;
  item: {
    id: string;
    title: string;
    image: string;
    status: string;
  };
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isBlocked: boolean;
}

export interface ConversationParticipant {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  isOnline: boolean;
  lastSeen?: Date;
  role: 'donor' | 'recipient';
}

export interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: { [conversationId: string]: Message[] };
  isLoading: boolean;
  error: string | null;
}

export interface ChatContextType extends ChatState {
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, type?: MessageType) => Promise<void>;
  markAsRead: (conversationId: string, messageId: string) => Promise<void>;
  startConversation: (itemId: string, recipientId: string) => Promise<string>;
  blockConversation: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  setActiveConversation: (conversation: Conversation | null) => void;
} 