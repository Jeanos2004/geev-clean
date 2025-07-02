import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import des écrans
import HomeScreen from '../screens/home/HomeScreen';
import ItemDetailScreen from '../screens/home/ItemDetailScreen';
import MapScreen from '../screens/map/MapScreen';
import AddItemScreen from '../screens/add/AddItemScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

// Types pour la navigation principale
export type MainStackParamList = {
  Home: undefined;
  ItemDetail: { itemId: string };
  Map: undefined;
  AddItem: undefined;
  ChatList: undefined;
  Chat: { conversationId: string; itemTitle?: string };
  Profile: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

/**
 * Navigateur principal moderne sans tabs
 * Navigation centrée sur l'accueil avec des actions rapides
 */
const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false, // Headers personnalisés dans chaque écran
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'Geev',
          gestureEnabled: false, // Pas de retour depuis l'accueil
        }}
      />
      <Stack.Screen 
        name="ItemDetail" 
        component={ItemDetailScreen}
        options={{ 
          title: 'Détail de l\'objet',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="Map" 
        component={MapScreen}
        options={{ title: 'Carte' }}
      />
      <Stack.Screen 
        name="AddItem" 
        component={AddItemScreen}
        options={{ 
          title: 'Donner un objet',
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen 
        name="ChatList" 
        component={ChatListScreen}
        options={{ title: 'Messages' }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={({ route }) => ({ 
          title: route.params?.itemTitle || 'Conversation',
          presentation: 'card',
        })}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: 'Mon Profil',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          title: 'Paramètres',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator; 