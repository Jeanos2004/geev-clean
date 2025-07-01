import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          💬 Conversation
        </Text>
        <Text className="text-gray-600 text-center">
          L'interface de chat sera développée dans les prochaines étapes.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen; 