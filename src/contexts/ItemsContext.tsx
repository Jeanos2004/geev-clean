import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Item, ItemFilter, CreateItemData, CategoryType } from '../types/item';
import { mockItems, getFilteredItems } from '../services/mock/mockData';
import { generateId } from '../utils/helpers';

// État du contexte Items
interface ItemsState {
  items: Item[];
  filteredItems: Item[];
  currentItem: Item | null;
  isLoading: boolean;
  error: string | null;
  filters: ItemFilter;
  searchQuery: string;
  hasMore: boolean;
  page: number;
}

// Type du contexte Items
interface ItemsContextType extends ItemsState {
  loadItems: () => Promise<void>;
  refreshItems: () => Promise<void>;
  loadMoreItems: () => Promise<void>;
  searchItems: (query: string) => void;
  filterByCategory: (category: CategoryType) => void;
  setFilters: (filters: Partial<ItemFilter>) => void;
  clearFilters: () => void;
  getItemById: (id: string) => Promise<Item | null>;
  createItem: (data: CreateItemData) => Promise<string>;
  updateItem: (id: string, data: Partial<CreateItemData>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  markItemAsReserved: (id: string) => Promise<void>;
  markItemAsGiven: (id: string) => Promise<void>;
  incrementViewCount: (id: string) => void;
  incrementInterestedCount: (id: string) => void;
  clearError: () => void;
}

// Actions pour le reducer
type ItemsAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ITEMS'; payload: Item[] }
  | { type: 'ADD_ITEMS'; payload: Item[] }
  | { type: 'SET_FILTERED_ITEMS'; payload: Item[] }
  | { type: 'SET_CURRENT_ITEM'; payload: Item | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: ItemFilter }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'UPDATE_ITEM'; payload: Item }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'CLEAR_ERROR' };

// État initial
const initialState: ItemsState = {
  items: [],
  filteredItems: [],
  currentItem: null,
  isLoading: false,
  error: null,
  filters: {},
  searchQuery: '',
  hasMore: true,
  page: 1,
};

// Reducer pour gérer les états des items
const itemsReducer = (state: ItemsState, action: ItemsAction): ItemsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ITEMS':
      return { ...state, items: action.payload, isLoading: false };
    case 'ADD_ITEMS':
      return { 
        ...state, 
        items: [...state.items, ...action.payload], 
        isLoading: false 
      };
    case 'SET_FILTERED_ITEMS':
      return { ...state, filteredItems: action.payload };
    case 'SET_CURRENT_ITEM':
      return { ...state, currentItem: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id ? action.payload : item
        ),
        filteredItems: state.filteredItems.map(item => 
          item.id === action.payload.id ? action.payload : item
        ),
        currentItem: state.currentItem?.id === action.payload.id ? action.payload : state.currentItem
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        filteredItems: state.filteredItems.filter(item => item.id !== action.payload),
        currentItem: state.currentItem?.id === action.payload ? null : state.currentItem
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Création du contexte
const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte des items
export const useItems = () => {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};

// Provider du contexte Items
export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(itemsReducer, initialState);

  // Chargement initial des items
  useEffect(() => {
    loadItems();
  }, []);

  // Application des filtres et recherche
  useEffect(() => {
    applyFiltersAndSearch();
  }, [state.items, state.filters, state.searchQuery]);

  /**
   * Applique les filtres et la recherche
   */
  const applyFiltersAndSearch = () => {
    let filtered = [...state.items];

    // Application des filtres
    filtered = getFilteredItems({
      ...state.filters,
      search: state.searchQuery
    });

    dispatch({ type: 'SET_FILTERED_ITEMS', payload: filtered });
  };

  /**
   * Charge la liste des items
   */
  const loadItems = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Chargement des données mock
      const items = [...mockItems].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      dispatch({ type: 'SET_ITEMS', payload: items });
      dispatch({ type: 'SET_PAGE', payload: 1 });
      dispatch({ type: 'SET_HAS_MORE', payload: items.length >= 20 });
    } catch (error) {
      console.error('Erreur lors du chargement des items:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des objets' });
    }
  };

  /**
   * Charge plus d'items (pagination)
   */
  const loadMoreItems = async () => {
    if (!state.hasMore || state.isLoading) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Simulation d'une requête API pour la pagination
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulation de données supplémentaires (ici on ne fait rien car on a peu de données mock)
      const newItems: Item[] = [];

      dispatch({ type: 'ADD_ITEMS', payload: newItems });
      dispatch({ type: 'SET_PAGE', payload: state.page + 1 });
      dispatch({ type: 'SET_HAS_MORE', payload: newItems.length >= 20 });
    } catch (error) {
      console.error('Erreur lors du chargement de plus d\'items:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement' });
    }
  };

  /**
   * Recherche d'items par texte
   */
  const searchItems = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  /**
   * Définit les filtres
   */
  const setFilters = (filters: Partial<ItemFilter>) => {
    const newFilters = { ...state.filters, ...filters };
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  /**
   * Efface tous les filtres
   */
  const clearFilters = () => {
    dispatch({ type: 'SET_FILTERS', payload: {} });
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
  };

  /**
   * Récupère un item par son ID
   */
  const getItemById = async (id: string): Promise<Item | null> => {
    try {
      // Vérification dans le cache local
      const cachedItem = state.items.find(item => item.id === id);
      if (cachedItem) {
        dispatch({ type: 'SET_CURRENT_ITEM', payload: cachedItem });
        return cachedItem;
      }

      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 500));

      const item = mockItems.find(item => item.id === id);
      if (item) {
        dispatch({ type: 'SET_CURRENT_ITEM', payload: item });
        return item;
      }

      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la récupération de l\'objet' });
      return null;
    }
  };

  /**
   * Crée un nouvel item
   */
  const createItem = async (data: CreateItemData): Promise<string> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newItem: Item = {
        ...data,
        id: generateId(),
        owner: {
          id: 'current-user',
          firstName: 'Jean',
          lastName: 'Test',
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          rating: 4.7,
          responseRate: 92,
          responseTime: 'rapidement'
        },
        status: data.isUrgent ? 'available' : 'available' as any,
        createdAt: new Date(),
        updatedAt: new Date(),
        viewCount: 0,
        interestedCount: 0,
      };

      // Ajout à la liste mock
      mockItems.unshift(newItem);

      // Mise à jour du state
      dispatch({ type: 'SET_ITEMS', payload: [newItem, ...state.items] });

      return newItem.id;
    } catch (error) {
      console.error('Erreur lors de la création de l\'item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la création de l\'objet' });
      throw error;
    }
  };

  /**
   * Met à jour un item
   */
  const updateItem = async (id: string, data: Partial<CreateItemData>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const existingItem = state.items.find(item => item.id === id);
      if (!existingItem) {
        throw new Error('Objet non trouvé');
      }

      const updatedItem: Item = {
        ...existingItem,
        ...data,
        updatedAt: new Date(),
      };

      // Mise à jour dans la liste mock
      const itemIndex = mockItems.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        mockItems[itemIndex] = updatedItem;
      }

      dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la mise à jour de l\'objet' });
    }
  };

  /**
   * Supprime un item
   */
  const deleteItem = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Suppression de la liste mock
      const itemIndex = mockItems.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        mockItems.splice(itemIndex, 1);
      }

      dispatch({ type: 'DELETE_ITEM', payload: id });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la suppression de l\'objet' });
    }
  };

  /**
   * Marque un item comme réservé
   */
  const markItemAsReserved = async (id: string) => {
    await updateItemStatus(id, 'reserved' as any);
  };

  /**
   * Marque un item comme donné
   */
  const markItemAsGiven = async (id: string) => {
    await updateItemStatus(id, 'given' as any);
  };

  /**
   * Met à jour le statut d'un item
   */
  const updateItemStatus = async (id: string, status: string) => {
    try {
      const existingItem = state.items.find(item => item.id === id);
      if (!existingItem) return;

      const updatedItem: Item = {
        ...existingItem,
        status: status as any,
        updatedAt: new Date(),
      };

      // Mise à jour dans la liste mock
      const itemIndex = mockItems.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        mockItems[itemIndex] = updatedItem;
      }

      dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  /**
   * Incrémente le nombre de vues
   */
  const incrementViewCount = (id: string) => {
    const item = state.items.find(item => item.id === id);
    if (item) {
      const updatedItem: Item = {
        ...item,
        viewCount: item.viewCount + 1,
      };

      // Mise à jour dans la liste mock
      const itemIndex = mockItems.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        mockItems[itemIndex] = updatedItem;
      }

      dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
    }
  };

  /**
   * Incrémente le nombre d'intéressés
   */
  const incrementInterestedCount = (id: string) => {
    const item = state.items.find(item => item.id === id);
    if (item) {
      const updatedItem: Item = {
        ...item,
        interestedCount: item.interestedCount + 1,
      };

      // Mise à jour dans la liste mock
      const itemIndex = mockItems.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        mockItems[itemIndex] = updatedItem;
      }

      dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
    }
  };

  /**
   * Efface les erreurs
   */
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  /**
   * Alias pour loadItems (compatibilité)
   */
  const refreshItems = loadItems;

  /**
   * Filtre par catégorie
   */
  const filterByCategory = (category: CategoryType) => {
    setFilters({ category });
  };

  // Valeur du contexte
  const contextValue: ItemsContextType = {
    ...state,
    loadItems,
    refreshItems,
    loadMoreItems,
    searchItems,
    filterByCategory,
    setFilters,
    clearFilters,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    markItemAsReserved,
    markItemAsGiven,
    incrementViewCount,
    incrementInterestedCount,
    clearError,
  };

  return (
    <ItemsContext.Provider value={contextValue}>
      {children}
    </ItemsContext.Provider>
  );
}; 