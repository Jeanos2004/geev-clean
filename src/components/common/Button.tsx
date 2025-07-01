import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

/**
 * Composant Button réutilisable avec différentes variantes
 * Supporte les icônes, états de chargement, et diverses tailles
 */
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
}) => {
  // Styles de base selon la variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-500 active:bg-primary-600';
      case 'secondary':
        return 'bg-secondary-500 active:bg-secondary-600';
      case 'outline':
        return 'bg-transparent border-2 border-primary-500 active:bg-primary-50';
      case 'ghost':
        return 'bg-transparent active:bg-gray-100';
      case 'danger':
        return 'bg-danger-500 active:bg-danger-600';
      default:
        return 'bg-primary-500 active:bg-primary-600';
    }
  };

  // Styles de texte selon la variante
  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return 'text-white';
      case 'outline':
        return 'text-primary-500';
      case 'ghost':
        return 'text-gray-700';
      default:
        return 'text-white';
    }
  };

  // Styles selon la taille
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-2 rounded-md';
      case 'medium':
        return 'px-4 py-3 rounded-lg';
      case 'large':
        return 'px-6 py-4 rounded-xl';
      default:
        return 'px-4 py-3 rounded-lg';
    }
  };

  // Taille du texte selon la taille du bouton
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  // Taille de l'icône selon la taille du bouton
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 20;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  // Classes conditionnelles
  const buttonClasses = [
    // Classes de base
    'flex-row justify-center items-center',
    getSizeStyles(),
    getVariantStyles(),
    
    // État désactivé
    disabled && 'opacity-50',
    
    // Largeur complète
    fullWidth && 'w-full',
    
    // Classes personnalisées
    className,
  ].filter(Boolean).join(' ');

  const textClasses = [
    'font-semibold text-center',
    getTextSize(),
    getTextStyles(),
  ].join(' ');

  const iconColor = variant === 'outline' ? '#0EA5E9' : 
                   variant === 'ghost' ? '#374151' : '#FFFFFF';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={buttonClasses}
      activeOpacity={0.8}
    >
      <View className="flex-row justify-center items-center">
        {/* Icône à gauche */}
        {icon && iconPosition === 'left' && (
          <Ionicons 
            name={icon} 
            size={getIconSize()} 
            color={iconColor}
            style={{ marginRight: 8 }}
          />
        )}

        {/* Indicateur de chargement ou texte */}
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={iconColor}
          />
        ) : (
          <Text className={textClasses}>
            {title}
          </Text>
        )}

        {/* Icône à droite */}
        {icon && iconPosition === 'right' && !loading && (
          <Ionicons 
            name={icon} 
            size={getIconSize()} 
            color={iconColor}
            style={{ marginLeft: 8 }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button; 