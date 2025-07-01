import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

/**
 * LoginScreen Geev - Design authentique et inspirant
 */
const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('demo@geev.com');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Attention', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      Alert.alert('Erreur', 'Identifiants invalides');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Geev avec dégradé */}
        <View className="bg-gradient-to-br from-green-500 to-blue-600 pt-12 pb-16 px-6">
          <View className="items-center">
            <View className="w-28 h-28 bg-white rounded-full items-center justify-center mb-6 shadow-lg">
              <View className="w-20 h-20 bg-green-500 rounded-full items-center justify-center">
                <Text className="text-white text-3xl font-bold">G</Text>
              </View>
            </View>
            
            <Text className="text-4xl font-bold text-white mb-3 text-center">
              Bienvenue sur Geev
            </Text>
            <Text className="text-green-100 text-lg text-center">
              Donnez, recevez, sauvez la planète ! 🌍
            </Text>
            <Text className="text-green-200 text-center mt-2 text-sm">
              Rejoignez la communauté anti-gaspillage
            </Text>
          </View>
        </View>

        {/* Formulaire de connexion */}
        <View className="px-6 -mt-8">
          <View className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <View className="items-center mb-6">
              <Ionicons name="person-circle" size={32} color="#22C55E" />
              <Text className="text-xl font-bold text-gray-800 mt-2">Connectez-vous</Text>
              <Text className="text-gray-500 text-center">Accédez à votre compte Geever</Text>
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">📧 Adresse email</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-4 flex-row items-center">
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Mot de passe */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">🔒 Mot de passe</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-4 flex-row items-center">
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Bouton connexion */}
            <TouchableOpacity
              className={`bg-green-500 rounded-xl py-4 items-center mb-4 ${isLoading ? 'opacity-70' : ''}`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <View className="flex-row items-center">
                <Ionicons name="log-in" size={20} color="white" />
                <Text className="text-white font-bold text-lg ml-2">
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <Text className="text-green-600 font-medium">Mot de passe oublié ? 🤔</Text>
            </TouchableOpacity>
          </View>

          {/* Valeurs Geev */}
          <View className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="leaf" size={24} color="#22C55E" />
              <Text className="text-gray-800 font-bold text-lg ml-2">Pourquoi Geev ?</Text>
            </View>
            <View className="space-y-2">
              <View className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                <Text className="text-gray-700 ml-2 text-sm">💚 Réduisez vos déchets</Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                <Text className="text-gray-700 ml-2 text-sm">🤝 Créez du lien social</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                <Text className="text-gray-700 ml-2 text-sm">🎁 Trouvez des objets gratuits</Text>
              </View>
            </View>
          </View>

          {/* Inscription */}
          <View className="flex-row justify-center items-center mb-6">
            <Text className="text-gray-600">Nouveau sur Geev ? </Text>
            <TouchableOpacity>
              <Text className="text-green-600 font-bold">Créer un compte 🚀</Text>
            </TouchableOpacity>
          </View>

          {/* Compte de test */}
          <View className="bg-orange-500 rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle" size={24} color="white" />
              <Text className="text-white font-bold text-lg ml-2">🎯 Compte de test</Text>
            </View>
            <Text className="text-orange-100 text-sm">
              Email: demo@geev.com{'\n'}Mot de passe: demo123
            </Text>
          </View>

          {/* Footer inspirant */}
          <View className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 mb-8">
            <View className="items-center">
              <Ionicons name="earth" size={32} color="white" />
              <Text className="text-white font-bold text-lg text-center mt-2">
                Ensemble pour la planète ! 🌱
              </Text>
              <Text className="text-green-100 text-center text-sm mt-1">
                Plus de 6 millions de Geevers nous font confiance
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen; 