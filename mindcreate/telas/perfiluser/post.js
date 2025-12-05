// PostDetail.js - VERSÃO FINAL CORRIGIDA
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Dimensions,
  Image,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useApp } from '../../context/AuthContext';
import { 
  getPostById, 
  addComment, 
  likePost, 
  unlikePost,
  deletePost, // Certifique-se que esta função existe
} from '../../funções/funcaopost';
import PostCard from '../../funções/postcard';
import CommentItem from '../../funções/commentItem';

const { width, height } = Dimensions.get('window');

const PostDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { usuario } = useApp();
  
  // Receber parâmetros
  const { postId, fromScreen, userId } = route.params || {};
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [comments, setComments] = useState([]);

  // Função para voltar para a tela correta
  const handleGoBack = () => {
    if (fromScreen === 'ProfileScreen') {
      // Se veio do perfil, voltar para o perfil
      navigation.navigate('Profile');
    } else if (fromScreen === 'OtherProfile' && userId) {
      // Se veio de outro perfil, voltar para lá
      navigation.navigate('OtherProfile', { userId });
    } else {
      // Caso padrão: voltar normalmente
      navigation.goBack();
    }
  };

  // Carregar post e comentários
  const loadPostData = useCallback(async () => {
    try {
      if (!postId) {
        Alert.alert('Erro', 'ID do post não encontrado');
        handleGoBack();
        return;
      }

      setLoading(true);
      const postData = await getPostById(postId);
      
      if (postData) {
        setPost(postData);
        
        // Carregar comentários
        const postComments = postData.comments || [];
        // Ordenar comentários: mais recentes primeiro
        const sortedComments = [...postComments].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComments(sortedComments);
      } else {
        Alert.alert('Erro', 'Post não encontrado');
        handleGoBack();
      }
    } catch (error) {
      console.error('Erro ao carregar post:', error);
      Alert.alert('Erro', 'Não foi possível carregar o post');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [postId]);

  // Atualizar ao focar na tela
  useFocusEffect(
    useCallback(() => {
      loadPostData();
    }, [loadPostData])
  );

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPostData();
  }, [loadPostData]);

  // Curtir/Descurtir
  const handleLike = async () => {
    if (!post || !usuario) return;
    
    try {
      const wasLiked = post.likedBy?.includes(usuario.uid);
      
      if (wasLiked) {
        await unlikePost(post.id, usuario.uid);
        setPost(prev => ({
          ...prev,
          likes: prev.likes - 1,
          likedBy: prev.likedBy.filter(id => id !== usuario.uid)
        }));
      } else {
        await likePost(post.id, usuario.uid);
        setPost(prev => ({
          ...prev,
          likes: prev.likes + 1,
          likedBy: [...(prev.likedBy || []), usuario.uid]
        }));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível processar sua ação');
    }
  };

  // Adicionar comentário
  const handleAddComment = async () => {
    if (!commentText.trim() || !usuario || !post) return;
    
    try {
      setSendingComment(true);
      
      const commentData = {
        userId: usuario.uid,
        userName: usuario.nome || 'Usuário',
        userImage: usuario.imagem || '',
        text: commentText.trim(),
        createdAt: new Date(),
      };
      
      const newComment = await addComment(postId, commentData);
      
      // Adicionar comentário localmente (no início da lista)
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
      
      // Atualizar contador de comentários no post
      setPost(prev => ({
        ...prev,
        comments: [newComment, ...(prev.comments || [])]
      }));
      
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o comentário');
    } finally {
      setSendingComment(false);
    }
  };

  // Navegar para perfil do usuário - CORRIGIDO
  const handleProfilePress = (userIdToNavigate) => {
    console.log('Navegando para perfil do usuário:', userIdToNavigate);
    
    if (userIdToNavigate === usuario?.uid) {
      // É o próprio usuário
      navigation.navigate('Perfilscreen');
    } else {
      // É outro usuário
      navigation.navigate('Perfilscreen', { 
        userId: userIdToNavigate,
        fromScreen: 'PostDetail',
        postId // Manter postId para possível volta
      });
    }
  };

  // Deletar post
  const handleDeletePost = async (postIdToDelete) => {
    try {
      Alert.alert(
        'Excluir Publicação',
        'Tem certeza que deseja excluir esta publicação? Esta ação não pode ser desfeita.',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
              await deletePost(postIdToDelete);
              Alert.alert('Sucesso', 'Publicação excluída com sucesso');
              handleGoBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      Alert.alert('Erro', 'Não foi possível excluir a publicação');
    }
  };

  // Compartilhar post
  const handleSharePost = async (postToShare) => {
    try {
      const shareContent = {
        message: `Confira esta publicação de ${postToShare.userName}: "${postToShare.caption || 'Veja esta imagem!'}"`,
        title: 'Compartilhar publicação',
      };
      
      await Share.share(shareContent);
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  // Formatar número de comentários
  const formatCommentCount = (count) => {
    if (count === 0) return 'Sem comentários';
    if (count === 1) return '1 comentário';
    return `${count} comentários`;
  };

  // Renderizar item de comentário
  const renderCommentItem = ({ item, index }) => (
    <CommentItem 
      comment={item}
      onProfilePress={() => handleProfilePress(item.userId)}
      isLastItem={index === comments.length - 1}
    />
  );

  // Loading
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B0000" />
          <Text style={styles.loadingText}>Carregando publicação...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#8B0000" />
          <Text style={styles.errorTitle}>Post não encontrado</Text>
          <Text style={styles.errorSubtitle}>Esta publicação pode ter sido removida</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Ionicons name="arrow-back" size={20} color="#FFF" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButtonHeader}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#8B0000" />
          <Text style={styles.backButtonLabel}>
            {fromScreen === 'ProfileScreen' ? 'Perfil' : 
             fromScreen === 'OtherProfile' ? 'Perfil' : 'Voltar'}
          </Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Publicação</Text>
          <Text style={styles.headerSubtitle}>Detalhes</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Conteúdo Principal */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
      >
        <View style={styles.contentContainer}>
          {/* Seção do Post */}
          <View style={styles.postSection}>
            <PostCard
              post={post}
              currentUserId={usuario?.uid}
              onPressProfile={handleProfilePress}
              showFullCaption={true}
              isDetailScreen={true}
              onLikePress={handleLike}
              onDeletePost={handleDeletePost}
              onSharePost={handleSharePost}
            />
          </View>

          {/* Separador */}
          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>
              {formatCommentCount(comments.length)}
            </Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Lista de Comentários */}
          <FlatList
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
            contentContainerStyle={styles.commentsList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#8B0000']}
                tintColor="#8B0000"
              />
            }
            ListEmptyComponent={
              <View style={styles.noCommentsContainer}>
                <Ionicons name="chatbubble-ellipses-outline" size={64} color="#E0E0E0" />
                <Text style={styles.noCommentsTitle}>Nenhum comentário ainda</Text>
                <Text style={styles.noCommentsSubtitle}>
                  Seja o primeiro a comentar esta publicação!
                </Text>
              </View>
            }
            ListFooterComponent={<View style={styles.listFooter} />}
          />

          {/* Input de Comentário */}
          <View style={styles.commentInputWrapper}>
            <View style={styles.commentInputContainer}>
              <Image
                source={{
                  uri: usuario?.imagem 
                    ? (usuario.imagem.startsWith('/9j/') 
                        ? `data:image/jpeg;base64,${usuario.imagem}`
                        : usuario.imagem)
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario?.nome || 'U')}&background=8B0000&color=fff&bold=true`
                }}
                style={styles.userCommentImage}
              />
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Adicione um comentário..."
                  placeholderTextColor="#999"
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  maxLength={500}
                  editable={!sendingComment}
                />
                <View style={styles.inputBottom}>
                  <Text style={styles.charCount}>
                    {commentText.length}/500
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.sendButton,
                      (!commentText.trim() || sendingComment) && styles.sendButtonDisabled
                    ]}
                    onPress={handleAddComment}
                    disabled={!commentText.trim() || sendingComment}
                    activeOpacity={0.7}
                  >
                    {sendingComment ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <>
                        <Ionicons name="send" size={18} color="#FFF" />
                        <Text style={styles.sendButtonText}>Enviar</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8B0000',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#FFF',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B0000',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B0000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  keyboardAvoid: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButtonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFF0F0',
    gap: 4,
  },
  backButtonLabel: {
    fontSize: 14,
    color: '#8B0000',
    fontWeight: '500',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  postSection: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  separatorText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#8B0000',
    fontWeight: '600',
  },
  commentsList: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  noCommentsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  noCommentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  noCommentsSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  listFooter: {
    height: 20,
  },
  commentInputWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  userCommentImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
  },
  inputWrapper: {
    flex: 1,
  },
  commentInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  inputBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B0000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PostDetail;