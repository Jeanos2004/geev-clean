import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useAuth } from '../../contexts/AuthContext';
import { useItems } from '../../contexts/ItemsContext';
import { CategoryType, Item } from '../../types/item';
import { HomeStackParamList } from '../../navigation/AppNavigator';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

/**
 * Écran d'accueil Geev - Interface de don d'objets entre particuliers
 * Design moderne inspiré de l'application Geev officielle
 */
export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, logout } = useAuth();
  const { filteredItems: items, isLoading: loading, refreshItems, searchItems, filterByCategory } = useItems();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Catégories Geev avec leurs icônes et couleurs
  const categories = [
    { id: 'all' as const, label: 'Tout', icon: 'apps-outline', color: '#22C55E' },
    { id: CategoryType.FURNITURE, label: 'Meubles', icon: 'bed-outline', color: '#3B82F6' },
    { id: CategoryType.ELECTRONICS, label: 'Électronique', icon: 'phone-portrait-outline', color: '#8B5CF6' },
    { id: CategoryType.CLOTHING, label: 'Mode', icon: 'shirt-outline', color: '#EC4899' },
    { id: CategoryType.BOOKS, label: 'Livres', icon: 'book-outline', color: '#F59E0B' },
    { id: CategoryType.SPORTS, label: 'Sport', icon: 'football-outline', color: '#EF4444' },
    { id: CategoryType.TOYS_GAMES, label: 'Jouets', icon: 'game-controller-outline', color: '#10B981' },
    { id: CategoryType.OTHER, label: 'Autre', icon: 'ellipsis-horizontal', color: '#6B7280' },
  ];

  // Charger les objets au montage
  useEffect(() => {
    refreshItems();
  }, []);

  // Gérer le rafraîchissement
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshItems();
    setRefreshing(false);
  }, [refreshItems]);

  // Gérer la recherche
  const handleSearch = useCallback(async () => {
    if (searchQuery.trim()) {
      await searchItems(searchQuery);
    } else {
      await refreshItems();
    }
  }, [searchQuery, searchItems, refreshItems]);

  // Gérer le changement de catégorie
  const handleCategoryChange = useCallback(async (category: CategoryType | 'all') => {
    setSelectedCategory(category);
    if (category === 'all') {
      await refreshItems();
    } else {
      await filterByCategory(category);
    }
  }, [filterByCategory, refreshItems]);

  // Naviguer vers le détail d'un objet
  const handleItemPress = (item: Item) => {
    navigation.navigate('ItemDetail', { itemId: item.id });
  };

  // Formater la distance
  const formatDistance = (distance?: number) => {
    if (!distance) return 'Distance inconnue';
    return distance < 1 
      ? `${Math.round(distance * 1000)}m`
      : `${distance.toFixed(1)}km`;
  };

  // Formater la condition
  const formatCondition = (condition: string) => {
    const conditions = {
      'new': 'Neuf',
      'like_new': 'Comme neuf',
      'good': 'Bon état',
      'fair': 'État correct',
      'poor': 'Mauvais état'
    };
    return conditions[condition as keyof typeof conditions] || condition;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Geev Style */}
        <View className="bg-gradient-to-r from-green-500 to-green-600 px-4 pt-4 pb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-3">
                <Ionicons name="person" size={24} color="#22C55E" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-white">
                  Salut {user?.firstName} ! 👋
                </Text>
                <Text className="text-sm text-green-100">
                  Découvrez des objets gratuits près de chez vous
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => Alert.alert('Profil', 'Accéder au profil')}
              className="p-2"
            >
              <Ionicons name="person-circle-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Barre de recherche Geev */}
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
            <Ionicons name="search-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-800"
              placeholder="Que cherchez-vous ?"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2">
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Stats Geev */}
        <View className="flex-row justify-around py-6 bg-gray-50">
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-600">{items.length}</Text>
            <Text className="text-sm text-gray-600">Objets disponibles</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-600">6M</Text>
            <Text className="text-sm text-gray-600">Geevers</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-orange-600">341k</Text>
            <Text className="text-sm text-gray-600">Tonnes CO₂ évitées</Text>
          </View>
        </View>

        {/* Catégories horizontales */}
        <View className="py-4">
          <Text className="text-lg font-bold text-gray-800 px-4 mb-3">Catégories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryChange(category.id)}
                className={`items-center mr-4 px-3 py-2 rounded-xl min-w-[80px] ${
                  selectedCategory === category.id 
                    ? 'bg-green-500' 
                    : 'bg-gray-100'
                }`}
                style={{
                  backgroundColor: selectedCategory === category.id ? category.color : '#F3F4F6'
                }}
              >
                <View className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
                  selectedCategory === category.id ? 'bg-white/20' : 'bg-white'
                }`}>
                  <Ionicons 
                    name={category.icon as any} 
                    size={24} 
                    color={selectedCategory === category.id ? 'white' : category.color} 
                  />
                </View>
                <Text className={`text-xs font-medium text-center ${
                  selectedCategory === category.id ? 'text-white' : 'text-gray-700'
                }`}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Actions rapides */}
        <View className="px-4 py-2 mb-4">
          <View className="flex-row space-x-3">
            <TouchableOpacity className="flex-1 bg-green-500 rounded-xl p-4 flex-row items-center justify-center">
              <Ionicons name="add-circle-outline" size={24} color="white" />
              <Text className="text-white font-semibold ml-2">Donner</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-blue-500 rounded-xl p-4 flex-row items-center justify-center">
              <Ionicons name="map-outline" size={24} color="white" />
              <Text className="text-white font-semibold ml-2">Carte</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Liste des objets */}
        <View className="px-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Objets près de chez vous
            </Text>
            <TouchableOpacity>
              <Text className="text-green-600 font-medium">Voir tout</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View className="items-center py-8">
              <Text className="text-gray-500">Chargement...</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleItemPress(item)}
                  className="w-[48%] bg-white rounded-xl mb-4 shadow-sm"
                  style={{ elevation: 2 }}
                >
                  {/* Image de l'objet */}
                  <View className="relative">
                    <Image 
                      source={{ uri: item.images?.[0] }} 
                      className="w-full h-32 rounded-t-xl"
                      resizeMode="cover"
                    />
                    {/* Badge gratuit */}
                    <View className="absolute top-2 left-2 bg-green-500 rounded-full px-2 py-1">
                      <Text className="text-white text-xs font-bold">GRATUIT</Text>
                    </View>
                    {/* Distance */}
                    <View className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-1">
                      <Text className="text-white text-xs">{formatDistance(item.distance)}</Text>
                    </View>
                  </View>

                  {/* Informations de l'objet */}
                  <View className="p-3">
                    <Text className="font-semibold text-gray-800 text-sm mb-1" numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text className="text-gray-600 text-xs mb-2" numberOfLines={1}>
                      {typeof item.location === 'object' ? item.location.city : item.location}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-green-600 text-xs font-medium">
                        {formatCondition(item.condition)}
                      </Text>
                      <View className="flex-row items-center">
                        <Ionicons name="heart-outline" size={16} color="#EF4444" />
                        <Text className="text-gray-500 text-xs ml-1">
                          {Math.floor(Math.random() * 20) + 1}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Footer avec message communautaire */}
        <View className="bg-gradient-to-r from-green-500 to-blue-500 mx-4 rounded-xl p-6 my-6">
          <View className="items-center">
            <Ionicons name="leaf-outline" size={48} color="white" />
            <Text className="text-white font-bold text-lg text-center mt-3">
              Ensemble, luttons contre le gaspillage !
            </Text>
            <Text className="text-green-100 text-center mt-2 text-sm">
              Chaque objet donné participe à l'économie circulaire et aide la planète 🌍
            </Text>
          </View>
        </View>

        {/* Espacement en bas */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
} 