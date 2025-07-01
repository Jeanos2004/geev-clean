import React from 'react';
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

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { conversations } = useChat();

  const handleConversationPress = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      (navigation as any).navigate('Chat', {
        conversationId,
        recipientId: conversation.participants.find(p => p.id !== user?.id)?.id,
        itemId: conversation.itemId
      });
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
          onPress: () => (navigation as any).navigate('Home')
        }
      ]
    );
  };

  const getOtherParticipant = (conversation: any) => {
    return conversation.participants.find((p: any) => p.id !== user?.id);
  };

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header Geev avec dégradé */}
      <View className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-white">Messages</Text>
            <Text className="text-green-100 text-sm">
              {totalUnreadCount > 0 
                ? `${totalUnreadCount} message${totalUnreadCount > 1 ? 's' : ''} non lu${totalUnreadCount > 1 ? 's' : ''}`
                : `${conversations.length} conversation${conversations.length > 1 ? 's' : ''}`
              }
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleStartNewChat}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Message inspirant */}
      <View className="bg-gradient-to-br from-blue-50 to-green-50 p-4 mx-4 my-4 rounded-xl">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center mr-3">
            <Ionicons name="chatbubbles" size={24} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800">
              Communiquez avec respect ! 💬
            </Text>
            <Text className="text-gray-600 text-sm">
              Organisez vos dons en toute confiance avec les autres Geevers
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {conversations.length === 0 ? (
          <View className="flex-1 justify-center items-center py-12 px-6">
            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="chatbubbles-outline" size={40} color="#9CA3AF" />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              Aucune conversation
            </Text>
            <Text className="text-gray-600 text-center mb-8 leading-6">
              Vous n'avez pas encore de conversations.{'\n'}
              Contactez des Geevers pour commencer à échanger !
            </Text>
            <TouchableOpacity
              onPress={handleStartNewChat}
              className="bg-green-500 px-8 py-4 rounded-xl shadow-lg flex-row items-center"
            >
              <Ionicons name="search" size={20} color="white" />
              <Text className="text-white font-bold text-lg ml-2">
                Parcourir les objets
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="px-4">
            {conversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const hasUnread = conversation.unreadCount > 0;
              
              return (
                <TouchableOpacity
                  key={conversation.id}
                  onPress={() => handleConversationPress(conversation.id)}
                  className={`bg-white rounded-xl p-4 mb-3 shadow-sm border ${
                    hasUnread 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <View className="flex-row items-center">
                    <View className="relative mr-3">
                      <Image
                        source={{ 
                          uri: otherParticipant?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
                        }}
                        className="w-14 h-14 rounded-full"
                      />
                      {hasUnread && (
                        <View className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full items-center justify-center">
                          <Text className="text-white text-xs font-bold">
                            {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                          </Text>
                        </View>
                      )}
                      <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                    </View>

                    <View className="flex-1">
                      <View className="flex-row justify-between items-start mb-1">
                        <Text className={`text-lg font-bold ${
                          hasUnread ? 'text-gray-900' : 'text-gray-800'
                        }`}>
                          {otherParticipant?.name || 'Geever'}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          {conversation.updatedAt ? 'À l\'instant' : 'Il y a 2h'}
                        </Text>
                      </View>

                      {conversation.item && (
                        <View className="flex-row items-center mb-2">
                          <Ionicons name="gift-outline" size={14} color="#22C55E" />
                          <Text className="text-green-600 text-sm font-medium ml-1" numberOfLines={1}>
                            {conversation.item.title}
                          </Text>
                        </View>
                      )}

                      <Text 
                        className={`text-sm ${
                          hasUnread ? 'text-gray-700 font-medium' : 'text-gray-600'
                        }`}
                        numberOfLines={2}
                      >
                        {conversation.lastMessage?.content || 'Démarrez la conversation...'}
                      </Text>

                      <Text className="text-green-500 text-xs mt-1">
                        🟢 En ligne
                      </Text>
                    </View>

                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {conversations.length > 0 && (
          <View className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 mx-4 mt-4 mb-6">
            <View className="flex-row items-center mb-4">
              <Ionicons name="bulb" size={24} color="white" />
              <Text className="text-white font-bold text-lg ml-2">
                Conseils Geev
              </Text>
            </View>
            <View className="space-y-2">
              <View className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={16} color="#BFDBFE" />
                <Text className="text-blue-100 text-sm ml-2">
                  💬 Soyez poli et respectueux dans vos échanges
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={16} color="#BFDBFE" />
                <Text className="text-blue-100 text-sm ml-2">
                  ⚡ Répondez rapidement aux messages
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={16} color="#BFDBFE" />
                <Text className="text-blue-100 text-sm ml-2">
                  📅 Confirmez les créneaux de récupération
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={16} color="#BFDBFE" />
                <Text className="text-blue-100 text-sm ml-2">
                  🤝 Prévenez en cas d'empêchement
                </Text>
              </View>
            </View>
          </View>
        )}

        <View className="bg-gradient-to-r from-green-500 to-green-600 mx-4 rounded-xl p-6 mb-8">
          <View className="items-center">
            <Ionicons name="people" size={32} color="white" />
            <Text className="text-white font-bold text-lg text-center mt-2">
              Créez des liens !
            </Text>
            <Text className="text-green-100 text-center text-sm mt-1">
              Chaque conversation est une nouvelle amitié dans la communauté Geev 🤝
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatListScreen;
