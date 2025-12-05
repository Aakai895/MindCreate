import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const CommentItem = ({ comment, onProfilePress }) => {
  // Formatar tempo relativo
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      const diffWeeks = Math.floor(diffMs / 604800000);
      
      if (diffMins < 1) return 'Agora';
      if (diffMins < 60) return `${diffMins} min`;
      if (diffHours < 24) return `${diffHours} h`;
      if (diffDays < 7) return `${diffDays} d`;
      if (diffWeeks < 4) return `${diffWeeks} sem`;
      
      // Mais de um mês, mostrar data
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      });
    } catch (error) {
      return '';
    }
  };

  // Tratar imagem base64
  const getImageUri = (base64String) => {
    if (!base64String) return null;
    
    // Se já começa com data:image, retorna direto
    if (base64String.startsWith('data:image')) {
      return base64String;
    }
    
    // Se for base64 puro, adiciona prefixo
    if (base64String.startsWith('/9j/') || base64String.startsWith('iVBORw0KGgo')) {
      return `data:image/jpeg;base64,${base64String}`;
    }
    
    // Se for URL normal
    return base64String;
  };

  // Imagem do usuário que comentou
  const userImageUri = getImageUri(comment.userImage) || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userName || 'U')}&background=8B0000&color=fff`;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => onProfilePress && onProfilePress(comment.userId)}
        style={styles.commentContent}
        activeOpacity={0.7}
      >
        {/* Foto do usuário */}
        <Image
          source={{ uri: userImageUri }}
          style={styles.userImage}
        />
        
        {/* Conteúdo do comentário */}
        <View style={styles.textContainer}>
          {/* Nome e texto */}
          <View style={styles.commentTextContainer}>
            <Text style={styles.userName}>
              {comment.userName || 'Usuário'}{' '}
            </Text>
            <Text style={styles.commentText}>
              {comment.text || ''}
            </Text>
          </View>
          
          {/* Rodapé (tempo e ações) */}
          <View style={styles.commentFooter}>
            <Text style={styles.commentTime}>
              {formatTime(comment.createdAt)}
            </Text>
            
            <View style={styles.commentActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>
                  Responder
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>
                  Curtir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
    backgroundColor: '#FFFFFF',
  },
  commentContent: {
    flexDirection: 'row',
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8B0000',
    marginRight: 12,
    backgroundColor: '#fff5e6',
  },
  textContainer: {
    flex: 1,
  },
  commentTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  userName: {
    fontWeight: '700',
    fontSize: 14,
    color: '#8B0000',
    marginRight: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 18,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 16,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
});

// Versão alternativa mais simples (sem ações)
export const SimpleCommentItem = ({ comment, onProfilePress }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      
      if (diffMins < 1) return 'Agora';
      if (diffMins < 60) return `${diffMins}m`;
      if (diffHours < 24) return `${diffHours}h`;
      return `${Math.floor(diffMs / 86400000)}d`;
    } catch (error) {
      return '';
    }
  };

  const getImageUri = (base64String) => {
    if (!base64String) return null;
    if (base64String.startsWith('data:image')) return base64String;
    if (base64String.startsWith('/9j/')) {
      return `data:image/jpeg;base64,${base64String}`;
    }
    return base64String;
  };

  const userImageUri = getImageUri(comment.userImage) || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userName || 'U')}&background=8B0000&color=fff`;

  return (
    <View style={simpleStyles.container}>
      <TouchableOpacity 
        onPress={() => onProfilePress && onProfilePress(comment.userId)}
        style={simpleStyles.content}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: userImageUri }}
          style={simpleStyles.userImage}
        />
        <View style={simpleStyles.textContent}>
          <Text style={simpleStyles.userName}>
            {comment.userName || 'Usuário'}
          </Text>
          <Text style={simpleStyles.commentText}>
            {comment.text || ''}
          </Text>
          <Text style={simpleStyles.time}>
            {formatTime(comment.createdAt)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const simpleStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexDirection: 'row',
  },
  userImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#8B0000',
    marginRight: 12,
    backgroundColor: '#fff5e6',
  },
  textContent: {
    flex: 1,
  },
  userName: {
    fontWeight: '700',
    fontSize: 14,
    color: '#8B0000',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
    marginBottom: 4,
  },
  time: {
    fontSize: 11,
    color: '#999',
  },
});

export default CommentItem;