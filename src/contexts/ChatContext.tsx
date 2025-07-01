import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ChatContextType, ChatState, Conversation, Message, MessageType, MessageStatus } from '../types/chat';
import { mockConversations, mockMessages, mockUsers } from '../services/mock/mockData';
import { generateId } from '../utils/helpers';

// Actions pour le reducer
type ChatAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'SET_ACTIVE_CONVERSATION'; payload: Conversation | null }
  | { type: 'SET_MESSAGES'; payload: { conversationId: string; messages: Message[] } }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: Message }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

// État initial
const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  messages: {},
  isLoading: false,
  error: null,
};

// Reducer pour gérer les états du chat
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload, isLoading: false };
    case 'SET_ACTIVE_CONVERSATION':
      return { ...state, activeConversation: action.payload };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.conversationId]: action.payload.messages
        },
        isLoading: false
      };
    case 'ADD_MESSAGE':
      const conversationId = action.payload.conversationId;
      const existingMessages = state.messages[conversationId] || [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [conversationId]: [...existingMessages, action.payload]
        }
      };
    case 'UPDATE_MESSAGE':
      const msgConversationId = action.payload.conversationId;
      const messagesForConv = state.messages[msgConversationId] || [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [msgConversationId]: messagesForConv.map(msg =>
            msg.id === action.payload.id ? action.payload : msg
          )
        }
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Création du contexte
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte de chat
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Provider du contexte Chat
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  /**
   * Charge la liste des conversations
   */
  const loadConversations = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 800));

      dispatch({ type: 'SET_CONVERSATIONS', payload: mockConversations });
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des conversations' });
    }
  };

  /**
   * Charge les messages d'une conversation
   */
  const loadMessages = async (conversationId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Récupération des messages pour cette conversation
      const conversationMessages = mockMessages
        .filter(msg => msg.conversationId === conversationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      dispatch({ 
        type: 'SET_MESSAGES', 
        payload: { conversationId, messages: conversationMessages } 
      });
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des messages' });
    }
  };

  /**
   * Envoie un message
   */
  const sendMessage = async (conversationId: string, content: string, type: MessageType = MessageType.TEXT) => {
    try {
      const conversation = state.conversations.find(conv => conv.id === conversationId);
      if (!conversation) {
        throw new Error('Conversation non trouvée');
      }

      // Création du message
      const newMessage: Message = {
        id: generateId(),
        conversationId,
        senderId: 'current-user',
        receiverId: conversation.participants.find(p => p.id !== 'current-user')?.id || '',
        content,
        type,
        status: MessageStatus.SENDING,
        timestamp: new Date(),
      };

      // Ajout immédiat du message
      dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
      
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mise à jour du statut
      const sentMessage: Message = {
        ...newMessage,
        status: MessageStatus.SENT,
      };

      dispatch({ type: 'UPDATE_MESSAGE', payload: sentMessage });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de l\'envoi du message' });
    }
  };

  /**
   * Marque un message comme lu
   */
  const markAsRead = async (conversationId: string, messageId: string) => {
    // Simulation simple pour le mock
  };

  /**
   * Démarre une nouvelle conversation
   */
  const startConversation = async (itemId: string, recipientId: string): Promise<string> => {
    return generateId();
  };

  /**
   * Bloque une conversation
   */
  const blockConversation = async (conversationId: string) => {
    // Simulation pour le mock
  };

  /**
   * Supprime une conversation
   */
  const deleteConversation = async (conversationId: string) => {
    // Simulation pour le mock
  };

  /**
   * Définit la conversation active
   */
  const setActiveConversation = (conversation: Conversation | null) => {
    dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conversation });
  };

  // Valeur du contexte
  const contextValue: ChatContextType = {
    ...state,
    loadConversations,
    loadMessages,
    sendMessage,
    markAsRead,
    startConversation,
    blockConversation,
    deleteConversation,
    setActiveConversation,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}; 