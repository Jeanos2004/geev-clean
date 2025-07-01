import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const conversations = [
    {
      id: '1',
      name: 'Marie Dubois',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b79bcd73?w=100',
      lastMessage: 'Parfait ! Je peux passer le récupérer demain ?',
      time: '5min',
      unread: 2,
      online: true,
      item: 'Canapé IKEA',
    },
    {
      id: '2',
      name: 'Thomas Martin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      lastMessage: 'L\'objet est encore disponible !',
      time: '1h',
      unread: 0,
      online: false,
      item: 'Vélo de ville',
    },
  ];

  if (!selectedChat) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View className="flex-1">
              <Text className="text-xl font-bold text-white">Messages</Text>
              <Text className="text-green-100 text-sm">2 conversations actives</Text>
            </View>

            <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="add-outline" size={24} color="white" />
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
              <Text className="text-lg font-bold text-gray-800">Communiquez avec respect ! 💬</Text>
              <Text className="text-gray-600 text-sm">Organisez vos dons en toute confiance</Text>
            </View>
          </View>
        </View>

        {/* Liste des conversations */}
        <ScrollView className="flex-1 px-4">
          {conversations.map((conv) => (
            <TouchableOpacity
              key={conv.id}
              onPress={() => setSelectedChat(conv.id)}
              className="bg-white rounded-xl p-4 mb-3 border border-gray-200 shadow-sm"
            >
              <View className="flex-row items-center">
                <View className="relative mr-3">
                  <Image source={{ uri: conv.avatar }} className="w-12 h-12 rounded-full" />
                  {conv.online && (
                    <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="font-semibold text-gray-800">{conv.name}</Text>
                    <View className="flex-row items-center">
                      {conv.unread > 0 && (
                        <View className="bg-green-500 rounded-full w-6 h-6 items-center justify-center mr-2">
                          <Text className="text-white text-xs font-bold">{conv.unread}</Text>
                        </View>
                      )}
                      <Text className="text-gray-500 text-xs">{conv.time}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Ionicons name="gift-outline" size={14} color="#22C55E" />
                    <Text className="text-green-600 text-xs font-medium ml-1">{conv.item}</Text>
                  </View>

                  <Text className="text-gray-600 text-sm" numberOfLines={1}>{conv.lastMessage}</Text>
                  <Text className="text-gray-400 text-xs mt-1">
                    {conv.online ? '🟢 En ligne' : '⚫ Hors ligne'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer encourageant */}
        <View className="bg-gradient-to-r from-green-500 to-blue-500 mx-4 rounded-xl p-4 mb-4">
          <View className="items-center">
            <Ionicons name="people" size={32} color="white" />
            <Text className="text-white font-bold text-center mt-2">Créez des liens !</Text>
            <Text className="text-green-100 text-center text-sm mt-1">
              Chaque conversation est une nouvelle amitié 🤝
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Vue conversation (simplifiée)
  const activeConv = conversations.find(c => c.id === selectedChat);
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => setSelectedChat(null)}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          {activeConv && (
            <View className="flex-row items-center flex-1">
              <Image source={{ uri: activeConv.avatar }} className="w-10 h-10 rounded-full mr-3" />
              <View className="flex-1">
                <Text className="text-lg font-bold text-white">{activeConv.name}</Text>
                <Text className="text-green-100 text-sm">En ligne</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        <View className="mb-4 items-start">
          <View className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md max-w-[75%]">
            <Text className="text-gray-800">Bonjour ! Votre canapé m'intéresse beaucoup 😊</Text>
          </View>
          <Text className="text-gray-400 text-xs mt-1 mx-2">Hier 14:30</Text>
        </View>

        <View className="mb-4 items-end">
          <View className="bg-green-500 px-4 py-3 rounded-2xl rounded-br-md max-w-[75%]">
            <Text className="text-white">Il est encore disponible ! Voulez-vous le voir ?</Text>
          </View>
          <Text className="text-gray-400 text-xs mt-1 mx-2">Hier 14:35</Text>
        </View>
      </ScrollView>

      <View className="border-t border-gray-200 bg-white p-4">
        <View className="flex-row items-center">
          <TouchableOpacity className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
            <Ionicons name="gift-outline" size={24} color="#22C55E" />
          </TouchableOpacity>
          
          <View className="flex-1 bg-gray-100 rounded-full px-4 py-2">
            <TextInput
              className="text-base text-gray-800"
              placeholder="Tapez votre message..."
              value={message}
              onChangeText={setMessage}
            />
          </View>
          
          <TouchableOpacity className="w-10 h-10 bg-green-500 rounded-full items-center justify-center ml-3">
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen; 