import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Écrans d'authentification
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Types pour la navigation d'authentification
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * Navigateur pour les écrans d'authentification
 * Gère la navigation entre connexion et inscription
 */
const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Écran de connexion */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Connexion',
        }}
      />

      {/* Écran d'inscription */}
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Créer un compte',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator; 