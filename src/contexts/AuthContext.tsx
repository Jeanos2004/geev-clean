import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../services/api';
import { User, AuthCredentials, RegisterData, AuthState, AuthContextType } from '../types/auth';

// État initial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Clés pour le stockage sécurisé
const STORAGE_KEYS = {
  USER: 'geev_user',
  TOKEN: 'geev_token',
} as const;

/**
 * Provider d'authentification pour l'application Geev
 * Gère l'état de connexion, les tokens et la persistance
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Vérifie si l'utilisateur est déjà connecté au démarrage
   */
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Récupérer les données stockées
      const [storedUser, storedToken] = await Promise.all([
        SecureStore.getItemAsync(STORAGE_KEYS.USER),
        SecureStore.getItemAsync(STORAGE_KEYS.TOKEN),
      ]);

      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut d\'authentification:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  /**
   * Stocke les données d'authentification de manière sécurisée
   */
  const storeAuthData = async (user: User, token: string) => {
    try {
      await Promise.all([
        SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user)),
        SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token),
      ]);
    } catch (error) {
      console.error('Erreur lors du stockage des données d\'authentification:', error);
    }
  };

  /**
   * Supprime les données d'authentification stockées
   */
  const clearAuthData = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.USER),
        SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN),
      ]);
    } catch (error) {
      console.error('Erreur lors de la suppression des données d\'authentification:', error);
    }
  };

  /**
   * Connexion avec email et mot de passe
   */
  const login = async (credentials: AuthCredentials): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const { user, token } = await authApi.login(credentials);
      
      await storeAuthData(user, token);
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  /**
   * Inscription avec email et mot de passe
   */
  const register = async (data: RegisterData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const { user, token } = await authApi.register(data);
      
      await storeAuthData(user, token);
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'inscription';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  /**
   * Connexion avec Google (placeholder pour future implémentation)
   */
  const loginWithGoogle = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      // TODO: Implémenter la connexion Google avec expo-auth-session
      // Pour l'instant, utiliser un utilisateur de test
      const mockUser: User = {
        id: 'google-user-' + Date.now(),
        email: 'google@example.com',
        firstName: 'Utilisateur',
        lastName: 'Google',
        location: {
          latitude: 48.8566,
          longitude: 2.3522,
          address: 'Paris, France',
          city: 'Paris',
          zipCode: '75001',
        },
        createdAt: new Date(),
        verified: true,
        rating: 5,
        totalDonations: 0,
        totalReceptions: 0,
      };

      const token = 'google-token-' + Date.now();
      
      await storeAuthData(mockUser, token);
      dispatch({ type: 'SET_USER', payload: mockUser });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion Google';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  /**
   * Déconnexion
   */
  const logout = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await authApi.logout();
      await clearAuthData();
      
      dispatch({ type: 'CLEAR_USER' });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, on déconnecte localement
      await clearAuthData();
      dispatch({ type: 'CLEAR_USER' });
    }
  };

  /**
   * Mise à jour du profil utilisateur
   */
  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!state.user) {
      throw new Error('Aucun utilisateur connecté');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const updatedUser = { ...state.user, ...data };
      
      // Mettre à jour en stockage sécurisé
      await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de mise à jour';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  /**
   * Efface les erreurs
   */
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    loginWithGoogle,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte d'authentification
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 