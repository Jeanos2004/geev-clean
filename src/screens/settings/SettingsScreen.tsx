import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import BottomTabBar from '../../components/common/BottomTabBar';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: logout }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">Paramètres</Text>
            <Text className="text-green-100 text-sm">Personnalisez Geev</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons name="person-outline" size={24} color="#6B7280" />
            <Text className="text-gray-800 font-medium ml-3 flex-1">Profil</Text>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center py-3 border-t border-gray-100">
            <Ionicons name="notifications-outline" size={24} color="#6B7280" />
            <Text className="text-gray-800 font-medium ml-3 flex-1">Notifications</Text>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center py-3 border-t border-gray-100">
            <Ionicons name="shield-outline" size={24} color="#6B7280" />
            <Text className="text-gray-800 font-medium ml-3 flex-1">Confidentialité</Text>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons name="help-circle-outline" size={24} color="#6B7280" />
            <Text className="text-gray-800 font-medium ml-3 flex-1">Aide</Text>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center py-3 border-t border-gray-100">
            <Ionicons name="star-outline" size={24} color="#6B7280" />
            <Text className="text-gray-800 font-medium ml-3 flex-1">Noter l'app</Text>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-xl p-4 mb-24 shadow-sm">
          <TouchableOpacity 
            onPress={handleLogout}
            className="flex-row items-center py-3"
          >
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <Text className="text-red-600 font-medium ml-3 flex-1">Déconnexion</Text>
            <Ionicons name="chevron-forward" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomTabBar currentRoute="Settings" />
    </SafeAreaView>
  );
};

export default SettingsScreen;
