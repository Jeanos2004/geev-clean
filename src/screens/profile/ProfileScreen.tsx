import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProfileScreen Geev - Profil utilisateur avec statistiques et impact
 */
const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const userStats = {
    totalDons: 47,
    totalReceptions: 23,
    kg_CO2_evités: 156,
    communautéRang: 'Expert Geever',
  };

  const badges = [
    { id: 1, name: 'Premier Don', icon: 'gift', color: '#22C55E', earned: true },
    { id: 2, name: 'Écolo++', icon: 'leaf', color: '#10B981', earned: true },
    { id: 3, name: 'Partageur Pro', icon: 'people', color: '#3B82F6', earned: true },
    { id: 4, name: 'Ambassadeur', icon: 'trophy', color: '#F59E0B', earned: false },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header avec photo de profil */}
        <View className="bg-gradient-to-br from-green-500 to-blue-600 px-4 pt-4 pb-8">
          <View className="flex-row justify-between items-start mb-6">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="items-center">
            <View className="relative mb-4">
              <Image 
                source={{ 
                  uri: user?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' 
                }} 
                className="w-24 h-24 rounded-full border-4 border-white"
              />
              <View className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-2 border-white items-center justify-center">
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            </View>
            
            <Text className="text-2xl font-bold text-white mb-1">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-green-100 text-lg font-medium">
              {userStats.communautéRang}
            </Text>
            <Text className="text-green-200 text-sm">Geever depuis 245 jours</Text>
          </View>
        </View>

        {/* Statistiques principales */}
        <View className="px-4 -mt-6">
          <View className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600">{userStats.totalDons}</Text>
                <Text className="text-gray-600 text-sm">Objets donnés</Text>
              </View>
              <View className="w-px bg-gray-200" />
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-600">{userStats.totalReceptions}</Text>
                <Text className="text-gray-600 text-sm">Objets reçus</Text>
              </View>
              <View className="w-px bg-gray-200" />
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600">{userStats.kg_CO2_evités}</Text>
                <Text className="text-gray-600 text-sm">kg CO₂ évités</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Impact écologique */}
        <View className="px-4 mt-6">
          <View className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6">
            <View className="flex-row items-center mb-4">
              <Ionicons name="earth" size={32} color="white" />
              <View className="ml-4 flex-1">
                <Text className="text-xl font-bold text-white">Votre impact écologique</Text>
                <Text className="text-green-100">Bravo pour votre engagement ! 🌱</Text>
              </View>
            </View>
            
            <View className="flex-row justify-between">
              <View className="items-center">
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mb-2">
                  <Ionicons name="leaf" size={24} color="white" />
                </View>
                <Text className="text-white font-bold">12</Text>
                <Text className="text-green-100 text-xs text-center">Arbres sauvés</Text>
              </View>
              
              <View className="items-center">
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mb-2">
                  <Ionicons name="water" size={24} color="white" />
                </View>
                <Text className="text-white font-bold">2.3T</Text>
                <Text className="text-green-100 text-xs text-center">Eau économisée</Text>
              </View>
              
              <View className="items-center">
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mb-2">
                  <Ionicons name="people" size={24} color="white" />
                </View>
                <Text className="text-white font-bold">89</Text>
                <Text className="text-green-100 text-xs text-center">Geevers aidés</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Badges */}
        <View className="px-4 mt-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Mes badges</Text>
          <View className="flex-row flex-wrap">
            {badges.map((badge) => (
              <View
                key={badge.id}
                className={`w-20 items-center mr-4 mb-4 p-3 rounded-xl ${
                  badge.earned ? 'bg-white shadow-sm border border-gray-200' : 'bg-gray-100'
                }`}
              >
                <View 
                  className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
                    badge.earned ? '' : 'opacity-30'
                  }`}
                  style={{ backgroundColor: badge.earned ? badge.color : '#D1D5DB' }}
                >
                  <Ionicons name={badge.icon as any} size={24} color="white" />
                </View>
                <Text className={`text-xs text-center font-medium ${
                  badge.earned ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {badge.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View className="px-4 mt-8 mb-8">
          <TouchableOpacity
            onPress={() => Alert.alert('Paramètres', 'Fonctionnalité en développement')}
            className="bg-white rounded-xl p-4 mb-3 border border-gray-200 shadow-sm flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <Ionicons name="settings-outline" size={24} color="#6B7280" />
              <Text className="text-gray-800 font-medium ml-3">Paramètres</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 rounded-xl p-4 border border-red-200 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              <Text className="text-red-600 font-medium ml-3">Déconnexion</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Message final */}
        <View className="bg-gradient-to-r from-green-500 to-blue-500 mx-4 rounded-xl p-6 mb-8">
          <View className="items-center">
            <Ionicons name="heart" size={40} color="white" />
            <Text className="text-white font-bold text-lg text-center mt-3">
              Merci d'être un Geever !
            </Text>
            <Text className="text-green-100 text-center mt-2">
              Ensemble, nous construisons un monde plus durable 🌍✨
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen; 