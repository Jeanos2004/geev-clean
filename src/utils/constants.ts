import { CategoryType, ItemCondition } from '../types/item';

// Configuration de l'application
export const APP_CONFIG = {
  NAME: 'Geev',
  VERSION: '1.0.0',
  MAX_IMAGES_PER_ITEM: 5,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  DEFAULT_LOCATION_RADIUS: 10, // 10km
  MAX_LOCATION_RADIUS: 50, // 50km
  MESSAGE_MAX_LENGTH: 500,
  ITEM_TITLE_MAX_LENGTH: 80,
  ITEM_DESCRIPTION_MAX_LENGTH: 1000,
  PAGINATION_LIMIT: 20,
  MAP_INITIAL_ZOOM: 0.01,
  LOCATION_TIMEOUT: 10000, // 10 secondes
} as const;

// URLs et endpoints
export const API_ENDPOINTS = {
  BASE_URL: 'https://api.geev.com',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GOOGLE: '/auth/google',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  ITEMS: {
    LIST: '/items',
    DETAIL: '/items',
    CREATE: '/items',
    UPDATE: '/items',
    DELETE: '/items',
    SEARCH: '/items/search',
    NEARBY: '/items/nearby',
  },
  CHAT: {
    CONVERSATIONS: '/conversations',
    MESSAGES: '/conversations',
    SEND: '/conversations',
    READ: '/conversations',
  },
  LOCATION: {
    GEOCODE: '/location/geocode',
    REVERSE: '/location/reverse',
  },
} as const;

// Catégories avec métadonnées
export const CATEGORIES = {
  [CategoryType.ELECTRONICS]: {
    label: 'Électronique',
    icon: 'smartphone',
    color: '#3B82F6',
    tags: ['téléphone', 'ordinateur', 'tablette', 'casque', 'câbles']
  },
  [CategoryType.FURNITURE]: {
    label: 'Mobilier',
    icon: 'home',
    color: '#8B5CF6',
    tags: ['table', 'chaise', 'canapé', 'lit', 'armoire', 'bureau']
  },
  [CategoryType.CLOTHING]: {
    label: 'Vêtements',
    icon: 'shirt',
    color: '#EF4444',
    tags: ['chemise', 'pantalon', 'robe', 'chaussures', 'veste', 'accessoires']
  },
  [CategoryType.BOOKS]: {
    label: 'Livres',
    icon: 'book',
    color: '#10B981',
    tags: ['roman', 'manuel', 'BD', 'magazine', 'revue', 'guide']
  },
  [CategoryType.TOYS_GAMES]: {
    label: 'Jouets & Jeux',
    icon: 'gamepad',
    color: '#F59E0B',
    tags: ['jouet', 'jeu de société', 'puzzle', 'peluche', 'jeu vidéo']
  },
  [CategoryType.SPORTS]: {
    label: 'Sport',
    icon: 'dumbbell',
    color: '#06B6D4',
    tags: ['vélo', 'équipement', 'chaussures', 'vêtements', 'fitness']
  },
  [CategoryType.HOME_GARDEN]: {
    label: 'Maison & Jardin',
    icon: 'leaf',
    color: '#84CC16',
    tags: ['plantes', 'outils', 'décoration', 'électroménager', 'jardinage']
  },
  [CategoryType.BEAUTY]: {
    label: 'Beauté',
    icon: 'heart',
    color: '#EC4899',
    tags: ['cosmétiques', 'parfum', 'soins', 'maquillage', 'accessoires']
  },
  [CategoryType.FOOD]: {
    label: 'Alimentation',
    icon: 'utensils',
    color: '#F97316',
    tags: ['fruits', 'légumes', 'conserves', 'épices', 'boissons']
  },
  [CategoryType.OTHER]: {
    label: 'Autres',
    icon: 'more-horizontal',
    color: '#6B7280',
    tags: ['divers', 'inclassable']
  },
} as const;

// Version tableau pour les méthodes find, map, etc.
export const CATEGORIES_ARRAY = Object.entries(CATEGORIES).map(([key, value]) => ({
  id: key as CategoryType,
  ...value
}));

// États des objets avec métadonnées
export const ITEM_CONDITIONS = {
  [ItemCondition.NEW]: {
    label: 'Neuf',
    description: 'Jamais utilisé, dans son emballage',
    color: '#10B981',
  },
  [ItemCondition.LIKE_NEW]: {
    label: 'Comme neuf',
    description: 'Très peu utilisé, excellent état',
    color: '#059669',
  },
  [ItemCondition.GOOD]: {
    label: 'Bon état',
    description: 'Utilisé mais en bon état',
    color: '#F59E0B',
  },
  [ItemCondition.FAIR]: {
    label: 'État correct',
    description: 'Signes d\'usure visible',
    color: '#F97316',
  },
  [ItemCondition.POOR]: {
    label: 'Mauvais état',
    description: 'Très usé, défauts importants',
    color: '#EF4444',
  },
} as const;

// Messages par défaut
export const DEFAULT_MESSAGES = {
  INTEREST: "Bonjour ! Je suis intéressé(e) par votre objet. Est-il toujours disponible ?",
  THANKS: "Merci beaucoup pour ce don !",
  PICKUP_CONFIRMATION: "Parfait ! À quelle heure puis-je passer le récupérer ?",
  CANCEL: "Désolé(e), je ne peux finalement pas récupérer l'objet.",
} as const;

// Paramètres de la carte
export const MAP_SETTINGS = {
  PARIS_COORDINATES: {
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  CLUSTER_RADIUS: 50,
  MIN_ZOOM: 0.005,
  MAX_ZOOM: 0.0005,
} as const;

// Couleurs de l'application
export const COLORS = {
  PRIMARY: '#0EA5E9',
  SECONDARY: '#8B5CF6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  GRAY: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const;

// Animations
export const ANIMATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
} as const; 