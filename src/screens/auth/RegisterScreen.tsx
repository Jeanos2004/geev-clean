import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Écran d'inscription avec design moderne Geev
 */
const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register, error, clearError } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      Alert.alert('Erreur', 'Le prénom est requis');
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Erreur', 'Le nom est requis');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Erreur', 'L\'email est requis');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Erreur', 'L\'email n\'est pas valide');
      return false;
    }
    if (!formData.password) {
      Alert.alert('Erreur', 'Le mot de passe est requis');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    clearError();

    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
    } catch (err) {
      Alert.alert('Erreur d\'inscription', 'Impossible de créer le compte');
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="items-center pt-8 pb-6">
            <View className="w-20 h-20 bg-secondary-500 rounded-full items-center justify-center mb-4">
              <Text className="text-white text-3xl">✨</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Rejoignez Geev
            </Text>
            <Text className="text-gray-600 text-center px-8">
              Créez votre compte et commencez à donner et recevoir des objets
            </Text>
          </View>

          {/* Formulaire d'inscription */}
          <View className="flex-1 px-6">
            <View className="bg-white rounded-geev-lg p-6 mb-6" style={{ elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 }}>
              <Text className="text-xl font-semibold text-gray-900 mb-6">
                Informations personnelles
              </Text>

              {/* Prénom et Nom sur la même ligne */}
              <View className="flex-row mb-4 space-x-3">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-geev px-4 py-3 text-gray-900"
                    placeholder="Votre prénom"
                    value={formData.firstName}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                    autoCapitalize="words"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-geev px-4 py-3 text-gray-900"
                    placeholder="Votre nom"
                    value={formData.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-geev px-4 py-3 text-gray-900"
                  placeholder="votre.email@exemple.com"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Mot de passe */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-geev px-4 py-3 text-gray-900"
                  placeholder="Minimum 6 caractères"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                />
              </View>

              {/* Confirmation mot de passe */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-geev px-4 py-3 text-gray-900"
                  placeholder="Retapez votre mot de passe"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry
                />
              </View>

              {/* Bouton d'inscription */}
              <TouchableOpacity
                className={`bg-secondary-500 rounded-geev py-4 items-center mb-4 ${
                  isLoading ? 'opacity-70' : ''
                }`}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <Text className="text-white font-semibold text-lg">
                  {isLoading ? 'Création du compte...' : 'Créer mon compte'}
                </Text>
              </TouchableOpacity>

              {/* Conditions d'utilisation */}
              <Text className="text-xs text-gray-500 text-center">
                En créant un compte, vous acceptez nos{' '}
                <Text className="text-primary-500">Conditions d'utilisation</Text>
                {' '}et notre{' '}
                <Text className="text-primary-500">Politique de confidentialité</Text>
              </Text>
            </View>

            {/* Lien de connexion */}
            <View className="flex-row justify-center items-center mb-6">
              <Text className="text-gray-600">Déjà un compte ? </Text>
              <TouchableOpacity onPress={goToLogin}>
                <Text className="text-primary-500 font-semibold">
                  Se connecter
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Avantages Geev */}
          <View className="bg-gradient-to-r from-primary-50 to-secondary-50 mx-6 rounded-geev p-4 mb-6">
            <Text className="text-gray-800 font-semibold mb-3 text-center">
              🌟 Pourquoi rejoindre Geev ?
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <Text className="text-green-500 mr-2">✓</Text>
                <Text className="text-gray-700 text-sm">100% gratuit et écologique</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-green-500 mr-2">✓</Text>
                <Text className="text-gray-700 text-sm">Communauté bienveillante</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-green-500 mr-2">✓</Text>
                <Text className="text-gray-700 text-sm">Objets vérifiés par la communauté</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen; 