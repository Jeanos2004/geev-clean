import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useItems } from '../../contexts/ItemsContext';
import { useAuth } from '../../contexts/AuthContext';
import { Item, CategoryType, ItemCondition, CreateItemData } from '../../types/item';

type AddItemRouteProp = RouteProp<{ AddItem: { editItem?: Item } }, 'AddItem'>;

const { width } = Dimensions.get('window');

/**
 * Écran d'ajout d'objet Geev - Design moderne et inspirant
 * Interface simplifiée pour encourager le don
 */
const AddItemScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<AddItemRouteProp>();
  const { user } = useAuth();
  const { createItem, updateItem } = useItems();
  
  // État du formulaire
  const [formData, setFormData] = useState<CreateItemData>({
    title: '',
    description: '',
    category: CategoryType.OTHER,
    condition: ItemCondition.GOOD,
    images: [],
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      address: '',
      city: 'Paris',
      zipCode: '75001'
    },
    dimensions: undefined,
    pickup: {
      flexible: true,
      availableDays: [],
      timeSlots: [],
      instructions: ''
    },
    tags: [],
    isUrgent: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const editItem = route.params?.editItem;
  const isEditMode = !!editItem;

  // Catégories Geev avec couleurs
  const categories = [
    { id: CategoryType.FURNITURE, label: 'Meubles', icon: 'bed-outline', color: '#3B82F6' },
    { id: CategoryType.ELECTRONICS, label: 'Électronique', icon: 'phone-portrait-outline', color: '#8B5CF6' },
    { id: CategoryType.CLOTHING, label: 'Mode', icon: 'shirt-outline', color: '#EC4899' },
    { id: CategoryType.BOOKS, label: 'Livres', icon: 'book-outline', color: '#F59E0B' },
    { id: CategoryType.SPORTS, label: 'Sport', icon: 'football-outline', color: '#EF4444' },
    { id: CategoryType.TOYS_GAMES, label: 'Jouets', icon: 'game-controller-outline', color: '#10B981' },
    { id: CategoryType.OTHER, label: 'Autre', icon: 'ellipsis-horizontal', color: '#6B7280' },
  ];

  // États des objets
  const conditions = [
    { id: ItemCondition.NEW, label: 'Neuf', icon: 'sparkles', color: '#22C55E' },
    { id: ItemCondition.LIKE_NEW, label: 'Comme neuf', icon: 'star', color: '#3B82F6' },
    { id: ItemCondition.GOOD, label: 'Bon état', icon: 'checkmark-circle', color: '#F59E0B' },
    { id: ItemCondition.FAIR, label: 'État correct', icon: 'remove-circle', color: '#EF4444' },
    { id: ItemCondition.POOR, label: 'Usé', icon: 'warning', color: '#6B7280' },
  ];

  const updateFormData = (field: keyof CreateItemData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPhotos = () => {
    Alert.alert(
      'Ajouter des photos',
      'Ajoutez jusqu\'à 5 photos pour attirer plus de Geevers !',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Ajouter', 
          onPress: () => {
            // Simulation d'ajout de photos
            const newImages = [
              'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
              'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'
            ];
            updateFormData('images', newImages);
          }
        }
      ]
    );
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Attention', 'Veuillez saisir un titre pour votre objet');
      return;
    }
    
    if (!formData.description.trim()) {
      Alert.alert('Attention', 'Veuillez ajouter une description');
      return;
    }

    setIsLoading(true);
    try {
      const itemData = {
        ...formData,
        location: {
          ...formData.location,
          address: formData.location.address || 'Paris, France'
        }
      };

      if (isEditMode && editItem) {
        await updateItem(editItem.id, itemData);
        Alert.alert('Succès! 🎉', 'Votre objet a été modifié avec succès !', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await createItem(itemData);
        Alert.alert('Félicitations! 🎉', 'Votre objet a été publié avec succès !\n\nVous venez de faire un geste pour la planète! 🌍', [
          { text: 'Super!', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Oups!', 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);
  const selectedCondition = conditions.find(cond => cond.id === formData.condition);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Geev */}
      <View className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-4">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-white">
              {isEditMode ? 'Modifier mon objet' : 'Donner un objet'}
            </Text>
            <Text className="text-green-100 text-sm">
              Faites un geste pour la planète ! 🌍
            </Text>
          </View>
          
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Section motivation */}
        <View className="bg-gradient-to-br from-blue-50 to-green-50 p-6 mx-4 my-4 rounded-xl">
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center mr-3">
              <Ionicons name="heart" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">
                Donnez, partagez, rendez heureux !
              </Text>
              <Text className="text-gray-600 text-sm">
                La plupart des objets trouvent preneur en moins de 2h
              </Text>
            </View>
          </View>
        </View>

        {/* Section photos */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            📸 Photos de votre objet
          </Text>
          
          {formData.images.length > 0 ? (
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
                {formData.images.map((image, index) => (
                  <View key={index} className="mr-3">
                    <Image 
                      source={{ uri: image }} 
                      className="w-24 h-24 rounded-xl"
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={handleAddPhotos}
                className="bg-green-500 rounded-xl p-3 flex-row items-center justify-center"
              >
                <Ionicons name="camera-outline" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Modifier les photos</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleAddPhotos}
              className="border-2 border-dashed border-green-300 rounded-xl p-8 items-center"
            >
              <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-3">
                <Ionicons name="camera" size={32} color="#22C55E" />
              </View>
              <Text className="text-green-600 font-semibold text-lg">Ajouter des photos</Text>
              <Text className="text-gray-500 text-center mt-1">
                Des photos de qualité attirent plus de Geevers !
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Section informations */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            📝 Décrivez votre objet
          </Text>
          
          {/* Titre */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Titre*</Text>
            <TextInput
              className="bg-gray-50 rounded-xl p-4 text-gray-800 text-base"
              placeholder="Ex: Canapé IKEA en bon état"
              value={formData.title}
              onChangeText={(text) => updateFormData('title', text)}
              maxLength={60}
            />
            <Text className="text-gray-400 text-xs mt-1 text-right">
              {formData.title.length}/60
            </Text>
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Description*</Text>
            <TextInput
              className="bg-gray-50 rounded-xl p-4 text-gray-800 text-base"
              placeholder="Décrivez votre objet, son état, ses caractéristiques..."
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text className="text-gray-400 text-xs mt-1 text-right">
              {formData.description.length}/500
            </Text>
          </View>
        </View>

        {/* Section catégorie */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            🏷️ Catégorie
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => updateFormData('category', category.id)}
                className={`items-center mr-4 px-4 py-3 rounded-xl min-w-[90px] ${
                  selectedCategory?.id === category.id 
                    ? 'shadow-lg' 
                    : ''
                }`}
                style={{
                  backgroundColor: selectedCategory?.id === category.id ? category.color : '#F3F4F6'
                }}
              >
                <View className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
                  selectedCategory?.id === category.id ? 'bg-white/20' : 'bg-white'
                }`}>
                  <Ionicons 
                    name={category.icon as any} 
                    size={24} 
                    color={selectedCategory?.id === category.id ? 'white' : category.color} 
                  />
                </View>
                <Text className={`text-xs font-medium text-center ${
                  selectedCategory?.id === category.id ? 'text-white' : 'text-gray-700'
                }`}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section état */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            ⭐ État de l'objet
          </Text>
          
          <View className="flex-row flex-wrap">
            {conditions.map((condition) => (
              <TouchableOpacity
                key={condition.id}
                onPress={() => updateFormData('condition', condition.id)}
                className={`flex-row items-center mr-3 mb-3 px-4 py-3 rounded-xl ${
                  selectedCondition?.id === condition.id 
                    ? 'shadow-lg' 
                    : 'bg-gray-100'
                }`}
                style={{
                  backgroundColor: selectedCondition?.id === condition.id ? condition.color : '#F3F4F6'
                }}
              >
                <Ionicons 
                  name={condition.icon as any} 
                  size={20} 
                  color={selectedCondition?.id === condition.id ? 'white' : condition.color} 
                />
                <Text className={`ml-2 font-medium ${
                  selectedCondition?.id === condition.id ? 'text-white' : 'text-gray-700'
                }`}>
                  {condition.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section localisation */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            📍 Localisation
          </Text>
          
          <View className="bg-blue-50 rounded-xl p-4 flex-row items-center">
            <Ionicons name="location" size={24} color="#3B82F6" />
            <View className="flex-1 ml-3">
              <Text className="text-blue-800 font-medium">Paris, France</Text>
              <Text className="text-blue-600 text-sm">
                Localisation automatique activée
              </Text>
            </View>
            <TouchableOpacity className="bg-blue-500 rounded-lg px-3 py-2">
              <Text className="text-white text-sm font-medium">Modifier</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Message encourageant */}
        <View className="bg-gradient-to-r from-green-500 to-blue-500 mx-4 rounded-xl p-6 mb-6">
          <View className="items-center">
            <Ionicons name="earth" size={48} color="white" />
            <Text className="text-white font-bold text-lg text-center mt-3">
              Merci pour votre geste !
            </Text>
            <Text className="text-green-100 text-center mt-2 text-sm">
              En donnant, vous participez à l'économie circulaire et aidez la planète 🌱
            </Text>
          </View>
        </View>

        {/* Bouton de publication */}
        <View className="px-4 pb-8">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
            className={`rounded-xl p-4 flex-row items-center justify-center ${
              isLoading || !formData.title.trim() || !formData.description.trim()
                ? 'bg-gray-300' 
                : 'bg-green-500 shadow-lg'
            }`}
          >
            {isLoading ? (
              <Text className="text-white font-bold text-lg">Publication en cours...</Text>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text className="text-white font-bold text-lg ml-2">
                  {isEditMode ? 'Modifier l\'objet' : 'Publier mon don'}
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          {(!formData.title.trim() || !formData.description.trim()) && (
            <Text className="text-gray-500 text-center mt-3 text-sm">
              Veuillez remplir le titre et la description
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddItemScreen; 