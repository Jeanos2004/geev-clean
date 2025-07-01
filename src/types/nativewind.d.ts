/// <reference types="nativewind/types" />

import 'react-native';

declare module 'react-native' {
  interface PressableProps {
    className?: string;
  }
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface SafeAreaViewProps {
    className?: string;
  }
}

declare module 'react-native-safe-area-context' {
  interface SafeAreaViewProps {
    className?: string;
  }
}

declare module '@react-navigation/native' {
  interface ViewProps {
    className?: string;
  }
} 