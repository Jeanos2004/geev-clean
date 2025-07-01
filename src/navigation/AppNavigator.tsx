import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

/**
 * Navigateur principal de l'application
 * Détermine si l'utilisateur doit voir l'écran d'authentification ou l'application principale
 */
const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Affichage du loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  // Retourne le navigateur approprié selon l'état d'authentification
  return isAuthenticated ? <TabNavigator /> : <AuthNavigator />;
};

export default AppNavigator; 