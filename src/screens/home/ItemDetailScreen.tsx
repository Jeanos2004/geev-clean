import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useItems } from '../../contexts/ItemsContext';
import { useAuth } from '../../contexts/AuthContext';
import { Item } from '../../types/item';
import Button from '../../components/common/Button';
import { formatDistanceFromNow, formatDistance } from '../../utils/helpers';

type ItemDetailRouteProp = RouteProp<{ ItemDetail: { itemId: string } }, 'ItemDetail'>;

const { width: screenWidth } = Dimensions.get('window');

/**
 * Écran de détail d'un objet avec toutes les informations et actions possibles
 */
const ItemDetailScreen: React.FC = () => {
  const route = useRoute<ItemDetailRouteProp>();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { items, favoriteItem, unfavoriteItem, userFavorites } = useItems();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [item, setItem] = useState<Item | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const itemId = route.params?.itemId;

  useEffect(() => {
    // Trouver l'objet dans les données
    const foundItem = items.find(i => i.id === itemId);
    if (foundItem) {
      setItem(foundItem);
      setIsFavorite(userFavorites.includes(foundItem.id));
    }
  }, [itemId, items, userFavorites]);

  const handleFavoriteToggle = async () => {
    if (!item || !user) return;
    
    try {
      if (isFavorite) {
        await unfavoriteItem(item.id);
        setIsFavorite(false);
      } else {
        await favoriteItem(item.id);
        setIsFavorite(true);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier les favoris');
    }
  };

  const handleContactSeller = () => {
    if (!item || !user) return;
    
    if (item.seller.id === user.id) {
      Alert.alert('Information', 'Vous ne pouvez pas vous contacter vous-même');
      return;
    }

    // Navigation vers le chat avec ce vendeur
    navigation.navigate('Chat' as never, { 
      sellerId: item.seller.id, 
      itemId: item.id 
    } as never);
  };

  const handleReportItem = () => {
    Alert.alert(
      'Signaler cet objet',
      'Pourquoi voulez-vous signaler cet objet ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Contenu inapproprié', onPress: () => reportItem('inappropriate') },
        { text: 'Spam ou arnaque', onPress: () => reportItem('spam') },
        { text: 'Objet déjà vendu', onPress: () => reportItem('sold') },
      ]
    );
  };

  const reportItem = (reason: string) => {
    // Simulation du signalement
    Alert.alert('Merci', 'Votre signalement a été pris en compte');
  };

  const handleShare = () => {
    const shareUrl = `https://geev.com/items/${itemId}`;
    Alert.alert(
      'Partager',
      `Partager cet objet :\n${shareUrl}`,
      [
        { text: 'Copier le lien', onPress: () => copyToClipboard(shareUrl) },
        { text: 'Fermer', style: 'cancel' }
      ]
    );
  };

  const copyToClipboard = (text: string) => {
    // Simulation de copie dans le presse-papier
    Alert.alert('Copié', 'Lien copié dans le presse-papier');
  };

  const handleImageScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    setCurrentImageIndex(index);
  };

  if (!item) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Objet non trouvé</Text>
          <Button
            title="Retour"
            onPress={() => navigation.goBack()}
            className="mt-4"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header avec boutons de navigation */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full bg-gray-100"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={handleFavoriteToggle}
            className="p-2 rounded-full bg-gray-100"
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#EF4444" : "#374151"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleShare}
            className="p-2 rounded-full bg-gray-100"
          >
            <Ionicons name="share-outline" size={24} color="#374151" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleReportItem}
            className="p-2 rounded-full bg-gray-100"
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Carrousel d'images */}
        <View className="relative">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={16}
          >
            {item.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                className="w-screen h-80"
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          
          {/* Indicateur d'images */}
          {item.images.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center space-x-2">
              {item.images.map((_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </View>
          )}
          
          {/* Badge de condition */}
          <View className="absolute top-4 left-4">
            <View className="bg-black/70 rounded-full px-3 py-1">
              <Text className="text-white text-sm font-medium">
                {item.condition === 'new' ? 'Neuf' :
                 item.condition === 'very_good' ? 'Très bon état' :
                 item.condition === 'good' ? 'Bon état' :
                 item.condition === 'fair' ? 'État correct' : 'À réparer'}
              </Text>
            </View>
          </View>
        </View>

        {/* Informations principales */}
        <View className="p-4">
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                {item.title}
              </Text>
              <View className="flex-row items-center mb-2">
                <Ionicons name="location-outline" size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-1">
                  {formatDistance(item.distance)} • {item.location.city}
                </Text>
              </View>
              <Text className="text-gray-500 text-sm">
                Publié {formatDistanceFromNow(item.createdAt)}
              </Text>
            </View>
            
            <View className="bg-green-100 rounded-lg px-3 py-2">
              <Text className="text-green-800 font-semibold text-lg">
                Gratuit
              </Text>
            </View>
          </View>

          {/* Catégorie */}
          <View className="bg-gray-100 rounded-lg p-3 mb-4">
            <Text className="text-gray-700 font-medium">
              Catégorie : {item.categoryName}
            </Text>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Description
            </Text>
            <Text className="text-gray-700 leading-6">
              {item.description}
            </Text>
          </View>

          {/* Informations du vendeur */}
          <View className="border-t border-gray-200 pt-4 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Proposé par
            </Text>
            <View className="flex-row items-center">
              <Image
                source={{ uri: item.seller.avatar }}
                className="w-12 h-12 rounded-full mr-3"
              />
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">
                  {item.seller.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <View className="flex-row items-center mr-4">
                    <Ionicons name="star" size={16} color="#F59E0B" />
                    <Text className="text-gray-600 ml-1">
                      {item.seller.rating.toFixed(1)} ({item.seller.reviewCount} avis)
                    </Text>
                  </View>
                  <Text className="text-gray-500 text-sm">
                    {item.seller.memberSince}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Boutons d'action flottants */}
      {item.seller.id !== user?.id && (
        <View className="p-4 border-t border-gray-200 bg-white">
          <Button
            title="Contacter le donneur"
            onPress={handleContactSeller}
            variant="primary"
            icon={<Ionicons name="chatbubble-outline" size={20} color="white" />}
            className="mb-3"
          />
          <Button
            title="Voir le profil"
            onPress={() => navigation.navigate('Profile' as never, { userId: item.seller.id } as never)}
            variant="outline"
            icon={<Ionicons name="person-outline" size={20} color="#059669" />}
          />
        </View>
      )}
      
      {/* Message si c'est son propre objet */}
      {item.seller.id === user?.id && (
        <View className="p-4 border-t border-gray-200 bg-white">
          <View className="bg-blue-50 rounded-lg p-4 mb-3">
            <Text className="text-blue-800 text-center font-medium">
              C'est votre objet
            </Text>
          </View>
          <Button
            title="Modifier l'annonce"
            onPress={() => navigation.navigate('AddItem' as never, { editItem: item } as never)}
            variant="outline"
            icon={<Ionicons name="create-outline" size={20} color="#059669" />}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ItemDetailScreen; 