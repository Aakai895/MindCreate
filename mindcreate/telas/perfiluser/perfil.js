import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/authcontext'; 
const { width } = Dimensions.get('window');


export default function ProfileScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState(0); // 0 = grid, 1 = store
  const { usuario } = useApp(); 
  const profilePic = usuario?.imagem || 'https://via.placeholder.com/100';



  const flatListRef = useRef(null);

  const feedImages = [
    {
      id: '1',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwH4dmberk7y0YX9X9hBgokmG2UFNstAStA&s',
    },
    {
      id: '2',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwH4dmberk7y0YX9X9hBgokmG2UFNstAStA&s',
    },
    {
      id: '3',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwH4dmberk7y0YX9X9hBgokmG2UFNstAStA&s',
    },
    {
      id: '4',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwH4dmberk7y0YX9X9hBgokmG2UFNstAStA&s',
    },
  ];

  const storeItems = [
    {
      id: '1',
      title: 'Receita de Abelha Simples',
      price: 'R$10,00',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwH4dmberk7y0YX9X9hBgokmG2UFNstAStA&s',
    },
    {
      id: '2',
      title: 'Receita Abelha com Flores',
      price: 'R$15,00',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwH4dmberk7y0YX9X9hBgokmG2UFNstAStA&s',
    },
    {
      id: '3',
      title: 'Receita Abelha Porta-Chave',
      price: 'R$12,00',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwH4dmberk7y0YX9X9hBgokmG2UFNstAStA&s',
    },
  ];

  const renderGrid = () => (
    <FlatList
      data={feedImages}
      numColumns={3}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Image source={{ uri: item.image }} style={styles.gridImage} />
      )}
      contentContainerStyle={{ paddingBottom: 70 }}
    />
  );

  const renderStore = () => (
    <FlatList
      data={storeItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Image source={{ uri: item.image }} style={styles.listImage} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.listTitle}>{item.title}</Text>
            <Text style={styles.listPrice}>{item.price}</Text>
          </View>
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 70 }}
    />
  );

  const tabs = ['grid', 'store'];

  const changeTab = (index) => {
    setActiveTab(index);
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index });
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile */}
      <View style={styles.profileContainer}>
      <Image
  source={{ uri: profilePic.startsWith('data:image') ? profilePic : `data:image/png;base64,${profilePic}` }}
  style={styles.profilePic}
/>

        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.profileName}>{usuario.nome}</Text>
          <Text style={styles.profileUser}>@{usuario.username}</Text>
          <Text style={styles.profileName}>{usuario.bio}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('edit')}
        >
          <Ionicons name="pencil" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Seguidores */}
      <View style={styles.followContainer}>
        <View style={styles.followBox}>
          <Ionicons name="person" size={18} color="#000" />
          <Text>1</Text>
          <Text>Seguidores</Text>
        </View>
        <View style={styles.followBox}>
          <Ionicons name="heart" size={18} color="#000" />
          <Text>1</Text>
          <Text>Seguindo</Text>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => changeTab(0)}>
          <Ionicons
            name="grid-outline"
            size={28}
            color={activeTab === 0 ? '#a33' : '#555'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeTab(1)}>
          <Ionicons
            name="cart"
            size={28}
            color={activeTab === 1 ? '#a33' : '#555'}
          />
        </TouchableOpacity>
      </View>

      {/* Carrossel com grid e loja */}
      <FlatList
        ref={flatListRef}
        data={tabs}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ width: width, flex: 1 }}>
            {item === 'grid' ? renderGrid() : renderStore()}
          </View>
        )}
        keyExtractor={(item) => item}
      />

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5e8da' },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5e8da',
  },
  profilePic: { width: 100, height: 100, borderRadius: 100 },
  profileName: { fontWeight: 'bold', fontSize: 16 },
  profileUser: { color: '#555' },
  editButton: {
    backgroundColor: '#a33',
    padding: 8,
    borderRadius: 20,
  },
  followContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  followBox: { alignItems: 'center' },
  gridImage: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
    borderRadius: 3,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#a33',
  },
  listImage: { width: 160, height: 160, borderRadius: 8 },
  listTitle: { fontSize: 14, fontWeight: 'bold' },
  listPrice: { color: '#333', marginTop: 5 },
  bottomNav: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f5e8da',
  },
});
