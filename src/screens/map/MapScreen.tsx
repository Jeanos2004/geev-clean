import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Image,
  Dimensions,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useItems } from '../../contexts/ItemsContext';
import { CategoryType, Item } from '../../types/item';

const { width, height } = Dimensions.get('window');

/**
 * Écran de carte Geev - Interface moderne de géolocalisation
 * Affichage des objets sur une carte interactive
 */
const MapScreen: React.FC = () => {
  const navigation = useNavigation();
  const { items } = useItems();
  
  const [selectedRadius, setSelectedRadius] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Simuler des objets géolocalisés avec distance
  const nearbyItems = items.slice(0, 8).map((item, index) => ({
    ...item,
    distance: (item as any).distance || Math.random() * selectedRadius,
  }));

  const formatDistance = (distance?: number) => {
    if (!distance) return '< 1km';
    return distance < 1 
      ? `${Math.round(distance * 1000)}m`
      : `${distance.toFixed(1)}km`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Geev */}
      <View className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-4">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">Carte des objets</Text>
            <Text className="text-green-100 text-sm">
              {nearbyItems.length} objets dans un rayon de {selectedRadius}km
            </Text>
          </View>

          <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <Ionicons name="options-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Barre de recherche */}
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3">
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-800"
            placeholder="Rechercher sur la carte..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Rayon de recherche */}
      <View className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 5, 10, 20].map((radius) => (
            <TouchableOpacity
              key={radius}
              onPress={() => setSelectedRadius(radius)}
              className={`mr-3 px-4 py-2 rounded-full ${
                selectedRadius === radius ? 'bg-green-500' : 'bg-white border border-gray-300'
              }`}
            >
              <Text className={`text-sm font-medium ${
                selectedRadius === radius ? 'text-white' : 'text-gray-700'
              }`}>
                {radius}km
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Zone de carte simulée */}
      <View className="flex-1 relative">
        <View className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 relative">
          {/* Grille de carte */}
          <View className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={i}
                className="absolute border border-gray-200"
                style={{
                  left: (i % 5) * (width / 5),
                  top: Math.floor(i / 5) * (height / 8),
                  width: width / 5,
                  height: height / 8,
                }}
              />
            ))}
          </View>

          {/* Position utilisateur */}
          <View
            className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white"
            style={{ left: width / 2 - 8, top: height / 3 }}
          >
            <View className="absolute -inset-2 bg-blue-300 rounded-full opacity-30" />
          </View>

          {/* Pins des objets */}
          {nearbyItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelectedItem(item)}
              className="absolute"
              style={{
                left: width / 2 + (index % 3 - 1) * 80 + (Math.random() - 0.5) * 100,
                top: height / 3 + Math.floor(index / 3) * 60 + (Math.random() - 0.5) * 80,
              }}
            >
              <View className="items-center">
                <View className="w-8 h-8 bg-green-500 rounded-full border-2 border-white items-center justify-center shadow-lg">
                  <Text className="text-white text-xs font-bold">
                    {item.title.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-green-500" />
              </View>
            </TouchableOpacity>
          ))}

          {/* Zone de recherche circulaire */}
          <View
            className="absolute border-2 border-green-400 border-dashed rounded-full opacity-30"
            style={{
              left: width / 2 - (selectedRadius * 20),
              top: height / 3 - (selectedRadius * 20),
              width: selectedRadius * 40,
              height: selectedRadius * 40,
            }}
          />
        </View>

        {/* Contrôles */}
        <View className="absolute right-4 bottom-32 bg-white rounded-xl shadow-lg">
          <TouchableOpacity className="p-3 border-b border-gray-200">
            <Ionicons name="add" size={24} color="#22C55E" />
          </TouchableOpacity>
          <TouchableOpacity className="p-3">
            <Ionicons name="remove" size={24} color="#22C55E" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="absolute right-4 bottom-16 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg">
          <Ionicons name="locate" size={24} color="#22C55E" />
        </TouchableOpacity>
      </View>

      {/* Liste d'objets */}
      <View className="bg-white border-t border-gray-200" style={{ height: 110 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-3">
          {nearbyItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelectedItem(item)}
              className="bg-white rounded-xl mr-3 mb-3 border border-gray-200 shadow-sm"
              style={{ width: 150, height: 100 }}
            >
              <Image 
                source={{ uri: item.images?.[0] || 'https://via.placeholder.com/140x80' }} 
                className="w-full h-12 rounded-t-xl"
                resizeMode="cover"
              />
              <View className="p-2">
                <Text className="font-semibold text-gray-800 text-xs" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text className="text-green-600 text-xs">
                  {formatDistance((item as any).distance)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modal détail objet */}
      <Modal visible={!!selectedItem} animationType="slide" presentationStyle="pageSheet">
        {selectedItem && (
          <SafeAreaView className="flex-1 bg-white">
            <View className="p-4 border-b border-gray-200">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-bold text-gray-800">Détail de l'objet</Text>
                <TouchableOpacity
                  onPress={() => setSelectedItem(null)}
                  className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                >
                  <Ionicons name="close" size={20} color="#374151" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="flex-1 p-4">
              <Image 
                source={{ uri: selectedItem.images?.[0] || 'https://via.placeholder.com/400x200' }} 
                className="w-full h-48 rounded-xl mb-4"
                resizeMode="cover"
              />
              
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                {selectedItem.title}
              </Text>
              
              <View className="flex-row items-center mb-4">
                <Ionicons name="location-outline" size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-1">
                  {formatDistance(selectedItem.distance)} • {typeof selectedItem.location === 'object' ? selectedItem.location.city : selectedItem.location}
                </Text>
              </View>

              <Text className="text-gray-700 mb-6 text-base leading-6">
                {selectedItem.description}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ItemDetail' as never, { itemId: selectedItem.id } as never);
                  setSelectedItem(null);
                }}
                className="bg-green-500 rounded-xl p-4 flex-row items-center justify-center"
              >
                <Ionicons name="eye-outline" size={24} color="white" />
                <Text className="text-white font-bold text-lg ml-2">Voir les détails</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default MapScreen; 