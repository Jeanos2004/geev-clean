import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'email' | 'password' | 'phone' | 'number';
  disabled?: boolean;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  icon?: keyof typeof Ionicons.glyphMap;
  className?: string;
  onBlur?: () => void;
  onFocus?: () => void;
}

/**
 * Composant Input réutilisable avec validation et styles personnalisés
 * Supporte différents types de saisie et validation d'erreurs
 */
const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  type = 'text',
  disabled = false,
  error,
  required = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  icon,
  className = '',
  onBlur,
  onFocus,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Configuration selon le type d'input
  const getInputConfig = () => {
    switch (type) {
      case 'email':
        return {
          keyboardType: 'email-address' as const,
          autoCapitalize: 'none' as const,
          autoComplete: 'email' as const,
          autoCorrect: false,
        };
      case 'password':
        return {
          secureTextEntry: !isPasswordVisible,
          autoCapitalize: 'none' as const,
          autoComplete: 'password' as const,
          autoCorrect: false,
        };
      case 'phone':
        return {
          keyboardType: 'phone-pad' as const,
          autoComplete: 'tel' as const,
        };
      case 'number':
        return {
          keyboardType: 'numeric' as const,
        };
      default:
        return {
          autoCapitalize: 'sentences' as const,
          autoComplete: 'off' as const,
        };
    }
  };

  // Styles conditionnels pour le conteneur
  const getContainerStyles = () => {
    const baseStyles = 'border rounded-lg px-4 py-3 bg-white';
    
    if (error) {
      return `${baseStyles} border-danger-500 bg-danger-50`;
    }
    
    if (isFocused) {
      return `${baseStyles} border-primary-500 bg-primary-50`;
    }
    
    if (disabled) {
      return `${baseStyles} border-gray-300 bg-gray-100`;
    }
    
    return `${baseStyles} border-gray-300`;
  };

  // Gestion du focus
  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  // Toggle pour la visibilité du mot de passe
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const inputConfig = getInputConfig();

  return (
    <View className={`mb-4 ${className}`}>
      {/* Label */}
      {label && (
        <Text className="text-gray-700 font-medium mb-2">
          {label}
          {required && <Text className="text-danger-500"> *</Text>}
        </Text>
      )}

      {/* Conteneur de l'input */}
      <View className={getContainerStyles()}>
        <View className="flex-row items-center">
          {/* Icône à gauche */}
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={error ? '#EF4444' : isFocused ? '#0EA5E9' : '#6B7280'}
              style={{ marginRight: 12 }}
            />
          )}

          {/* Input */}
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            editable={!disabled}
            multiline={multiline}
            numberOfLines={numberOfLines}
            maxLength={maxLength}
            className={`flex-1 text-gray-900 text-base ${
              multiline ? 'min-h-20' : ''
            }`}
            style={{
              textAlignVertical: multiline ? 'top' : 'center',
            }}
            {...inputConfig}
          />

          {/* Bouton pour toggle password visibility */}
          {type === 'password' && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              className="p-1"
              activeOpacity={0.7}
            >
              <Ionicons
                name={isPasswordVisible ? 'eye-off' : 'eye'}
                size={20}
                color={isFocused ? '#0EA5E9' : '#6B7280'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Message d'erreur */}
      {error && (
        <Text className="text-danger-500 text-sm mt-1">
          {error}
        </Text>
      )}

      {/* Compteur de caractères (si maxLength défini) */}
      {maxLength && (
        <Text className="text-gray-400 text-xs mt-1 text-right">
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};

export default Input; 