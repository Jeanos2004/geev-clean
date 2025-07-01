# 🎨 Guide NativeWind pour GeevClean

## Configuration réussie ✅

NativeWind v4 est maintenant configuré pour votre application GeevClean avec :
- Tailwind CSS v3.4+
- Configuration Metro + Babel optimisée
- Palette de couleurs Geev personnalisée
- Support TypeScript complet

## 🎯 Classes essentielles pour vos écrans

### Layout & Flexbox
```jsx
className="flex-1"              // flex: 1
className="flex-row"            // flexDirection: 'row'
className="flex-col"            // flexDirection: 'column'
className="items-center"        // alignItems: 'center'
className="justify-center"      // justifyContent: 'center'
className="justify-between"     // justifyContent: 'space-between'
```

### Spacing
```jsx
className="p-4"                 // padding: 16
className="px-4 py-2"          // paddingHorizontal: 16, paddingVertical: 8
className="m-4"                // margin: 16
className="mt-2 mb-4"          // marginTop: 8, marginBottom: 16
```

### Colors Geev
```jsx
className="bg-primary-500"      // Bleu principal #3B82F6
className="bg-secondary-500"    // Vert #22C55E
className="bg-accent-500"       // Orange #FF6B35
className="text-primary-600"    // Texte bleu foncé
className="text-gray-600"       // Texte gris
```

### Tailles
```jsx
className="w-12 h-12"          // width: 48, height: 48
className="w-full"             // width: '100%'
className="w-[48%]"            // width: '48%' (valeur arbitraire)
```

### Bordures & Coins
```jsx
className="rounded-lg"          // borderRadius: 8
className="rounded-full"        // borderRadius: 9999
className="border border-gray-200" // border: 1, borderColor: '#E5E7EB'
```

### Texte
```jsx
className="text-lg font-bold"   // fontSize: 18, fontWeight: 'bold'
className="text-center"         // textAlign: 'center'
className="text-gray-900"       // color: '#111827'
```

## 🔧 Exemples pratiques pour vos écrans

### LoginScreen
```jsx
<SafeAreaView className="flex-1 bg-gray-50">
  <View className="flex-1 justify-center p-6">
    <Text className="text-3xl font-bold text-center text-primary-600 mb-8">
      Geev
    </Text>
    
    <TextInput
      className="bg-white border border-gray-200 rounded-xl p-4 mb-4"
      placeholder="Email"
    />
    
    <TouchableOpacity className="bg-primary-500 rounded-xl p-4">
      <Text className="text-white text-center font-semibold text-lg">
        Se connecter
      </Text>
    </TouchableOpacity>
  </View>
</SafeAreaView>
```

### MapScreen
```jsx
<SafeAreaView className="flex-1">
  <View className="absolute top-16 left-4 right-4 z-10">
    <View className="bg-white rounded-xl p-3 shadow-lg">
      <Text className="text-lg font-semibold text-gray-900">
        Objets près de vous
      </Text>
    </View>
  </View>
  
  <MapView className="flex-1" />
  
  <View className="absolute bottom-8 right-4">
    <TouchableOpacity className="bg-primary-500 rounded-full p-4 shadow-lg">
      <Ionicons name="locate" size={24} color="white" />
    </TouchableOpacity>
  </View>
</SafeAreaView>
```

### AddItemScreen
```jsx
<ScrollView className="flex-1 bg-gray-50">
  <View className="p-4">
    <Text className="text-2xl font-bold text-gray-900 mb-6">
      Donner un objet
    </Text>
    
    <View className="bg-white rounded-xl p-4 mb-4">
      <Text className="text-lg font-semibold text-gray-900 mb-3">
        Photos
      </Text>
      <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-xl p-8 items-center">
        <Ionicons name="camera" size={32} color="#9CA3AF" />
        <Text className="text-gray-500 mt-2">Ajouter des photos</Text>
      </TouchableOpacity>
    </View>
    
    <View className="bg-white rounded-xl p-4 mb-4">
      <TextInput
        className="text-lg font-semibold text-gray-900 mb-2"
        placeholder="Titre de l'objet"
      />
      <TextInput
        className="text-gray-600 h-24"
        placeholder="Description..."
        multiline
        numberOfLines={4}
      />
    </View>
  </View>
</ScrollView>
```

### ProfileScreen
```jsx
<SafeAreaView className="flex-1 bg-gray-50">
  <ScrollView>
    {/* Header */}
    <View className="bg-primary-500 p-6 items-center">
      <Image 
        source={{ uri: user?.profilePicture }}
        className="w-24 h-24 rounded-full border-4 border-white"
      />
      <Text className="text-white text-xl font-bold mt-3">
        {user?.firstName} {user?.lastName}
      </Text>
      <View className="flex-row items-center mt-1">
        <Ionicons name="star" size={16} color="#FCD34D" />
        <Text className="text-white ml-1">{user?.rating}</Text>
      </View>
    </View>
    
    {/* Stats */}
    <View className="bg-white m-4 rounded-xl p-4">
      <View className="flex-row justify-around">
        <View className="items-center">
          <Text className="text-2xl font-bold text-primary-600">
            {user?.totalDonations}
          </Text>
          <Text className="text-gray-600">Dons</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-secondary-600">
            {user?.totalReceptions}
          </Text>
          <Text className="text-gray-600">Reçus</Text>
        </View>
      </View>
    </View>
  </ScrollView>
</SafeAreaView>
```

## 🎨 Combinaisons courantes

### Boutons
```jsx
// Bouton principal
className="bg-primary-500 rounded-xl px-6 py-3"

// Bouton secondaire
className="bg-white border border-primary-500 rounded-xl px-6 py-3"

// Bouton danger
className="bg-red-500 rounded-xl px-6 py-3"
```

### Cards
```jsx
// Card simple
className="bg-white rounded-xl p-4 shadow-sm"

// Card avec ombre
className="bg-white rounded-xl p-4 shadow-lg"

// Card avec bordure
className="bg-white border border-gray-200 rounded-xl p-4"
```

### Input
```jsx
// Input normal
className="bg-white border border-gray-200 rounded-xl p-4"

// Input focus (état actif)
className="bg-white border-2 border-primary-500 rounded-xl p-4"

// Input avec erreur
className="bg-white border-2 border-red-500 rounded-xl p-4"
```

## 🚨 Bonnes pratiques

1. **Utilisez les couleurs Geev** : `primary-500`, `secondary-500`, `accent-500`
2. **Responsive** : Utilisez `w-[48%]` pour les grilles sur mobile
3. **Shadows** : `shadow-sm`, `shadow-lg` + `elevation` pour Android
4. **Spacing** : Utilisez la progression `1,2,3,4,6,8,12,16,20,24`
5. **Consistance** : Gardez les mêmes `rounded-xl` et `p-4` partout

## 🔄 Migration depuis StyleSheet

Pour convertir vos écrans existants :

1. **Supprimez** `StyleSheet.create({})`
2. **Remplacez** `style={styles.xxx}` par `className="xxx"`
3. **Convertissez** les valeurs numériques en classes Tailwind
4. **Utilisez** les couleurs de la palette Geev

**Votre application est maintenant prête avec NativeWind ! 🎉**

Vous pouvez utiliser toutes ces classes dans vos écrans LoginScreen, MapScreen, AddItemScreen, ProfileScreen, etc. 

✅ Remplacez vos StyleSheet par className
<View className="flex-1 bg-primary-500 p-4">
  <Text className="text-white text-xl font-bold">
    Geev avec NativeWind !
  </Text>
</View> 