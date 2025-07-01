// Types pour les objets à donner/recevoir
export interface Item {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  condition: ItemCondition;
  images: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    zipCode: string;
    distance?: number; // Distance depuis la position de l'utilisateur
  };
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    rating: number;
    responseRate: number;
    responseTime: string; // ex: "quelques heures"
  };
  status: ItemStatus;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
  };
  pickup: {
    flexible: boolean;
    availableDays: string[];
    timeSlots: string[];
    instructions?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  interestedCount: number;
  tags: string[];
  isUrgent: boolean;
  expiresAt?: Date;
}

export enum CategoryType {
  ELECTRONICS = 'electronics',
  FURNITURE = 'furniture',
  CLOTHING = 'clothing',
  BOOKS = 'books',
  TOYS_GAMES = 'toys_games',
  SPORTS = 'sports',
  HOME_GARDEN = 'home_garden',
  BEAUTY = 'beauty',
  FOOD = 'food',
  OTHER = 'other'
}

export enum ItemCondition {
  NEW = 'new',
  LIKE_NEW = 'like_new',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

export enum ItemStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  GIVEN = 'given',
  EXPIRED = 'expired'
}

export interface ItemFilter {
  category?: CategoryType;
  condition?: ItemCondition[];
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // en km
  };
  search?: string;
  tags?: string[];
  isUrgent?: boolean;
  maxDistance?: number;
}

export interface CreateItemData {
  title: string;
  description: string;
  category: CategoryType;
  condition: ItemCondition;
  images: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    zipCode: string;
  };
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
  };
  pickup: {
    flexible: boolean;
    availableDays: string[];
    timeSlots: string[];
    instructions?: string;
  };
  tags: string[];
  isUrgent: boolean;
  expiresAt?: Date;
} 