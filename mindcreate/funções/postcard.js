// PostCard.js - Corrigido
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const PostCard = ({ 
  post, 
  currentUserId, 
  onPressProfile,
  onPressPost,
  showFullCaption = false,
  isDetailScreen = false,
  onLikePress,
  onDeletePost,
  onSharePost,
}) => {
  const [liked, setLiked] = useState(post.likedBy?.includes(currentUserId) || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  const shouldShowLike = currentUserId && currentUserId !== post.userId;

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Agora mesmo';
      if (diffMins < 60) return `há ${diffMins}min`;
      if (diffHours < 24) return `há ${diffHours}h`;
      if (diffDays < 7) return `há ${diffDays}d`;
      
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      });
    } catch (error) {
      return '';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getImageUri = (base64String) => {
    if (!base64String) return null;
    
    if (base64String.startsWith('data:image')) {
      return base64String;
    }
    
    if (base64String.startsWith('/9j/') || base64String.startsWith('iVBORw0KGgo')) {
      return `data:image/jpeg;base64,${base64String}`;
    }
    
    return base64String;
  };

  // Imagem do usuário
  const userImageUri = getImageUri(post.userImage) || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName || 'U')}&background=8B0000&color=fff&bold=true`;

  // Imagem do post
  const postImageUri = getImageUri(post.imageBase64) || 
    getImageUri(post.image) || 
    'https://via.placeholder.com/400x400/f8f8f8/8B0000?text=Imagem';

  // Handle like
  const handleLike = () => {
    if (!currentUserId) {
      Alert.alert('Atenção', 'Faça login para curtir posts');
      return;
    }
    
    if (!shouldShowLike) return;
    
    if (onLikePress) {
      onLikePress();
      if (liked) {
        setLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        setLiked(true);
        setLikeCount(prev => prev + 1);
      }
      return;
    }
    
    if (liked) {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  // Handle press no perfil
  const handlePressProfile = () => {
    if (onPressProfile && post.userId) {
      onPressProfile(post.userId); // Passa o userId corretamente
    }
  };

  // Handle press no post
  const handlePressPost = () => {
    if (onPressPost && !isDetailScreen) {
      onPressPost(post.id);
    }
  };

  // Handle 3 pontos (opções)
  const handleOptions = () => {
    if (!currentUserId) return;
    
    if (currentUserId === post.userId) {
      // É dono do post - mostrar opções de dono
      Alert.alert(
        'Opções',
        'O que você gostaria de fazer?',
        [
          {
            text: 'Excluir Post',
            style: 'destructive',
            onPress: () => {
              if (onDeletePost) {
                Alert.alert(
                  'Excluir Post',
                  'Tem certeza que deseja excluir esta publicação?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { 
                      text: 'Excluir', 
                      style: 'destructive',
                      onPress: () => onDeletePost(post.id)
                    }
                  ]
                );
              }
            }
          },
          { 
            text: 'Editar Post', 
            onPress: () => {
              Alert.alert('Editar', 'Funcionalidade em desenvolvimento');
            }
          },
          {
            text: 'Compartilhar',
            onPress: () => {
              if (onSharePost) onSharePost(post);
            }
          },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    } else {
      // É outro usuário - mostrar opções básicas
      Alert.alert(
        'Opções',
        'O que você gostaria de fazer?',
        [
          {
            text: 'Denunciar',
            style: 'destructive',
            onPress: () => Alert.alert('Denunciar', 'Post reportado')
          },
          {
            text: 'Compartilhar',
            onPress: () => {
              if (onSharePost) onSharePost(post);
            }
          },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    }
  };

  return (
    <View style={[styles.container, isDetailScreen && styles.detailContainer]}>
      {/* HEADER - Foto e nome do usuário */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={handlePressProfile} // Agora chama a função correta
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: userImageUri }}
            style={styles.profileImage}
          />
          <View style={styles.userTextContainer}>
            <Text style={styles.userName} numberOfLines={1}>
              {post.userName || 'Usuário'}
            </Text>
            <View style={styles.userMetaContainer}>
              {post.userUsername && (
                <Text style={styles.userUsername} numberOfLines={1}>
                  @{post.userUsername}
                </Text>
              )}
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.postDate}>
                {formatDate(post.createdAt)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Botão de 3 pontos - SEMPRE visível */}
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={handleOptions}
          disabled={!currentUserId}
        >
          <Ionicons 
            name="ellipsis-horizontal" 
            size={24} 
            color={currentUserId ? "#666" : "#CCC"} 
          />
        </TouchableOpacity>
      </View>

      {/* IMAGEM DO POST */}
      <TouchableOpacity 
        onPress={handlePressPost}
        activeOpacity={isDetailScreen ? 1 : 0.9}
        disabled={isDetailScreen}
      >
        <Image
          source={{ uri: postImageUri }}
          style={[
            styles.postImage,
            { height: isDetailScreen ? width * 0.85 : width * 0.75 }
          ]}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* AÇÕES */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity 
            onPress={handleLike} 
            style={styles.actionButton}
            disabled={!shouldShowLike}
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={26}
              color={liked ? "#FF3040" : shouldShowLike ? "#333" : "#CCC"}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handlePressPost}
            style={styles.actionButton}
            disabled={!currentUserId}
          >
            <Ionicons 
              name="chatbubble-outline" 
              size={24} 
              color={currentUserId ? "#333" : "#CCC"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onSharePost && onSharePost(post)}
            disabled={!currentUserId}
          >
            <Ionicons 
              name="paper-plane-outline" 
              size={24} 
              color={currentUserId ? "#333" : "#CCC"} 
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.actionButton}
          disabled={!currentUserId}
        >
          <Ionicons 
            name="bookmark-outline" 
            size={24} 
            color={currentUserId ? "#333" : "#CCC"} 
          />
        </TouchableOpacity>
      </View>

      {/* CONTEÚDO */}
      <View style={styles.content}>
        {likeCount > 0 && (
          <View style={styles.likesContainer}>
            <Ionicons name="heart" size={14} color="#FF3040" />
            <Text style={styles.likeCount}>
              <Text style={styles.likeCountBold}>{formatNumber(likeCount)}</Text>
              {likeCount === 1 ? ' curtida' : ' curtidas'}
            </Text>
          </View>
        )}
        
        <View style={styles.captionContainer}>
          <TouchableOpacity 
            onPress={handlePressProfile}
            activeOpacity={0.7}
          >
            <Text style={styles.userNameInline}>
              {post.userName || 'Usuário'}
            </Text>
          </TouchableOpacity>
          <Text 
            style={styles.caption}
            numberOfLines={showFullCaption ? undefined : 2}
          >
            {post.caption ? ` ${post.caption}` : ''}
          </Text>
        </View>

        {post.tags && post.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {Array.isArray(post.tags) ? (
              post.tags.map((tag, index) => (
                <TouchableOpacity key={index}>
                  <Text style={styles.tag}>#{tag.trim()}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity>
                <Text style={styles.tag}>#{post.tags}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {post.location && (
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.location} numberOfLines={1}>
              {post.location}
            </Text>
          </View>
        )}

        {!isDetailScreen && post.comments && post.comments.length > 0 && (
          <TouchableOpacity 
            onPress={handlePressPost}
            style={styles.commentsPreview}
          >
            <Text style={styles.viewComments}>
              Ver todos os {post.comments.length} comentário{post.comments.length !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        )}
        
        {!isDetailScreen && currentUserId && (
          <TouchableOpacity 
            style={styles.addCommentPreview}
            onPress={handlePressPost}
          >
            <Text style={styles.addCommentText}>
              Adicionar comentário...
            </Text>
          </TouchableOpacity>
        )}
        
        <Text style={styles.postDateBottom}>
          {post.createdAt && formatDate(post.createdAt)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailContainer: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontWeight: '700',
    fontSize: 15,
    color: '#262626',
    marginBottom: 2,
  },
  userMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userUsername: {
    fontSize: 13,
    color: '#8B0000',
    fontWeight: '500',
  },
  dotSeparator: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 4,
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
  moreButton: {
    padding: 4,
  },
  postImage: {
    width: '100%',
    backgroundColor: '#F8F8F8',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 16,
    padding: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  likeCount: {
    fontSize: 14,
    color: '#262626',
    marginLeft: 6,
  },
  likeCountBold: {
    fontWeight: '700',
  },
  captionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  userNameInline: {
    fontWeight: '700',
    fontSize: 14,
    color: '#262626',
    marginRight: 4,
  },
  caption: {
    fontSize: 14,
    color: '#262626',
    flex: 1,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    fontSize: 14,
    color: '#00376B',
    marginRight: 8,
    marginBottom: 4,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  commentsPreview: {
    marginBottom: 8,
  },
  viewComments: {
    fontSize: 14,
    color: '#666',
  },
  addCommentPreview: {
    marginBottom: 12,
  },
  addCommentText: {
    fontSize: 14,
    color: '#999',
  },
  postDateBottom: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default PostCard;