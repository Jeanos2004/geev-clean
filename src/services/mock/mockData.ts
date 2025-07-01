import { User } from '../../types/auth';
import { Item, CategoryType, ItemCondition, ItemStatus } from '../../types/item';
import { Conversation, Message, MessageType, MessageStatus } from '../../types/chat';
import { generateId } from '../../utils/helpers';

/**
 * Données mock pour simuler l'API Geev
 * Contient des utilisateurs, objets et messages réalistes
 */

// Utilisateurs mock
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@geev.com',
    firstName: 'Marie',
    lastName: 'Dupont',
    profilePicture: 'https://picsum.photos/150/150?random=1',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      address: '12 Rue de la Paix',
      city: 'Paris',
      zipCode: '75001',
    },
    createdAt: new Date('2023-01-15'),
    verified: true,
    rating: 4.8,
    totalDonations: 15,
    totalReceptions: 8,
  },
  {
    id: '2',
    email: 'pierre.martin@example.com',
    firstName: 'Pierre',
    lastName: 'Martin',
    profilePicture: 'https://picsum.photos/150/150?random=2',
    location: {
      latitude: 48.8606,
      longitude: 2.3376,
      address: '25 Avenue des Champs-Élysées',
      city: 'Paris',
      zipCode: '75008',
    },
    createdAt: new Date('2023-03-20'),
    verified: true,
    rating: 4.5,
    totalDonations: 8,
    totalReceptions: 12,
  },
  {
    id: '3',
    email: 'sophie.bernard@example.com',
    firstName: 'Sophie',
    lastName: 'Bernard',
    profilePicture: 'https://picsum.photos/150/150?random=3',
    location: {
      latitude: 48.8738,
      longitude: 2.2950,
      address: '18 Rue de Rivoli',
      city: 'Paris',
      zipCode: '75004',
    },
    createdAt: new Date('2023-02-10'),
    verified: true,
    rating: 4.9,
    totalDonations: 22,
    totalReceptions: 5,
  },
];

// Objets mock
export const mockItems: Item[] = [
  {
    id: '1',
    title: 'Canapé 3 places en cuir marron',
    description: 'Superbe canapé en cuir véritable, très confortable. Quelques traces d\'usage normales mais en excellent état général. Parfait pour un salon ou une salle de détente. Dimensions : 200cm x 90cm x 80cm. Non fumeur, pas d\'animaux.',
    category: CategoryType.FURNITURE,
    condition: ItemCondition.GOOD,
    images: [
      'https://picsum.photos/400/300?random=10',
      'https://picsum.photos/400/300?random=11',
      'https://picsum.photos/400/300?random=12',
    ],
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      address: '12 Rue de la Paix',
      city: 'Paris',
      zipCode: '75001',
      distance: 2.5,
    },
    owner: {
      id: mockUsers[0].id,
      firstName: mockUsers[0].firstName,
      lastName: mockUsers[0].lastName,
      profilePicture: mockUsers[0].profilePicture,
      rating: mockUsers[0].rating,
      responseRate: 95,
      responseTime: 'quelques heures',
    },
    status: ItemStatus.AVAILABLE,
    dimensions: {
      length: 200,
      width: 90,
      height: 80,
      weight: 45,
    },
    pickup: {
      flexible: true,
      availableDays: ['lundi', 'mardi', 'mercredi', 'vendredi'],
      timeSlots: ['9h-12h', '14h-18h', 'weekend'],
      instructions: 'Sonner au portail, 2ème étage. Ascenseur disponible.',
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    viewCount: 47,
    interestedCount: 3,
    tags: ['confortable', 'salon'],
    isUrgent: false,
  },
  {
    id: '2',
    title: 'Vélo de ville homme 26 pouces',
    description: 'Vélo en très bon état, peu utilisé. 7 vitesses, freins V-brake, éclairage avant et arrière. Parfait pour les déplacements urbains. Quelques rayures sur le cadre mais aucun problème mécanique.',
    category: CategoryType.SPORTS,
    condition: ItemCondition.LIKE_NEW,
    images: [
      'https://picsum.photos/400/300?random=20',
      'https://picsum.photos/400/300?random=21',
    ],
    location: {
      latitude: 48.8606,
      longitude: 2.3376,
      address: '25 Avenue des Champs-Élysées',
      city: 'Paris',
      zipCode: '75008',
      distance: 1.2,
    },
    owner: {
      id: mockUsers[1].id,
      firstName: mockUsers[1].firstName,
      lastName: mockUsers[1].lastName,
      profilePicture: mockUsers[1].profilePicture,
      rating: mockUsers[1].rating,
      responseRate: 88,
      responseTime: 'dans la journée',
    },
    status: ItemStatus.AVAILABLE,
    pickup: {
      flexible: false,
      availableDays: ['samedi', 'dimanche'],
      timeSlots: ['10h-16h'],
      instructions: 'Récupération en bas de l\'immeuble.',
    },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    viewCount: 23,
    interestedCount: 5,
    tags: ['transport', 'écolo'],
    isUrgent: false,
  },
  {
    id: '3',
    title: 'Machine à laver Samsung 8kg',
    description: 'Machine à laver en parfait état de fonctionnement. Très peu utilisée, achetée il y a 2 ans. Toutes les fonctions marchent parfaitement. Classe énergétique A+++. Idéale pour famille nombreuse.',
    category: CategoryType.ELECTRONICS,
    condition: ItemCondition.LIKE_NEW,
    images: [
      'https://picsum.photos/400/300?random=30',
      'https://picsum.photos/400/300?random=31',
    ],
    location: {
      latitude: 48.8738,
      longitude: 2.2950,
      address: '18 Rue de Rivoli',
      city: 'Paris',
      zipCode: '75004',
      distance: 3.8,
    },
    owner: {
      id: mockUsers[2].id,
      firstName: mockUsers[2].firstName,
      lastName: mockUsers[2].lastName,
      profilePicture: mockUsers[2].profilePicture,
      rating: mockUsers[2].rating,
      responseRate: 98,
      responseTime: 'rapidement',
    },
    status: ItemStatus.RESERVED,
    dimensions: {
      length: 60,
      width: 60,
      height: 85,
      weight: 70,
    },
    pickup: {
      flexible: true,
      availableDays: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'],
      timeSlots: ['9h-17h'],
      instructions: 'Aide nécessaire pour le transport. Rez-de-chaussée.',
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-14'),
    viewCount: 89,
    interestedCount: 12,
    tags: ['électroménager', 'urgent'],
    isUrgent: true,
  },
  {
    id: '4',
    title: 'Table à manger extensible en chêne',
    description: 'Belle table familiale en chêne massif. Extensible de 140cm à 200cm. Quelques rayures d\'usage mais très solide. 6 chaises assorties disponibles séparément.',
    category: CategoryType.FURNITURE,
    condition: ItemCondition.GOOD,
    images: [
      'https://picsum.photos/400/300?random=40',
      'https://picsum.photos/400/300?random=41',
    ],
    location: {
      latitude: 48.8556,
      longitude: 2.3486,
      address: '8 Place Vendôme',
      city: 'Paris',
      zipCode: '75001',
      distance: 0.8,
    },
    owner: {
      id: mockUsers[0].id,
      firstName: mockUsers[0].firstName,
      lastName: mockUsers[0].lastName,
      profilePicture: mockUsers[0].profilePicture,
      rating: mockUsers[0].rating,
      responseRate: 95,
      responseTime: 'quelques heures',
    },
    status: ItemStatus.AVAILABLE,
    pickup: {
      flexible: true,
      availableDays: ['samedi', 'dimanche'],
      timeSlots: ['10h-18h'],
      instructions: 'Démontage possible si nécessaire.',
    },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    viewCount: 34,
    interestedCount: 2,
    tags: ['bois', 'famille'],
    isUrgent: false,
  },
  {
    id: '5',
    title: 'Smartphone iPhone 12 64GB',
    description: 'iPhone en excellent état, écran sans rayure. Batterie en très bon état (87%). Avec chargeur Lightning et protection d\'écran déjà installée. Débloqué tout opérateur.',
    category: CategoryType.ELECTRONICS,
    condition: ItemCondition.LIKE_NEW,
    images: [
      'https://picsum.photos/400/300?random=50',
    ],
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      address: '12 Rue de la Paix',
      city: 'Paris',
      zipCode: '75001',
      distance: 2.5,
    },
    owner: {
      id: mockUsers[0].id,
      firstName: mockUsers[0].firstName,
      lastName: mockUsers[0].lastName,
      profilePicture: mockUsers[0].profilePicture,
      rating: mockUsers[0].rating,
      responseRate: 95,
      responseTime: 'quelques heures',
    },
    status: ItemStatus.AVAILABLE,
    pickup: {
      flexible: true,
      availableDays: ['tous les jours'],
      timeSlots: ['flexible'],
      instructions: 'Remise en main propre de préférence.',
    },
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    viewCount: 156,
    interestedCount: 18,
    tags: ['high-tech', 'récent'],
    isUrgent: true,
  },
];

// Messages mock
export const mockMessages = [
  {
    id: '1',
    itemId: '1',
    senderId: '2',
    receiverId: '1',
    text: 'Bonjour, ce canapé est-il toujours disponible ?',
    timestamp: new Date('2024-01-15T10:30:00'),
    read: true,
  },
  {
    id: '2',
    itemId: '1',
    senderId: '1',
    receiverId: '2',
    text: 'Oui tout à fait ! Êtes-vous disponible pour venir le voir ?',
    timestamp: new Date('2024-01-15T11:15:00'),
    read: true,
  },
  {
    id: '3',
    itemId: '1',
    senderId: '2',
    receiverId: '1',
    text: 'Parfait ! Je peux passer samedi matin vers 10h si cela vous convient ?',
    timestamp: new Date('2024-01-15T11:45:00'),
    read: false,
  },
  {
    id: '4',
    itemId: '2',
    senderId: '3',
    receiverId: '2',
    text: 'Bonjour, ce vélo m\'intéresse beaucoup ! Les freins sont-ils en bon état ?',
    timestamp: new Date('2024-01-14T16:20:00'),
    read: true,
  },
  {
    id: '5',
    itemId: '2',
    senderId: '2',
    receiverId: '3',
    text: 'Oui les freins ont été révisés récemment. Le vélo est prêt à rouler !',
    timestamp: new Date('2024-01-14T17:05:00'),
    read: true,
  },
];

// Fonctions utilitaires pour les API mock
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiCall = async <T>(data: T, delayMs: number = 500): Promise<T> => {
  await delay(delayMs);
  return data;
};

// Fonction utilitaire pour obtenir un utilisateur par ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Fonction utilitaire pour obtenir des objets filtrés
export const getFilteredItems = (filters: {
  category?: CategoryType;
  search?: string;
  location?: { latitude: number; longitude: number; radius: number };
}): Item[] => {
  let filtered = [...mockItems];

  if (filters.category) {
    filtered = filtered.filter(item => item.category === filters.category);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  return filtered;
}; 