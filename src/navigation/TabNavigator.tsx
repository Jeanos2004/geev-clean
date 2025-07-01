import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

// Import des écrans
import HomeScreen from '../screens/home/HomeScreen';
import ItemDetailScreen from '../screens/home/ItemDetailScreen';
import MapScreen from '../screens/map/MapScreen';
import AddItemScreen from '../screens/add/AddItemScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Types pour la navigation principale
export type MainTabParamList = {
  HomeStack: undefined;
  MapStack: undefined;
  AddStack: undefined;
  ChatStack: undefined;
  ProfileStack: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ItemDetail: { itemId: string };
};

export type MapStackParamList = {
  Map: undefined;
};

export type AddStackParamList = {
  AddItem: undefined;
};

export type ChatStackParamList = {
  ChatList: undefined;
  Chat: { conversationId: string; itemTitle?: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const MapStack = createNativeStackNavigator<MapStackParamList>();
const AddStack = createNativeStackNavigator<AddStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

/**
 * Stack Navigator pour Home
 */
const HomeStackNavigator = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: '#0EA5E9' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <HomeStack.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ title: 'Geev' }}
    />
    <HomeStack.Screen 
      name="ItemDetail" 
      component={ItemDetailScreen}
      options={{ title: 'Détail de l\'objet' }}
    />
  </HomeStack.Navigator>
);

/**
 * Stack Navigator pour Map
 */
const MapStackNavigator = () => (
  <MapStack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: '#0EA5E9' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <MapStack.Screen 
      name="Map" 
      component={MapScreen}
      options={{ title: 'Carte' }}
    />
  </MapStack.Navigator>
);

/**
 * Stack Navigator pour Add
 */
const AddStackNavigator = () => (
  <AddStack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: '#0EA5E9' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <AddStack.Screen 
      name="AddItem" 
      component={AddItemScreen}
      options={{ title: 'Ajouter un objet' }}
    />
  </AddStack.Navigator>
);

/**
 * Stack Navigator pour Chat
 */
const ChatStackNavigator = () => (
  <ChatStack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: '#0EA5E9' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <ChatStack.Screen 
      name="ChatList" 
      component={ChatListScreen}
      options={{ title: 'Messages' }}
    />
    <ChatStack.Screen 
      name="Chat" 
      component={ChatScreen}
      options={({ route }) => ({ 
        title: route.params?.itemTitle || 'Conversation' 
      })}
    />
  </ChatStack.Navigator>
);

/**
 * Stack Navigator pour Profile
 */
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: '#0EA5E9' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <ProfileStack.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: 'Profil' }}
    />
  </ProfileStack.Navigator>
);

/**
 * Badge pour les notifications
 */
const TabBarBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-5 h-5 justify-center items-center">
      <Text className="text-white text-xs font-bold">
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
};

/**
 * Navigateur principal avec tabs
 */
const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0EA5E9',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'HomeStack':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'MapStack':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'AddStack':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'ChatStack':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'ProfileStack':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          const iconElement = <Ionicons name={iconName} size={size} color={color} />;
          
          // Badge pour les messages non lus (simulation)
          if (route.name === 'ChatStack') {
            return (
              <View>
                {iconElement}
                <TabBarBadge count={2} />
              </View>
            );
          }

          return iconElement;
        },
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          title: 'Accueil',
        }}
      />
      <Tab.Screen
        name="MapStack"
        component={MapStackNavigator}
        options={{
          title: 'Carte',
        }}
      />
      <Tab.Screen
        name="AddStack"
        component={AddStackNavigator}
        options={{
          title: 'Ajouter',
        }}
      />
      <Tab.Screen
        name="ChatStack"
        component={ChatStackNavigator}
        options={{
          title: 'Messages',
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          title: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator; 