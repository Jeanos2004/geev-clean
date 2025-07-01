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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Écran de connexion avec design moderne Geev
 * Authentification par email/mot de passe et Google
 */
const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('demo@geev.com');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle, error, clearError } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      await login({ email, password });
    } catch (err) {
      Alert.alert('Erreur de connexion', 'Identifiants invalides');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    clearError();

    try {
      await loginWithGoogle();
    } catch (err) {
      Alert.alert('Erreur', 'Connexion Google échouée');
    } finally {
      setIsLoading(false);
    }
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
          {/* Header avec logo */}
          <View className="items-center pt-12 pb-8">
            <View className="w-24 h-24 bg-primary-500 rounded-full items-center justify-center mb-4">
              <Text className="text-white text-4xl font-bold">G</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenue sur Geev
            </Text>
            <Text className="text-gray-600 text-center px-8">
              Donnez une seconde vie à vos objets et trouvez des trésors près de chez vous
            </Text>
          </View>

          {/* Formulaire de connexion */}
          <View className="flex-1 px-6">
            <View className="bg-white rounded-geev-lg p-6 mb-6" style={{ elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 }}>
              <Text className="text-xl font-semibold text-gray-900 mb-6">
                Connectez-vous
              </Text>

              {/* Champ email */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-geev px-4 py-3 text-gray-900"
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Champ mot de passe */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-geev px-4 py-3 text-gray-900"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {/* Bouton de connexion */}
              <TouchableOpacity
                className={`bg-primary-500 rounded-geev py-4 items-center mb-4 ${
                  isLoading ? 'opacity-70' : ''
                }`}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text className="text-white font-semibold text-lg">
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Text>
              </TouchableOpacity>

              {/* Mot de passe oublié */}
              <TouchableOpacity className="items-center">
                <Text className="text-primary-500 font-medium">
                  Mot de passe oublié ?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Séparateur */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="px-4 text-gray-500 font-medium">OU</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Connexion Google */}
            <TouchableOpacity
              className="bg-white border border-gray-300 rounded-geev py-4 px-6 flex-row items-center justify-center mb-8"
              onPress={handleGoogleLogin}
              disabled={isLoading}
            >
              <View className="w-6 h-6 bg-gray-200 rounded-full mr-3" />
              <Text className="text-gray-900 font-medium text-lg">
                Continuer avec Google
              </Text>
            </TouchableOpacity>

            {/* Lien d'inscription */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600">Pas encore de compte ? </Text>
              <TouchableOpacity>
                <Text className="text-primary-500 font-semibold">
                  Créer un compte
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Informations de démo */}
          <View className="bg-orange-50 border border-orange-200 rounded-geev mx-6 p-4 mb-6">
            <Text className="text-orange-800 font-semibold mb-2">
              🎯 Compte de démonstration
            </Text>
            <Text className="text-orange-700 text-sm">
              Email : demo@geev.com{'\n'}
              Mot de passe : demo123
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen; 