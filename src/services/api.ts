import { mockUsers, mockItems, mockMessages, mockApiCall } from './mock/mockData';
import { Item, ItemFilter, CategoryType } from '../types/item';
import { User, AuthCredentials, RegisterData } from '../types/auth';

/**
 * Service API simulé pour l'application Geev
 * Utilise des données mock avec des délais réalistes
 */

// Simulation d'un stockage local pour la session
let currentUser: User | null = null;
let authToken: string | null = null;

// API d'authentification
export const authApi = {
  login: async (credentials: AuthCredentials): Promise<{ user: User; token: string }> => {
    if (credentials.email === 'demo@geev.com' && credentials.password === 'demo123') {
      const user = mockUsers[0];
      const token = 'fake-jwt-token-' + Date.now();
      
      currentUser = user;
      authToken = token;
      
      return mockApiCall({ user, token });
    }
    throw new Error('Identifiants invalides');
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      location: {
        latitude: 48.8566,
        longitude: 2.3522,
        address: 'Adresse non renseignée',
        city: 'Paris',
        zipCode: '75001',
      },
      createdAt: new Date(),
      verified: false,
      rating: 5,
      totalDonations: 0,
      totalReceptions: 0,
    };

    const token = 'fake-jwt-token-' + Date.now();
    currentUser = newUser;
    authToken = token;

    return mockApiCall({ user: newUser, token });
  },

  logout: async (): Promise<void> => {
    currentUser = null;
    authToken = null;
    return mockApiCall(undefined, 300);
  },

  getCurrentUser: (): User | null => currentUser,
  
  getToken: (): string | null => authToken,
};

// API des objets
export const itemsApi = {
  getItems: async (filters?: ItemFilter): Promise<Item[]> => {
    let filteredItems = [...mockItems];

    if (filters) {
      if (filters.category) {
        filteredItems = filteredItems.filter(item => item.category === filters.category);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredItems = filteredItems.filter(item =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      if (filters.condition) {
        filteredItems = filteredItems.filter(item => filters.condition!.includes(item.condition));
      }

      if (filters.location && filters.maxDistance) {
        filteredItems = filteredItems.filter(item => {
          if (!item.location.distance) return true;
          return item.location.distance <= filters.maxDistance!;
        });
      }

      if (filters.isUrgent !== undefined) {
        filteredItems = filteredItems.filter(item => item.isUrgent === filters.isUrgent);
      }
    }

    // Trier par date de création (plus récent en premier)
    filteredItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return mockApiCall(filteredItems);
  },

  getItemById: async (id: string): Promise<Item | null> => {
    const item = mockItems.find(item => item.id === id);
    if (!item) return null;

    // Incrémenter le nombre de vues
    item.viewCount += 1;

    return mockApiCall(item);
  },

  createItem: async (itemData: any): Promise<Item> => {
    if (!currentUser) {
      throw new Error('Utilisateur non authentifié');
    }

    const newItem: Item = {
      ...itemData,
      id: Date.now().toString(),
      owner: {
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        profilePicture: currentUser.profilePicture,
        rating: currentUser.rating,
        responseRate: 95,
        responseTime: 'quelques heures',
      },
      viewCount: 0,
      interestedCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Ajouter au tableau mock (simulation)
    mockItems.unshift(newItem);

    return mockApiCall(newItem);
  },

  getCategories: (): CategoryType[] => {
    return Object.values(CategoryType);
  },
};

// API des messages
export const messagesApi = {
  getMessagesForItem: async (itemId: string): Promise<any[]> => {
    const itemMessages = mockMessages.filter(msg => msg.itemId === itemId);
    return mockApiCall(itemMessages);
  },

  sendMessage: async (messageData: {
    itemId: string;
    receiverId: string;
    text: string;
  }): Promise<any> => {
    if (!currentUser) {
      throw new Error('Utilisateur non authentifié');
    }

    const newMessage = {
      id: Date.now().toString(),
      itemId: messageData.itemId,
      senderId: currentUser.id,
      receiverId: messageData.receiverId,
      text: messageData.text,
      timestamp: new Date(),
      read: false,
    };

    // Ajouter au tableau mock (simulation)
    mockMessages.push(newMessage);

    return mockApiCall(newMessage);
  },

  getConversations: async (): Promise<any[]> => {
    if (!currentUser) return [];

    // Grouper les messages par conversation (item + participants)
    const conversations = new Map();
    
    mockMessages
      .filter(msg => msg.senderId === currentUser!.id || msg.receiverId === currentUser!.id)
      .forEach(msg => {
        const conversationKey = `${msg.itemId}-${msg.senderId === currentUser!.id ? msg.receiverId : msg.senderId}`;
        
        if (!conversations.has(conversationKey)) {
          const item = mockItems.find(i => i.id === msg.itemId);
          const otherUserId = msg.senderId === currentUser!.id ? msg.receiverId : msg.senderId;
          const otherUser = mockUsers.find(u => u.id === otherUserId);
          
          conversations.set(conversationKey, {
            id: conversationKey,
            item,
            otherUser,
            messages: [],
            lastMessage: null,
            unreadCount: 0,
          });
        }
        
        const conversation = conversations.get(conversationKey);
        conversation.messages.push(msg);
        conversation.lastMessage = msg;
        
        if (!msg.read && msg.receiverId === currentUser!.id) {
          conversation.unreadCount++;
        }
      });

    return mockApiCall(Array.from(conversations.values()));
  },
}; 