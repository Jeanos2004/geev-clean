import React from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface BottomTabBarProps {
  currentRoute?: string;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ currentRoute }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const currentRouteName = currentRoute || route.name;

  const tabs = [
    {
      name: 'Home',
      label: 'Accueil',
      icon: 'home-outline',
      activeIcon: 'home',
      color: '#22C55E',
      route: 'Home'
    },
    {
      name: 'Map',
      label: 'Carte',
      icon: 'map-outline',
      activeIcon: 'map',
      color: '#3B82F6',
      route: 'Map'
    },
    {
      name: 'AddItem',
      label: 'Donner',
      icon: 'add',
      activeIcon: 'add',
      color: '#FFFFFF',
      route: 'AddItem',
      isCenter: true
    },
    {
      name: 'ChatList',
      label: 'Messages',
      icon: 'chatbubbles-outline',
      activeIcon: 'chatbubbles',
      color: '#F59E0B',
      route: 'ChatList',
      badge: 3
    },
    {
      name: 'Profile',
      label: 'Profil',
      icon: 'person-outline',
      activeIcon: 'person',
      color: '#8B5CF6',
      route: 'Profile'
    }
  ];

  const handleTabPress = (tab: typeof tabs[0]) => {
    if (currentRouteName !== tab.route) {
      (navigation as any).navigate(tab.route);
    }
  };

  return (
    <View className="absolute left-0 right-0" style={{ bottom: 0 }}>
      <View 
        className="bg-white border-t border-gray-200"
        style={{ 
          paddingBottom: insets.bottom + 8,
          paddingTop: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10
        }}
      >
        <View className="flex-row justify-around items-center">
          {tabs.map((tab) => {
            const isActive = currentRouteName === tab.route;
            const isCenter = tab.isCenter;
            
            return (
              <TouchableOpacity
                key={tab.name}
                onPress={() => handleTabPress(tab)}
                className={`items-center justify-center ${
                  isCenter 
                    ? 'bg-green-500 rounded-2xl shadow-lg' 
                    : ''
                }`}
                style={{
                  width: isCenter ? 56 : 50,
                  height: isCenter ? 56 : 50,
                  marginTop: isCenter ? -8 : 0,
                }}
              >
                {tab.badge && tab.badge > 0 && (
                  <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center z-10">
                    <Text className="text-white text-xs font-bold">
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </Text>
                  </View>
                )}

                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={isCenter ? 28 : 24}
                  color={
                    isCenter 
                      ? '#FFFFFF'
                      : isActive 
                        ? tab.color 
                        : '#9CA3AF'
                  }
                />

                <Text
                  className={`text-xs font-medium mt-1`}
                  style={{
                    fontSize: width * 0.028,
                    color: isCenter 
                      ? '#FFFFFF'
                      : isActive 
                        ? tab.color 
                        : '#9CA3AF'
                  }}
                >
                  {tab.label}
                </Text>

                {isActive && !isCenter && (
                  <View
                    className="absolute -bottom-2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: tab.color }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default BottomTabBar;
