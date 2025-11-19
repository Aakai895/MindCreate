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
        <TouchableOpacity onPress={() => console.log('Abrir post:', item.id)}>
          <Image source={{ uri: item.image }} style={styles.gridImage} />
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingBottom: 70 }}
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

  // ⏳ Estados de carregamento
  if (!isUserReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a33" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a33" />
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
        <ActivityIndicator size="large" color="#a33" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  // 🎯 RETURN PRINCIPAL - TODO O JSX AQUI
  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileContainer}>
        <Image
          source={{ 
            uri: isOwnProfile 
              ? (usuario?.imagem || 'https://via.placeholder.com/100')
              : (viewedUser?.imagem || 'https://via.placeholder.com/100')
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
          <Ionicons name="person" size={18} color="#000" />
          <Text style={styles.followCount}>{isOwnProfile ? '1' : viewedUser?.followersCount || '0'}</Text>
          <Text style={styles.followLabel}>Seguidores</Text>
        </View>
        <View style={styles.followBox}>
          <Ionicons name="heart" size={18} color="#000" />
          <Text style={styles.followCount}>{isOwnProfile ? '1' : viewedUser?.followingCount || '0'}</Text>
          <Text style={styles.followLabel}>Seguindo</Text>
        </View>
        <View style={styles.followBox}>
          <Ionicons name="images" size={18} color="#000" />
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
            color={activeTab === 0 ? '#a33' : '#555'}
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
            color={activeTab === 1 ? '#a33' : '#555'}
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
                    <ActivityIndicator size="small" color="#a33" />
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
                      <ActivityIndicator size="large" color="#a33" />
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
                  <Ionicons name="information-circle" size={20} color="#a33" />
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

const tabs = ['grid', 'store'];
 

// ESTILOS ORGANIZADOS POR SEÇÃO
const styles = StyleSheet.create({
  // ==================== CONTAINER PRINCIPAL ====================
  container: { 
    flex: 1, 
    backgroundColor: '#f5e8da' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5e8da',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },

  // ==================== SEÇÃO DE PERFIL ====================
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5e8da',
  },
  profilePic: { 
    width: 100, 
    height: 100, 
    borderRadius: 100 
  },
  profileName: { 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  profileUser: { 
    color: '#555' 
  },
  profileBio: { 
    color: '#666', 
    marginTop: 4 
  },
  editButton: {
    backgroundColor: '#a33',
    padding: 8,
    borderRadius: 20,
  },
  followButton: {
    backgroundColor: '#a33',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // ==================== SEÇÃO DE SEGUIDORES ====================
  followContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  followBox: { 
    alignItems: 'center' 
  },
  followCount: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 2,
  },
  followLabel: {
    fontSize: 12,
    color: '#666',
  },

  // ==================== SEÇÃO DE GRID DE POSTS ====================
  gridImage: {
    width: '33%',           // Ocupa 1/3 da largura (3 colunas)
    aspectRatio: 1,         // Mantém proporção quadrada
    margin: '0.15%',        // Margem mínima entre imagens
    borderRadius: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  emptySubtext: {
    color: '#a33',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },

  // ==================== SEÇÃO DA LOJA ====================
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#a33',
  },
  listImage: { 
    width: 160, 
    height: 160, 
    borderRadius: 8 
  },
  listTitle: { 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  listPrice: { 
    color: '#333', 
    marginTop: 5 
  },

  // ==================== NAVEGAÇÃO INFERIOR ====================
  bottomNav: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f5e8da',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  tabTextActive: {
    color: '#a33',
    fontWeight: 'bold',
  },

  // ==================== BOTÃO CRIAR POST ====================
  createPostButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#a33',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalShareButton: {
    padding: 4,
  },
  shareButtonText: {
    color: '#a33',
    fontWeight: 'bold',
  },
  disabledButton: {
    color: '#ccc',
  },
  modalBody: {
    flex: 1,
    padding: 16,
  },

  // ==================== UPLOAD DE IMAGEM NO MODAL ====================
  imageUpload: {
    height: 220,
    borderWidth: 2,
    borderColor: '#eee',
    borderStyle: 'dashed',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  compressingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compressingText: {
    marginTop: 10,
    color: '#666',
  },
  compressingSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
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
    color: '#666',
    fontWeight: 'bold',
  },
  imageQuality: {
    fontSize: 12,
    marginTop: 2,
  },
  imageStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  statusSafe: {
    color: '#4CAF50',
  },
  statusWarning: {
    color: '#FF9800',
  },
  statusDanger: {
    color: '#F44336',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  uploadHint: {
    marginTop: 5,
    color: '#999',
    fontSize: 12,
  },
  uploadSubHint: {
    marginTop: 2,
    color: '#a33',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // ==================== FORMULÁRIO NO MODAL ====================
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },

  // ==================== DICAS E INFORMAÇÕES ====================
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9f9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#a33',
    marginTop: 10,
  },
  tipContent: {
    flex: 1,
    marginLeft: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#a33',
    marginBottom: 2,
  },
  tipText: {
    fontSize: 12,
    color: '#666',
  },
});