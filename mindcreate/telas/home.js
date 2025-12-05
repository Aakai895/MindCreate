// Telainicial.js - VERSÃO SIMPLIFICADA
import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebase/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

const { width } = Dimensions.get('window');

export default function Telainicial({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [proj] = useState('31 de Agosto');
  const [image] = useState(
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwH4dmberk7y0YX9X9hBgokmG2UFNstAStA&s'
  );

  const title = 'Receita de Abelha Simples com Asas e Duas Listras Pretas';

  const projetosData = [
    { id: '1', title, image },
    { id: '2', title, image },
    { id: '3', title, image },
  ];

  // Função para buscar todos os posts
  const getAllPosts = async () => {
    try {
      console.log('🔄 Buscando posts do Firebase...');
      
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      
      const posts = querySnapshot.docs.map((doc) => { 
        const data = doc.data();
        
        return {
          id: doc.id,
          userId: data.userId || '',
          userName: data.userName || 'Usuário',
          userUsername: data.userUsername || '',
          userImage: data.userImage || '',
          
          image: data.imageBase64 ? `data:image/jpeg;base64,${data.imageBase64}` : 
                 data.image || 'https://via.placeholder.com/400x400/f8f8f8/8B0000?text=Imagem',
          
          caption: data.caption || '',
          location: data.location || '',
          tags: data.tags || [],
          likes: data.likes || 0,
          likedBy: data.likedBy || [],
          comments: data.comments || [],
          
          createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt) : new Date(),
        };
      });
      
      console.log(`✅ ${posts.length} posts carregados`);
      return posts;
      
    } catch (error) {
      console.error('❌ Erro ao buscar posts:', error);
      return [];
    }
  };

  // Carregar usuário atual
  const loadCurrentUser = async () => {
    try {
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        const usersRef = collection(db, 'usuario');
        const userQuery = query(usersRef, where('uid', '==', currentUser.uid));
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setUsuario({
            uid: currentUser.uid,
            nome: userData.nome || 'Usuário',
            imagem: userData.imagem || null,
          });
        } else {
          setUsuario({
            uid: currentUser.uid,
            nome: currentUser.displayName || 'Usuário',
            imagem: currentUser.photoURL || null,
          });
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar usuário:', error);
    }
  };

  // Carregar posts do banco de dados
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const allPosts = await getAllPosts();
      const shuffledPosts = [...allPosts].sort(() => Math.random() - 0.5);
      setPosts(shuffledPosts.slice(0, 10));
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Carregar dados inicialmente
  useEffect(() => {
    const initializeData = async () => {
      await loadCurrentUser();
      await loadPosts();
    };
    
    initializeData();
  }, []);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPosts();
  }, [loadPosts]);

  // Navegar para detalhes do post
  const handlePostPress = (postId) => {
    navigation.navigate('PostDetail', { 
      postId,
      fromScreen: 'Home' 
    });
  };

  // Navegar para criar novo post
  const handleCreatePost = () => {
    navigation.navigate('CriarPost');
  };

  // Navegar para perfil
  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  // Renderizar item de post
  const renderPostItem = ({ item, index }) => {
    const userImageUri = item.userImage 
      ? (item.userImage.startsWith('/9j/') 
          ? `data:image/jpeg;base64,${item.userImage}`
          : item.userImage.startsWith('data:image')
          ? item.userImage
          : item.userImage)
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.userName || 'U')}&background=8B0000&color=fff`;

    return (
      <TouchableOpacity 
        style={[styles.postCard, index % 2 === 0 ? styles.postCardEven : styles.postCardOdd]}
        onPress={() => handlePostPress(item.id)}
        activeOpacity={0.9}
      >
        <View style={styles.postHeader}>
          <TouchableOpacity 
            style={styles.postUserInfo}
            onPress={() => {
              if (item.userId) {
                navigation.navigate('OtherProfile', { userId: item.userId });
              }
            }}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: userImageUri }}
              style={styles.postProfileImage}
            />
            <View>
              <Text style={styles.postUserName} numberOfLines={1}>
                {item.userName || 'Usuário'}
              </Text>
              {item.userUsername && (
                <Text style={styles.postUserUsername} numberOfLines={1}>
                  @{item.userUsername}
                </Text>
              )}
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.postMoreButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#8B0000" />
          </TouchableOpacity>
        </View>

        <View style={styles.postImageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.postImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.postContent}>
          <View style={styles.postStats}>
            <View style={styles.postStat}>
              <Ionicons name="heart" size={16} color="#FF3040" />
              <Text style={styles.postStatText}>{item.likes || 0}</Text>
            </View>
            <View style={styles.postStat}>
              <Ionicons name="chatbubble" size={16} color="#8B0000" />
              <Text style={styles.postStatText}>{item.comments?.length || 0}</Text>
            </View>
          </View>

          <Text 
            style={styles.postCaption} 
            numberOfLines={2}
          >
            <Text style={styles.postCaptionUser}>
              {item.userName || 'Usuário'}{' '}
            </Text>
            {item.caption || ''}
          </Text>

          {item.tags && item.tags.length > 0 && (
            <View style={styles.postTags}>
              {Array.isArray(item.tags) ? (
                item.tags.slice(0, 3).map((tag, idx) => (
                  <Text key={idx} style={styles.postTag}>#{tag.trim()}</Text>
                ))
              ) : (
                <Text style={styles.postTag}>#{item.tags}</Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.main}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Olá, {usuario?.nome?.split(' ')[0] || 'Usuário'}!
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={handleProfilePress}
        >
          {usuario?.imagem ? (
            <Image
              source={{
                uri: usuario.imagem.startsWith('/9j/') 
                  ? `data:image/jpeg;base64,${usuario.imagem}`
                  : usuario.imagem
              }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Ionicons name="person" size={20} color="#8B0000" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#8B0000']}
            tintColor="#8B0000"
          />
        }
      >
        {/* Seção de Boas-vindas */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>BEM-VINDO! ✨</Text>
            
            <View style={styles.projectSection}>
              <Text style={styles.sectionTitle}>Próximo Projeto</Text>
              <View style={styles.projectBadge}>
                <Text style={styles.projectDate}>{proj}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Carrossel de Projetos */}
        <View style={styles.carouselSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Descubra mais projetos!</Text>
          </View>
          
          <FlatList
            data={projetosData}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            renderItem={({ item }) => (
              <View style={styles.carouselCard}>
                <View style={styles.carouselImageContainer}>
                  <Image style={styles.carouselImage} source={{ uri: item.image }} />
                </View>
                <Text style={styles.carouselTitle}>{item.title}</Text>
              </View>
            )}
          />
        </View>

        

        {/* Feed de Publicações */}
        <View style={styles.feedSection}>
          <View style={styles.feedHeader}>
            <Text style={styles.feedTitle}>Publicações Recentes</Text>
            <TouchableOpacity onPress={onRefresh}>
              <Ionicons name="refresh" size={22} color="#8B0000" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8B0000" />
              <Text style={styles.loadingText}>Carregando publicações...</Text>
            </View>
          ) : posts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="images-outline" size={64} color="#E0E0E0" />
              <Text style={styles.emptyTitle}>Nenhuma publicação ainda</Text>
              <Text style={styles.emptySubtitle}>
                Seja o primeiro a compartilhar algo!
              </Text>
            </View>
          ) : (
            <FlatList
              data={posts}
              renderItem={renderPostItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.feedList}
              ListFooterComponent={<View style={styles.feedFooter} />}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff5e6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#fff5e6',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  profileButton: {
    padding: 4,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#8B0000',
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8B0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  welcomeTitle: {
    color: '#333333',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  projectSection: {
    alignItems: 'center',
    width: '100%',
  },
  projectBadge: {
    marginTop: 8,
  },
  projectDate: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#8B0000',
    borderRadius: 4,
    textAlign: 'center',
  },
  carouselSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  carouselContent: {
    paddingBottom: 8,
  },
  carouselCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    width: width * 0.8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
  },
  carouselImageContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 4,
  },
  carouselImage: {
    width: 70,
    height: 70,
    marginRight: 12,
    borderRadius: 4,
    backgroundColor: '#F8F8F8',
  },
  carouselTitle: {
    color: '#333333',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  createPostButton: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  createPostButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B0000',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  createPostButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  feedSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedTitle: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666666',
    fontSize: 12,
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 16,
  },
  feedList: {
    paddingBottom: 8,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
  },
  postCardEven: {
    borderLeftWidth: 3,
    borderLeftColor: '#8B0000',
  },
  postCardOdd: {
    borderRightWidth: 3,
    borderRightColor: '#8B0000',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  postProfileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#8B0000',
  },
  postUserName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333333',
  },
  postUserUsername: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  postMoreButton: {
    padding: 4,
  },
  postImageContainer: {
    height: 180,
    backgroundColor: '#F8F8F8',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  postStats: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  postStatText: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 4,
    fontWeight: '500',
  },
  postCaption: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 8,
  },
  postCaptionUser: {
    fontWeight: '600',
    color: '#333333',
  },
  postTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  postTag: {
    fontSize: 12,
    color: '#333333',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    marginRight: 6,
    marginBottom: 4,
  },
  feedFooter: {
    height: 10,
  },
});