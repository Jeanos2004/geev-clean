import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useItems } from '../../contexts/ItemsContext';
import { useAuth } from '../../contexts/AuthContext';
import { Item, CategoryType, ItemCondition, CreateItemData } from '../../types/item';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { CATEGORIES, ITEM_CONDITIONS } from '../../utils/constants';

type AddItemRouteProp = RouteProp<{ AddItem: { editItem?: Item } }, 'AddItem'>;

/**
 * Écran d'ajout/modification d'objet avec formulaire complet
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
      city: '',
      zipCode: ''
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
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const editItem = route.params?.editItem;
  const isEditMode = !!editItem;

  // Initialiser le formulaire pour l'édition
  useEffect(() => {
    if (editItem) {
      setFormData({
        title: editItem.title,
        description: editItem.description,
        categoryId: editItem.categoryId,
        condition: editItem.condition,
        images: editItem.images,
        location: editItem.location,
        coordinates: editItem.coordinates,
      });
    }
  }, [editItem]);

  const updateFormData = (field: keyof CreateItemData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Supprimer l'erreur si elle existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Le titre doit contenir au moins 3 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Veuillez sélectionner une catégorie';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'L\'emplacement est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPhotos = () => {
    Alert.alert(
      'Ajouter des photos',
      'Fonctionnalité en cours de développement.\nPour le moment, des photos par défaut seront utilisées.',
      [
        { text: 'OK', onPress: () => {
          // Ajouter des photos par défaut pour la démonstration
          const defaultImages = [
            'https://via.placeholder.com/400x300/059669/white?text=Photo+1',
            'https://via.placeholder.com/400x300/0891b2/white?text=Photo+2'
          ];
          updateFormData('images', defaultImages);
        }}
      ]
    );
  };

  const handleGetLocation = () => {
    Alert.alert(
      'Géolocalisation',
      'Fonctionnalité en cours de développement.\nPour le moment, veuillez saisir manuellement votre adresse.',
      [{ text: 'OK' }]
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!user) return;

    setIsLoading(true);
    try {
      if (isEditMode && editItem) {
        await updateItem(editItem.id, formData);
        Alert.alert('Succès', 'Objet modifié avec succès !', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await addItem(formData);
        Alert.alert('Succès', 'Objet ajouté avec succès !', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder l\'objet');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = CATEGORIES.find(cat => cat.id === formData.categoryId);
  const selectedCondition = CONDITIONS.find(cond => cond.id === formData.condition);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full bg-gray-100"
        >
          <Ionicons name="close" size={24} color="#374151" />
        </TouchableOpacity>
        
        <Text className="text-lg font-semibold text-gray-900">
          {isEditMode ? 'Modifier l\'objet' : 'Ajouter un objet'}
        </Text>
        
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 p-4">
          {/* Section photos */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Photos
            </Text>
            
            {formData.images.length > 0 ? (
              <View className="mb-3">
                <Text className="text-green-600 mb-2">✓ {formData.images.length} photo(s) ajoutée(s)</Text>
                <TouchableOpacity
                  onPress={() => updateFormData('images', [])}
                  className="bg-red-100 rounded-lg p-3"
                >
                  <Text className="text-red-700 text-center">Supprimer les photos</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleAddPhotos}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 justify-center items-center bg-gray-50 mb-3"
              >
                <Ionicons name="camera-outline" size={48} color="#6B7280" />
                <Text className="text-gray-600 mt-2 text-center">
                  Appuyez pour ajouter des photos
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  (Fonctionnalité en développement)
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Titre */}
          <View className="mb-4">
            <Input
              label="Titre de l'annonce *"
              placeholder="Ex: iPhone 12, Canapé bleu, Vélo de ville..."
              value={formData.title}
              onChangeText={(text) => updateFormData('title', text)}
              error={errors.title}
              maxLength={100}
            />
          </View>

          {/* Description */}
          <View className="mb-4">
            <Input
              label="Description *"
              placeholder="Décrivez votre objet : état, caractéristiques, raison du don..."
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
              error={errors.description}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>

          {/* Catégorie */}
          <View className="mb-4">
            <Text className="text-base font-medium text-gray-900 mb-2">
              Catégorie *
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => updateFormData('categoryId', category.id)}
                  className={`mr-3 px-4 py-3 rounded-lg border-2 ${
                    formData.categoryId === category.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <Text className="text-2xl mb-1">{category.icon}</Text>
                  <Text
                    className={`text-sm font-medium ${
                      formData.categoryId === category.id ? 'text-green-700' : 'text-gray-700'
                    }`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {errors.categoryId && (
              <Text className="text-red-500 text-sm mt-1">{errors.categoryId}</Text>
            )}
          </View>

          {/* État */}
          <View className="mb-4">
            <Text className="text-base font-medium text-gray-900 mb-2">
              État de l'objet *
            </Text>
            <View className="flex-row flex-wrap">
              {CONDITIONS.map((condition) => (
                <TouchableOpacity
                  key={condition.id}
                  onPress={() => updateFormData('condition', condition.id)}
                  className={`mr-3 mb-2 px-4 py-2 rounded-full border-2 ${
                    formData.condition === condition.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      formData.condition === condition.id ? 'text-green-700' : 'text-gray-700'
                    }`}
                  >
                    {condition.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Localisation */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-900 mb-2">
              Localisation *
            </Text>
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <Input
                  placeholder="Adresse, ville..."
                  value={formData.location}
                  onChangeText={(text) => updateFormData('location', text)}
                  error={errors.location}
                />
              </View>
              <TouchableOpacity
                onPress={handleGetLocation}
                className="px-4 py-3 bg-green-500 rounded-lg justify-center items-center"
              >
                <Ionicons name="location" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-gray-500 text-sm mt-1">
              Ex: 75001 Paris, Marseille, Lyon...
            </Text>
          </View>

          {/* Résumé */}
          {formData.title && (
            <View className="bg-gray-50 rounded-lg p-4 mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-2">
                Aperçu de votre annonce
              </Text>
              <View className="flex-row">
                <View className="w-16 h-16 bg-gray-200 rounded-lg mr-3 justify-center items-center">
                  <Ionicons name="image-outline" size={24} color="#6B7280" />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-900">{formData.title}</Text>
                  {selectedCategory && (
                    <Text className="text-sm text-gray-600 mt-1">
                      {selectedCategory.name}
                    </Text>
                  )}
                  {selectedCondition && (
                    <Text className="text-sm text-gray-600">
                      {selectedCondition.name}
                    </Text>
                  )}
                  {formData.location && (
                    <Text className="text-sm text-gray-500">
                      📍 {formData.location}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bouton de soumission */}
        <View className="p-4 border-t border-gray-200">
          <Button
            title={isEditMode ? 'Modifier l\'objet' : 'Publier l\'objet'}
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            variant="primary"
            icon={<Ionicons name="checkmark" size={20} color="white" />}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddItemScreen; 