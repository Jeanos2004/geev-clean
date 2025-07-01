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

/**
 * Écran d'accueil principal avec le feed des objets disponibles
 * Fonctionnalités : recherche, filtres par catégorie, affichage des objets
 */
export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, logout } = useAuth();
  const { filteredItems: items, isLoading: loading, refreshItems, searchItems, filterByCategory } = useItems();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Catégories disponibles avec leurs icônes
  const categories = [
    { id: 'all' as const, label: 'Tout', icon: 'grid-outline' },
    { id: CategoryType.ELECTRONICS, label: 'Électronique', icon: 'phone-portrait-outline' },
    { id: CategoryType.FURNITURE, label: 'Mobilier', icon: 'bed-outline' },
    { id: CategoryType.CLOTHING, label: 'Vêtements', icon: 'shirt-outline' },
    { id: CategoryType.BOOKS, label: 'Livres', icon: 'book-outline' },
    { id: CategoryType.SPORTS, label: 'Sport', icon: 'football-outline' },
    { id: CategoryType.TOYS_GAMES, label: 'Jouets', icon: 'game-controller-outline' },
    { id: CategoryType.OTHER, label: 'Autre', icon: 'ellipsis-horizontal' },
  ];

  // Charger les objets au montage du composant
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

  // Gérer la déconnexion
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
    <SafeAreaView className="flex-1 bg-background">
      {/* En-tête avec profil utilisateur */}
      <View className="flex-row justify-between items-center p-4 bg-card border-b border-border">
        <View className="flex-row items-center flex-1">
          <Image 
            source={{ uri: user?.profilePicture }} 
            className="w-12 h-12 rounded-full"
          />
          <View className="ml-3 flex-1">
            <Text className="text-lg font-semibold text-foreground">
              Bonjour {user?.firstName}! 👋
            </Text>
            <Text className="text-xs text-muted-foreground mt-1">
              Email: {user?.email}{'\n'}
              Vérifié: {user?.verified ? 'Oui' : 'Non'}{'\n'}
              Membre depuis: {
                user?.createdAt instanceof Date 
                  ? user.createdAt.toLocaleDateString('fr-FR')
                  : user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('fr-FR')
                    : 'Date inconnue'
              }
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} className="p-2">
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      <View className="flex-row p-4 bg-card items-center">
        <View className="flex-1 flex-row items-center bg-input rounded-xl px-3 py-2.5 mr-3">
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-base text-foreground"
            placeholder="Rechercher un objet..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={handleSearch} className="bg-primary rounded-xl p-3">
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filtres par catégorie */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        className="bg-card"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => handleCategoryChange(category.id)}
            className={`flex-row items-center rounded-full px-4 py-2 mr-2 w-auto h-10 ${
              selectedCategory === category.id 
                ? 'bg-primary' 
                : 'bg-muted'
            }`}
          >
            <Ionicons 
              name={category.icon as any} 
              size={20} 
              color={selectedCategory === category.id ? 'white' : '#6B7280'} 
            />
            <Text className={`ml-1.5 text-sm font-medium ${
              selectedCategory === category.id 
                ? 'text-primary-foreground' 
                : 'text-muted-foreground'
            }`}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Liste des objets */}
      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text className="text-center text-base text-muted-foreground mt-8">Chargement...</Text>
        ) : items.length === 0 ? (
          <View className="items-center justify-center py-16">
            <Ionicons name="gift-outline" size={64} color="#D1D5DB" />
            <Text className="text-xl font-semibold text-foreground mt-4">
              Aucun objet trouvé
            </Text>
            <Text className="text-sm text-muted-foreground mt-2 text-center">
              Essayez de modifier vos critères de recherche
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleItemPress(item)}
                className="w-[48%] bg-card rounded-xl mb-4 border border-border"
                style={{ elevation: 2 }}
              >
                <Image 
                  source={{ uri: item.images[0] }} 
                  className="w-full h-32 rounded-t-xl"
                />
                <View className="p-3">
                  <Text className="text-sm font-semibold text-card-foreground mb-1" numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text className="text-xs text-secondary font-medium mb-2">
                    {formatCondition(item.condition)}
                  </Text>
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="location-outline" size={14} color="#6B7280" />
                    <Text className="text-xs text-muted-foreground ml-1">
                      {formatDistance(item.location.distance)} • {item.location.city}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Image 
                      source={{ uri: item.owner.profilePicture }} 
                      className="w-5 h-5 rounded-full"
                    />
                    <Text className="text-xs text-muted-foreground ml-1.5 flex-1">
                      {item.owner.firstName}
                    </Text>
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={12} color="#FCD34D" />
                      <Text className="text-xs text-muted-foreground ml-0.5">{item.owner.rating}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 