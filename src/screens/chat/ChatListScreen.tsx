import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Écran de liste des conversations
 */
const ChatListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { conversations, markConversationAsRead } = useChat();

  const handleConversationPress = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      markConversationAsRead(conversationId);
      
      navigation.navigate('Chat' as never, {
        conversationId,
        recipientId: conversation.participants.find(p => p.id !== user?.id)?.id,
        itemId: conversation.itemId
      } as never);
    }
  };

  const handleStartNewChat = () => {
    Alert.alert(
      'Nouvelle conversation',
      'Pour démarrer une nouvelle conversation, trouvez un objet qui vous intéresse et contactez son propriétaire !',
      [
        { text: 'OK' },
        { 
          text: 'Parcourir les objets', 
          onPress: () => navigation.navigate('Home' as never)
        }
      ]
    );
  };

  const getOtherParticipant = (conversation: any) => {
    return conversation.participants.find((p: any) => p.id !== user?.id);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          💬 Messages
        </Text>
        <TouchableOpacity
          onPress={handleStartNewChat}
          className="p-2 rounded-full bg-green-100"
        >
          <Ionicons name="add" size={24} color="#059669" />
        </TouchableOpacity>
      </View>

      {/* Liste des conversations */}
      <ScrollView className="flex-1">
        {conversations.length === 0 ? (
          <View className="flex-1 justify-center items-center py-12 px-6">
            <Ionicons name="chatbubbles-outline" size={64} color="#9CA3AF" />
            <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2">
              Aucune conversation
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Vous n'avez pas encore de conversations. Contactez des donneurs pour commencer à échanger !
            </Text>
            <TouchableOpacity
              onPress={handleStartNewChat}
              className="bg-green-500 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-medium">Parcourir les objets</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="px-4 py-2">
            {conversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const hasUnread = conversation.unreadCount > 0;
              
              return (
                <TouchableOpacity
                  key={conversation.id}
                  onPress={() => handleConversationPress(conversation.id)}
                  className={`flex-row items-center p-4 rounded-lg mb-2 ${
                    hasUnread ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  {/* Avatar */}
                  <View className="relative">
                    <Image
                      source={{ 
                        uri: otherParticipant?.avatar || 'https://via.placeholder.com/50/059669/white?text=U'
                      }}
                      className="w-12 h-12 rounded-full"
                    />
                    {hasUnread && (
                      <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full justify-center items-center">
                        <Text className="text-white text-xs font-bold">
                          {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Contenu */}
                  <View className="flex-1 ml-3">
                    <View className="flex-row justify-between items-start mb-1">
                      <Text className={`font-semibold ${hasUnread ? 'text-gray-900' : 'text-gray-800'}`}>
                        {otherParticipant?.name || 'Utilisateur inconnu'}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {conversation.updatedAt ? 'Récent' : 'Ancien'}
                      </Text>
                    </View>

                    {/* Objet concerné */}
                    {conversation.item && (
                      <Text className="text-green-600 text-sm mb-1" numberOfLines={1}>
                        📦 {conversation.item.title}
                      </Text>
                    )}

                    {/* Dernier message */}
                    <Text 
                      className={`text-sm ${hasUnread ? 'text-gray-700 font-medium' : 'text-gray-600'}`}
                      numberOfLines={2}
                    >
                      {conversation.lastMessage?.content || 'Pas de messages'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Section conseils */}
        {conversations.length > 0 && (
          <View className="bg-blue-50 rounded-lg p-4 mx-4 mt-4 mb-6">
            <Text className="text-blue-900 font-semibold mb-2">
              💡 Conseils pour une bonne communication
            </Text>
            <Text className="text-blue-800 text-sm leading-5">
              • Soyez poli et respectueux dans vos échanges{'\n'}
              • Répondez rapidement aux messages{'\n'}
              • Confirmez les créneaux de récupération{'\n'}
              • Prévenez en cas d'empêchement
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatListScreen; 