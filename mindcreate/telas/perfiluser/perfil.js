import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity, FlatList,
  Dimensions, Modal, TextInput, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/authcontext'; 
import { 
  savePostToFirestore, 
  getPostsByUsuario, 
  getUserById,
  pickAndCompressImage,
  validateImageSize
} from '../../funções/perfilfunc';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation, route }) {
  const { usuario } = useApp(); 
  
  // Estados
  const [viewedUserId, setViewedUserId] = useState('');
  const [isUserReady, setIsUserReady] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [viewedUser, setViewedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estado do post
  const [postData, setPostData] = useState({
    image: null,
    caption: '',
    location: '',
    tags: '',
  });

  const flatListRef = useRef(null);
  const isOwnProfile = !route.params?.userId || route.params.userId === usuario?.uid;

  // 🔄 Effect para carregar usuário
  useEffect(() => {
    console.log('👤 Estado do usuario:', usuario ? 'Carregado' : 'Carregando...');
    console.log(usuario.imagem) // undefined
;
    if (usuario?.uid) {
      const newViewedUserId = route.params?.userId || usuario.uid;
      setViewedUserId(newViewedUserId);
      setIsUserReady(true);
      console.log('✅ Usuario carregado, viewedUserId:', newViewedUserId);
    } else if (usuario === null) {
      console.log('❌ Usuario não autenticado');
      setIsUserReady(true);
    }
  }, [usuario, route.params?.userId]);

  // 🔄 Effect para buscar dados
  useEffect(() => {
    if (!isUserReady || !viewedUserId) return;

    console.log('🔄 Buscando dados para:', viewedUserId);
    
    if (!isOwnProfile) {
      loadOtherUserData();
    } else {
      setViewedUser(usuario);
      loadPosts();
    }
  }, [isUserReady, viewedUserId, isOwnProfile]);

  // 📥 Carregar dados de outro usuário
  const loadOtherUserData = async () => {
    try {
      setLoading(true);
      const userData = await getUserById(viewedUserId);
      if (userData) {
        setViewedUser(userData);
        await loadPosts();
      } else {
        Alert.alert('Erro', 'Usuário não encontrado');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o perfil');
    } finally {
      setLoading(false);
    }
  };

  // 📥 Carregar posts
  const loadPosts = async () => {
    try {
      const userPosts = await getPostsByUsuario(viewedUserId);
      setPosts(userPosts);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🖼️ Selecionar imagem
  const handlePickImage = async () => {
    try {
      setCompressing(true);
      const compressedImage = await pickAndCompressImage();
      
      if (compressedImage) {
        if (compressedImage.warning) {
          Alert.alert(
            '⚠️ Imagem muito grande',
            `Mesmo com compressão máxima, a imagem tem ${compressedImage.sizeKB.toFixed(0)}KB.`,
            [{ text: 'Usar assim mesmo' }, { text: 'Escolher outra', style: 'cancel' }]
          );
        }

        setPostData(prev => ({
          ...prev,
          image: {
            uri: compressedImage.uri,
            base64: compressedImage.base64,
            sizeKB: compressedImage.sizeKB,
            quality: compressedImage.quality
          }
        }));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível processar a imagem.');
    } finally {
      setCompressing(false);
    }
  };

  // 📤 Criar post
  const handleCreatePost = async () => {
    if (!postData.image) {
      Alert.alert('Atenção', 'Selecione uma imagem para publicar.');
      return;
    }

    const validation = validateImageSize(postData.image.base64);
    
    if (!validation.isValid) {
      Alert.alert('❌ Imagem muito grande', validation.message);
      return;
    }

    if (validation.needsConfirmation) {
      Alert.alert(
        '⚠️ Atenção',
        validation.message,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar', onPress: proceedWithUpload }
        ]
      );
    } else {
      proceedWithUpload();
    }
  };

  // ⬆️ Fazer upload
  const proceedWithUpload = async () => {
    setUploading(true);

    try {
      const newPost = await savePostToFirestore(postData, usuario);
      setPosts(prev => [newPost, ...prev]);
      
      setPostData({ image: null, caption: '', location: '', tags: '' });
      setModalVisible(false);
      Alert.alert('🎉 Sucesso!', 'Post criado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao criar post:', error);
      Alert.alert('Erro', error.message.includes('CRÍTICO') 
        ? 'A imagem é muito grande. Selecione uma imagem menor.'
        : 'Não foi possível criar o post.'
      );
    } finally {
      setUploading(false);
    }
  };

  const changeTab = (index) => {
    setActiveTab(index);
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index });
    }
  };
  
const renderGrid = () => (
  <FlatList
    data={posts}
    numColumns={3}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={styles.gridItem}>
        <TouchableOpacity 
          onPress={() => console.log('Abrir post:', item.id)}
          activeOpacity={0.7}
        >
          <Image 
            source={{ uri: item.image }} 
            style={styles.gridImage} 
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    )}
    contentContainerStyle={styles.gridContainer}
    showsVerticalScrollIndicator={false}
    ListEmptyComponent={
      <View style={styles.emptyContainer}>
        <Ionicons name="images-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>
          {isOwnProfile ? 'Você ainda não tem publicações' : 'Este usuário ainda não tem publicações'}
        </Text>
        {isOwnProfile && (
          <Text style={styles.emptySubtext}>
            Toque no botão + para criar sua primeira publicação!
          </Text>
        )}
      </View>
    }
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

const getProfileImageUrl = () => {
  const user = isOwnProfile ? usuario : viewedUser;

  if (!user) return 'https://via.placeholder.com/100';

  // Se for base64
  if (user.imagem && user.imagem.startsWith('/9j/')) { // exemplo de base64 JPEG
    return `data:image/jpeg;base64,${user.imagem}`;
  }
  if (user.imagemPerfil && user.imagemPerfil.startsWith('/9j/')) {
    return `data:image/jpeg;base64,${user.imagemPerfil}`;
  }

  // Caso seja URL normal
  return user.imagem || user.imagemPerfil || user.userImage || 
         user.profileImage || user.photoURL || 'https://via.placeholder.com/100';
};

  // ⏳ Estados de carregamento
  if (!isUserReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
        <Text style={styles.loadingText}>Usuário não autenticado</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={{color: '#fff'}}>Fazer Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!viewedUserId || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileContainer}>
        <Image
          source={{ 
            uri: getProfileImageUrl()
          }}
          style={styles.profilePic}
        />
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.profileName}>
            {isOwnProfile ? usuario.nome : viewedUser?.nome}
          </Text>
          <Text style={styles.profileUser}>
            @{isOwnProfile ? usuario.username : viewedUser?.username}
          </Text>
          <Text style={styles.profileBio}>
            {isOwnProfile ? usuario.bio : viewedUser?.bio}
          </Text>
        </View>
        
        {isOwnProfile ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('edit')}
          >
            <Ionicons name="pencil" size={18} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.followButton}
            onPress={() => Alert.alert('Seguir', `Seguir ${viewedUser?.nome}`)}
          >
            <Text style={styles.followButtonText}>Seguir</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Seguidores */}
      <View style={styles.followContainer}>
        <View style={styles.followBox}>
          <Ionicons name="person" size={18} color="#8B0000" />
          <Text style={styles.followCount}>{isOwnProfile ? '1' : viewedUser?.followersCount || '0'}</Text>
          <Text style={styles.followLabel}>Seguidores</Text>
        </View>
        <View style={styles.followBox}>
          <Ionicons name="heart" size={18} color="#8B0000" />
          <Text style={styles.followCount}>{isOwnProfile ? '1' : viewedUser?.followingCount || '0'}</Text>
          <Text style={styles.followLabel}>Seguindo</Text>
        </View>
        <View style={styles.followBox}>
          <Ionicons name="images" size={18} color="#8B0000" />
          <Text style={styles.followCount}>{posts.length}</Text>
          <Text style={styles.followLabel}>Publicações</Text>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => changeTab(0)}
        >
          <Ionicons
            name="grid-outline"
            size={28}
            color={activeTab === 0 ? '#8B0000' : '#555'}
          />
          <Text style={[styles.tabText, activeTab === 0 && styles.tabTextActive]}>
            Publicações
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => changeTab(1)}
        >
          <Ionicons
            name="cart"
            size={28}
            color={activeTab === 1 ? '#8B0000' : '#555'}
          />
          <Text style={[styles.tabText, activeTab === 1 && styles.tabTextActive]}>
            Loja
          </Text>
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

      {/* Botão de criar post APENAS no próprio perfil */}
      {isOwnProfile && (
        <TouchableOpacity
          style={styles.createPostButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Modal de criar post APENAS no próprio perfil */}
      {isOwnProfile && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Header do modal */}
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setModalVisible(false)}
                  style={styles.modalCloseButton}
                  disabled={uploading}
                >
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Criar Publicação</Text>
                <TouchableOpacity 
                  onPress={handleCreatePost}
                  style={styles.modalShareButton}
                  disabled={uploading || !postData.image}
                >
                  {uploading ? (
                    <ActivityIndicator size="small" color="#8B0000" />
                  ) : (
                    <Text style={[styles.shareButtonText, !postData.image && styles.disabledButton]}>
                      Publicar
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* Upload de imagem */}
                <TouchableOpacity 
                  style={styles.imageUpload}
                  onPress={handlePickImage}
                  disabled={uploading || compressing}
                >
                  {compressing ? (
                    <View style={styles.compressingContainer}>
                      <ActivityIndicator size="large" color="#8B0000" />
                      <Text style={styles.compressingText}>Comprimindo imagem...</Text>
                    </View>
                  ) : postData.image ? (
                    <View style={styles.selectedImageContainer}>
                      <Image 
                        source={{ uri: postData.image.uri }} 
                        style={styles.selectedImage}
                      />
                      <View style={styles.imageInfo}>
                        <Text style={styles.imageSize}>
                          📏 {postData.image.sizeKB.toFixed(0)}KB
                        </Text>
                        <Text style={[
                          styles.imageQuality,
                          postData.image.sizeKB < 300 ? styles.qualityGood : 
                          postData.image.sizeKB < 500 ? styles.qualityMedium : 
                          styles.qualityLow
                        ]}>
                          {postData.image.sizeKB < 300 ? '✅ Ótima qualidade' : 
                           postData.image.sizeKB < 500 ? '⚠️ Qualidade boa' : 
                           '🔴 Qualidade aceitável'}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <Ionicons name="camera" size={50} color="#ccc" />
                      <Text style={styles.uploadText}>Selecionar imagem</Text>
                      <Text style={styles.uploadHint}>Compressão automática ativada</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Legenda */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Legenda</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Escreva uma legenda..."
                    multiline
                    numberOfLines={3}
                    value={postData.caption}
                    onChangeText={(text) => setPostData({...postData, caption: text})}
                    editable={!uploading}
                    maxLength={150}
                  />
                  <Text style={styles.charCount}>
                    {postData.caption.length}/150 caracteres
                  </Text>
                </View>

                {/* Localização */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Localização (opcional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Onde foi tirada esta foto?"
                    value={postData.location}
                    onChangeText={(text) => setPostData({...postData, location: text})}
                    editable={!uploading}
                    maxLength={50}
                  />
                </View>

                {/* Tags */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Tags (opcional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="tags, separadas, por, vírgula"
                    value={postData.tags}
                    onChangeText={(text) => setPostData({...postData, tags: text})}
                    editable={!uploading}
                  />
                </View>

                {/* Dica de compressão */}
                <View style={styles.tipContainer}>
                  <Ionicons name="information-circle" size={20} color="#8B0000" />
                  <Text style={styles.tipText}>
                    Suas imagens são comprimidas automaticamente para economizar espaço!
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

// Dados mockados da loja
const storeItems = [
  {
    id: '1',
    title: 'Receita de Abelha Simples',
    price: 'R$10,00',
    image: 'https://via.placeholder.com/160',
  },
  {
    id: '2',
    title: 'Receita Abelha com Flores',
    price: 'R$15,00',
    image: 'https://via.placeholder.com/160',
  }
];
const tabs = ['grid', 'store'];

const styles = StyleSheet.create({
  // ==================== CONTAINER PRINCIPAL ====================
  container: { 
    flex: 1, 
    backgroundColor: '#fff5e6' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5e6',
  },
  loadingText: {
    marginTop: 10,
    color: '#8B0000',
    fontWeight: '600',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff5e6',
  },
  profilePic: { 
    width: 100, 
    height: 100, 
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#8B0000',
  },
  profileName: { 
    fontWeight: '800', 
    fontSize: 18,
    color: '#8B0000',
    marginBottom: 4,
  },
  profileUser: { 
    color: '#8B0000',
    fontWeight: '600',
    marginBottom: 6,
  },
  profileBio: { 
    color: '#8B0000', 
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#8B0000',
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  followButton: {
    backgroundColor: '#8B0000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },

  // ==================== SEÇÃO DE SEGUIDORES ====================
  followContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  followBox: { 
    alignItems: 'center' 
  },
  followCount: {
    fontWeight: '800',
    fontSize: 18,
    marginTop: 4,
    color: '#8B0000',
  },
  followLabel: {
    fontSize: 12,
    color: '#8B0000',
    fontWeight: '600',
  },

  // ==================== SEÇÃO DE GRID DE POSTS ====================
  gridContainer: {
    flexGrow: 1,
  },
  gridItem: {
    width: (width - 2) / 3,
    height: (width - 2) / 3,
    margin: 0.5,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: '#8B0000',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#8B0000',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '500',
  },

  // ==================== SEÇÃO DA LOJA ====================
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8B0000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listImage: { 
    width: 160, 
    height: 160, 
    borderRadius: 12 
  },
  listTitle: { 
    fontSize: 16, 
    fontWeight: '800',
    color: '#8B0000',
    marginBottom: 4,
  },
  listPrice: { 
    color: '#8B0000', 
    fontWeight: '700',
    fontSize: 18,
  },

  // ==================== NAVEGAÇÃO INFERIOR ====================
  bottomNav: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#8B0000',
    backgroundColor: '#fff',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#8B0000',
    marginTop: 4,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#8B0000',
    fontWeight: '800',
  },

  // ==================== BOTÃO CRIAR POST ====================
  createPostButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B0000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // ==================== MODAL CRIAR POST ====================
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#8B0000',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#8B0000',
  },
  modalShareButton: {
    padding: 4,
  },
  shareButtonText: {
    color: '#8B0000',
    fontWeight: '800',
    fontSize: 16,
  },
  disabledButton: {
    color: '#ccc',
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },

  // ==================== UPLOAD DE IMAGEM NO MODAL ====================
  imageUpload: {
    height: 220,
    borderWidth: 2,
    borderColor: '#8B0000',
    borderStyle: 'dashed',
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#fff5e6',
    overflow: 'hidden',
  },
  compressingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compressingText: {
    marginTop: 10,
    color: '#8B0000',
    fontWeight: '600',
  },
  selectedImageContainer: {
    flex: 1,
  },
  selectedImage: {
    width: '100%',
    height: '80%',
  },
  imageInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  imageSize: {
    fontSize: 14,
    color: '#8B0000',
    fontWeight: '700',
  },
  imageQuality: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  qualityGood: {
    color: '#4CAF50',
  },
  qualityMedium: {
    color: '#FF9800',
  },
  qualityLow: {
    color: '#F44336',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 10,
    color: '#8B0000',
    fontSize: 16,
    fontWeight: '700',
  },
  uploadHint: {
    marginTop: 5,
    color: '#8B0000',
    fontSize: 12,
    fontWeight: '500',
  },

  // ==================== FORMULÁRIO NO MODAL ====================
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontWeight: '800',
    marginBottom: 8,
    color: '#8B0000',
    fontSize: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: '#8B0000',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff5e6',
    color: '#8B0000',
    fontWeight: '600',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#8B0000',
    textAlign: 'right',
    marginTop: 4,
    fontWeight: '600',
  },

  // ==================== DICAS E INFORMAÇÕES ====================
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5e6',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8B0000',
    marginTop: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#8B0000',
    marginLeft: 8,
    flex: 1,
    fontWeight: '600',
  },
});