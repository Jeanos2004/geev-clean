import './global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { ItemsProvider } from './src/contexts/ItemsContext';
import { ChatProvider } from './src/contexts/ChatContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Application principale GeevClean
 * Clone de l'application Geev pour le don d'objets entre particuliers
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <ItemsProvider>
            <ChatProvider>
              <AppNavigator />
      <StatusBar style="auto" />
            </ChatProvider>
          </ItemsProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
