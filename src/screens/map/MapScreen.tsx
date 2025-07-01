import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useItems } from '../../contexts/ItemsContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';

/**
 * Écran de carte avec les objets géolocalisés
 */
const MapScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { items, isLoading } = useItems();
  
  const [selectedRadius, setSelectedRadius] = useState(10); // 10km par défaut
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Simuler des objets proches
  const nearbyItems = items.slice(0, 5);

  const handleLocationPermission = () => {
    Alert.alert(
      'Géolocalisation',
      'Pour afficher la carte interactive, nous avons besoin d\'accéder à votre position. Fonctionnalité en cours de développement.',
      [
        { text: 'Plus tard', style: 'cancel' },
        { text: 'Activer', onPress: () => {
          Alert.alert('Activé', 'Géolocalisation simulée activée !');
        }}
      ]
    );
  };

  const handleViewItem = (itemId: string) => {
    navigation.navigate('ItemDetail' as never, { itemId } as never);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-900">
            🗺️ Carte des objets
          </Text>
          <TouchableOpacity
            onPress={handleLocationPermission}
            className="p-2 rounded-full bg-green-100"
          >
            <Ionicons name="location" size={24} color="#059669" />
          </TouchableOpacity>
        </View>

        {/* Sélecteur de rayon */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Rayon de recherche
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[5, 10, 20, 50].map((radius) => (
              <TouchableOpacity
                key={radius}
                onPress={() => setSelectedRadius(radius)}
                className={`mr-3 px-4 py-2 rounded-full border-2 ${
                  selectedRadius === radius
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedRadius === radius ? 'text-green-700' : 'text-gray-700'
                  }`}
                >
                  {radius} km
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Toggle vue */}
        <View className="flex-row bg-gray-100 rounded-lg p-1">
          <TouchableOpacity
            onPress={() => setViewMode('list')}
            className={`flex-1 py-2 rounded-md ${
              viewMode === 'list' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-center text-sm font-medium ${
                viewMode === 'list' ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              📋 Liste
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode('map')}
            className={`flex-1 py-2 rounded-md ${
              viewMode === 'map' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-center text-sm font-medium ${
                viewMode === 'map' ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              🗺️ Carte
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenu principal */}
      <View className="flex-1">
        {viewMode === 'map' ? (
          // Vue carte (temporaire)
          <View className="flex-1 justify-center items-center bg-gray-50 m-4 rounded-lg border-2 border-dashed border-gray-300">
            <Ionicons name="map" size={64} color="#9CA3AF" />
            <Text className="text-lg font-semibold text-gray-600 mt-4 mb-2">
              Carte interactive
            </Text>
            <Text className="text-gray-500 text-center px-8 mb-4">
              La carte interactive avec les objets géolocalisés sera développée dans les prochaines étapes.
            </Text>
            <Button
              title="Activer la géolocalisation"
              onPress={handleLocationPermission}
              variant="outline"
              icon={<Ionicons name="location-outline" size={20} color="#059669" />}
            />
          </View>
        ) : (
          // Vue liste
          <ScrollView className="flex-1 p-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Objets proches de vous ({nearbyItems.length})
            </Text>

            {nearbyItems.length === 0 ? (
              <View className="flex-1 justify-center items-center py-12">
                <Ionicons name="location-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 text-center mt-4">
                  Aucun objet trouvé dans un rayon de {selectedRadius} km
                </Text>
              </View>
            ) : (
              <View className="space-y-4">
                {nearbyItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleViewItem(item.id)}
                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="text-lg font-semibold text-gray-900 flex-1 mr-3">
                        {item.title}
                      </Text>
                      <View className="bg-green-100 rounded-full px-2 py-1">
                        <Text className="text-green-800 text-xs font-medium">
                          Gratuit
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center mb-2">
                      <Ionicons name="location-outline" size={16} color="#6B7280" />
                      <Text className="text-gray-600 text-sm mt-1">
                        {item.distance ? `${item.distance.toFixed(1)} km` : 'Distance inconnue'} • {item.location.city}
                      </Text>
                    </View>

                    <Text className="text-gray-700 text-sm mb-3" numberOfLines={2}>
                      {item.description}
                    </Text>

                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center">
                        <Text className="text-sm text-gray-500">
                          {item.categoryName}
                        </Text>
                        <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                        <Text className="text-sm text-gray-500">
                          {item.condition === 'new' ? 'Neuf' :
                           item.condition === 'very_good' ? 'Très bon' :
                           item.condition === 'good' ? 'Bon état' :
                           item.condition === 'fair' ? 'Correct' : 'À réparer'}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center">
                        <Ionicons name="eye-outline" size={16} color="#6B7280" />
                        <Text className="text-gray-500 text-sm ml-1">
                          {item.viewCount}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Section conseils */}
            <View className="bg-blue-50 rounded-lg p-4 mt-6">
              <Text className="text-blue-900 font-semibold mb-2">
                💡 Conseils pour trouver des objets
              </Text>
              <Text className="text-blue-800 text-sm leading-5">
                • Élargissez votre rayon de recherche pour plus de résultats{'\n'}
                • Activez les notifications pour être alerté des nouveaux objets{'\n'}
                • Contactez rapidement les donneurs pour les objets qui vous intéressent
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MapScreen; 