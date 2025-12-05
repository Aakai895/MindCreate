import { db } from '../firebase/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  arrayUnion,
  arrayRemove,
  increment,
  getDoc
} from 'firebase/firestore';

// Em ../../funções/funcaopost.js


// ========== FUNÇÕES DE POSTS ==========

// Criar novo post com Base64
export async function savePostToFirestore({
  userId,
  userName,
  userUsername,
  userImage,
  imageBase64,
  caption,
  location,
  tags
}) {
  try {
    const postsRef = collection(db, 'posts');
    const docRef = await addDoc(postsRef, {
      userId,
      userName,
      userUsername,
      userImage,
      imageBase64,
      caption,
      location,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: serverTimestamp()
    });
    
    console.log('✅ Post criado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Erro ao criar post:', error);
    throw error;
  }
}

// Buscar um post específico por ID (CORRIGIDA)
export async function getPostById(postId) {
  try {
    console.log('🔍 Buscando post ID:', postId);
    
    if (!postId) {
      throw new Error('ID do post não fornecido');
    }
    
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (postDoc.exists()) {
      const postData = postDoc.data();
      console.log('✅ Post encontrado:', postDoc.id);
      
      return {
        id: postDoc.id,
        ...postData,
        // Converter base64 para URI
        image: postData.imageBase64 ? `data:image/jpeg;base64,${postData.imageBase64}` : null,
        userImage: postData.userImage ? `data:image/jpeg;base64,${postData.userImage}` : null,
        // Garantir que arrays existam
        likedBy: postData.likedBy || [],
        comments: postData.comments || [],
        tags: postData.tags || []
      };
    } else {
      console.log('⚠️ Post não encontrado');
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao buscar post:', error);
    
    // Tentativa alternativa: buscar por query
    if (error.message.includes("doc doesn't exist")) {
      console.log('🔄 Tentando método alternativo...');
      return await getPostByIdAlternative(postId);
    }
    
    throw error;
  }
}

// Método alternativo para buscar post (se doc() não funcionar)
async function getPostByIdAlternative(postId) {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('__name__', '==', postId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const postDoc = querySnapshot.docs[0];
      const postData = postDoc.data();
      
      return {
        id: postDoc.id,
        ...postData,
        image: postData.imageBase64 ? `data:image/jpeg;base64,${postData.imageBase64}` : null,
        userImage: postData.userImage ? `data:image/jpeg;base64,${postData.userImage}` : null,
        likedBy: postData.likedBy || [],
        comments: postData.comments || [],
        tags: postData.tags || []
      };
    }
    return null;
  } catch (error) {
    console.error('❌ Erro no método alternativo:', error);
    throw error;
  }
}

// Buscar posts de um usuário
export async function getPostsByUsuario(userId) {
  try {
    console.log('🔍 Buscando posts do usuário:', userId);
    
    const postsRef = collection(db, 'posts');
    const q = query(
      postsRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map((doc) => ({ 
      id: doc.id,
      ...doc.data(),
      image: doc.data().imageBase64 ? `data:image/jpeg;base64,${doc.data().imageBase64}` : null,
      userImage: doc.data().userImage ? `data:image/jpeg;base64,${doc.data().userImage}` : null,
      likedBy: doc.data().likedBy || [],
      comments: doc.data().comments || [],
      tags: doc.data().tags || []
    }));
    
    console.log('📋 Posts encontrados:', posts.length);
    return posts;
  } catch (error) {
    console.error('❌ Erro ao buscar posts:', error);
    throw error;
  }
}

// Buscar todos os posts (para feed)
export async function getAllPosts() {
  try {
    console.log('🔍 Buscando todos os posts...');
    
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map((doc) => ({ 
      id: doc.id,
      ...doc.data(),
      image: doc.data().imageBase64 ? `data:image/jpeg;base64,${doc.data().imageBase64}` : null,
      userImage: doc.data().userImage ? `data:image/jpeg;base64,${doc.data().userImage}` : null,
      likedBy: doc.data().likedBy || [],
      comments: doc.data().comments || [],
      tags: doc.data().tags || []
    }));
    
    console.log('📋 Total de posts:', posts.length);
    return posts;
  } catch (error) {
    console.error('❌ Erro ao buscar todos os posts:', error);
    throw error;
  }
}

// Curtir um post
export async function likePost(postId, userId) {
  try {
    console.log('👍 Curtindo post:', postId, 'usuário:', userId);
    
    if (!postId || !userId) {
      throw new Error('Post ID ou User ID não fornecido');
    }
    
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId)
    });
    
    console.log('✅ Post curtido com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao curtir post:', error);
    throw error;
  }
}

// Descurtir um post
export async function unlikePost(postId, userId) {
  try {
    console.log('👎 Descurtindo post:', postId, 'usuário:', userId);
    
    if (!postId || !userId) {
      throw new Error('Post ID ou User ID não fornecido');
    }
    
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId)
    });
    
    console.log('✅ Post descurtido com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao descurtir post:', error);
    throw error;
  }
}

// Adicionar comentário
export async function addComment(postId, commentData) {
  try {
    console.log('💬 Adicionando comentário ao post:', postId);
    
    if (!postId || !commentData) {
      throw new Error('Post ID ou dados do comentário não fornecidos');
    }
    
    const postRef = doc(db, 'posts', postId);
    const comment = {
      id: Date.now().toString(),
      userId: commentData.userId,
      userName: commentData.userName || 'Usuário',
      userImage: commentData.userImage || '',
      text: commentData.text,
      createdAt: serverTimestamp(),
    };
    
    await updateDoc(postRef, {
      comments: arrayUnion(comment)
    });
    
    console.log('✅ Comentário adicionado com sucesso');
    return comment;
  } catch (error) {
    console.error('❌ Erro ao adicionar comentário:', error);
    throw error;
  }
}

// Buscar comentários de um post
export async function getCommentsWithUserData(postId) {
  try {
    console.log('🔍 Buscando comentários do post:', postId);
    
    const post = await getPostById(postId);
    if (post) {
      return post.comments || [];
    }
    return [];
  } catch (error) {
    console.error('❌ Erro ao buscar comentários:', error);
    throw error;
  }
}

// Deletar post
export async function deletePost(postId) {
  try {
    console.log('🗑️ Deletando post:', postId);
    
    if (!postId) {
      throw new Error('Post ID não fornecido');
    }
    
    await deleteDoc(doc(db, 'posts', postId));
    console.log('✅ Post deletado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao deletar post:', error);
    throw error;
  }
}

// Atualizar post
export async function updatePost(postId, updateData) {
  try {
    console.log('✏️ Atualizando post:', postId);
    
    if (!postId || !updateData) {
      throw new Error('Post ID ou dados de atualização não fornecidos');
    }
    
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Post atualizado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao atualizar post:', error);
    throw error;
  }
}

// Verificar se usuário curtiu o post
export function checkIfUserLikedPost(post, userId) {
  if (!post || !userId) return false;
  return post.likedBy && post.likedBy.includes(userId);
}

// Contar posts de um usuário
export async function countUserPosts(userId) {
  try {
    const posts = await getPostsByUsuario(userId);
    return posts.length;
  } catch (error) {
    console.error('❌ Erro ao contar posts:', error);
    return 0;
  }
}

// Buscar posts com filtros
export async function getPostsWithFilters(filters = {}) {
  try {
    const postsRef = collection(db, 'posts');
    let q = query(postsRef);
    
    // Aplicar filtros
    if (filters.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }
    
    if (filters.orderBy === 'newest') {
      q = query(q, orderBy('createdAt', 'desc'));
    } else if (filters.orderBy === 'mostLiked') {
      q = query(q, orderBy('likes', 'desc'));
    }
    
    if (filters.limit) {
      // Para limit, precisaria usar limit() mas vamos fazer manualmente
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.slice(0, filters.limit).map((doc) => ({ 
        id: doc.id,
        ...doc.data(),
        image: doc.data().imageBase64 ? `data:image/jpeg;base64,${doc.data().imageBase64}` : null,
        userImage: doc.data().userImage ? `data:image/jpeg;base64,${doc.data().userImage}` : null
      }));
      
      return posts;
    }
    
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map((doc) => ({ 
      id: doc.id,
      ...doc.data(),
      image: doc.data().imageBase64 ? `data:image/jpeg;base64,${doc.data().imageBase64}` : null,
      userImage: doc.data().userImage ? `data:image/jpeg;base64,${doc.data().userImage}` : null
    }));
    
    return posts;
  } catch (error) {
    console.error('❌ Erro ao buscar posts com filtros:', error);
    throw error;
  }
}

// ========== FUNÇÕES DE USUÁRIOS ==========

// Buscar usuário por ID
export async function getUserById(userId) {
  try {
    console.log('🔍 Buscando usuário:', userId);
    
    if (!userId) {
      throw new Error('User ID não fornecido');
    }
    
    const userDoc = await getDoc(doc(db, 'usuario', userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('✅ Usuário encontrado:', userDoc.id);
      
      return { 
        id: userDoc.id,
        ...userData,
        // Converter imagem base64 se existir
        imagem: userData.imagem ? (
          userData.imagem.startsWith('/9j/') || userData.imagem.startsWith('iVBORw0KGgo') 
            ? `data:image/jpeg;base64,${userData.imagem}`
            : userData.imagem
        ) : null
      };
    }
    
    console.log('⚠️ Usuário não encontrado');
    return null;
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    throw error;
  }
}

// Criar ou atualizar perfil do usuário
export async function createOrUpdateUserProfile({
  uid,
  nome,
  username,
  email,
  imagem,
  bio
}) {
  try {
    console.log('💾 Criando/atualizando perfil:', uid);
    
    if (!uid) {
      throw new Error('UID do usuário não fornecido');
    }
    
    const userDocRef = doc(db, 'usuario', uid);
    await setDoc(
      userDocRef,
      {
        uid,
        nome: nome || '',
        username: username || '',
        email: email || '',
        imagem: imagem || '',
        bio: bio || '',
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
    
    console.log('✅ Perfil do usuário atualizado');
    return true;
  } catch (error) {
    console.error('❌ Erro ao atualizar perfil:', error);
    throw error;
  }
}

// Atualizar perfil do usuário
export async function updateUserProfile({
  uid,
  nome,
  bio,
  profileImageBase64,
  username,
}) {
  try {
    console.log('✏️ Atualizando perfil:', uid);
    
    if (!uid) {
      throw new Error('UID do usuário não fornecido');
    }

    const userDocRef = doc(db, 'usuario', uid);
    
    // Preparar dados para atualização
    const updateData = {
      nome: nome || '',
      bio: bio || '',
      updatedAt: serverTimestamp()
    };

    // Adicionar username se fornecido
    if (username) {
      updateData.username = username.toLowerCase().trim();
    }

    // Adicionar imagem se fornecida
    if (profileImageBase64) {
      updateData.imagem = profileImageBase64;
    }

    console.log('💾 Dados de atualização:', updateData);
    
    await updateDoc(userDocRef, updateData);
    console.log('✅ Perfil atualizado com sucesso');
    
    return { success: true, message: 'Perfil atualizado com sucesso!' };
  } catch (error) {
    console.error('❌ Erro ao atualizar perfil do usuário:', error);
    throw error;
  }
}

// Seguir usuário
export async function followUser(currentUserId, userToFollowId) {
  try {
    console.log('👥 Seguindo usuário:', userToFollowId);
    
    if (!currentUserId || !userToFollowId) {
      throw new Error('IDs de usuário não fornecidos');
    }
    
    const currentUserRef = doc(db, 'usuario', currentUserId);
    const userToFollowRef = doc(db, 'usuario', userToFollowId);
    
    await updateDoc(currentUserRef, {
      following: arrayUnion(userToFollowId),
      followingCount: increment(1)
    });
    
    await updateDoc(userToFollowRef, {
      followers: arrayUnion(currentUserId),
      followersCount: increment(1)
    });
    
    console.log('✅ Usuário seguido com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao seguir usuário:', error);
    throw error;
  }
}

// Deixar de seguir usuário
export async function unfollowUser(currentUserId, userToUnfollowId) {
  try {
    console.log('👥 Deixando de seguir usuário:', userToUnfollowId);
    
    if (!currentUserId || !userToUnfollowId) {
      throw new Error('IDs de usuário não fornecidos');
    }
    
    const currentUserRef = doc(db, 'usuario', currentUserId);
    const userToUnfollowRef = doc(db, 'usuario', userToUnfollowId);
    
    await updateDoc(currentUserRef, {
      following: arrayRemove(userToUnfollowId),
      followingCount: increment(-1)
    });
    
    await updateDoc(userToUnfollowRef, {
      followers: arrayRemove(currentUserId),
      followersCount: increment(-1)
    });
    
    console.log('✅ Deixou de seguir usuário com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao deixar de seguir usuário:', error);
    throw error;
  }
}

// ========== FUNÇÕES AUXILIARES ==========

// Verificar disponibilidade de username
export async function checkUsernameAvailability(username) {
  try {
    const usersRef = collection(db, 'usuario');
    const q = query(usersRef, where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { available: true };
    } else {
      return { 
        available: false, 
        error: 'Este nome de usuário já está em uso' 
      };
    }
  } catch (error) {
    console.error('❌ Erro ao verificar username:', error);
    return { 
      available: false, 
      error: 'Erro ao verificar disponibilidade' 
    };
  }
}

// Buscar usuários por nome ou username
export async function searchUsers(searchTerm) {
  try {
    // Nota: Firestore não suporta busca por substring diretamente
    // Esta é uma implementação básica
    const usersRef = collection(db, 'usuario');
    const querySnapshot = await getDocs(usersRef);
    
    const users = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
          user.nome?.toLowerCase().includes(searchLower) ||
          user.username?.toLowerCase().includes(searchLower)
        );
      });
    
    return users;
  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error);
    throw error;
  }
}

// Atualizar contador de posts do usuário
export async function updateUserPostsCount(userId) {
  try {
    const postsCount = await countUserPosts(userId);
    const userRef = doc(db, 'usuario', userId);
    
    await updateDoc(userRef, {
      postsCount: postsCount,
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Contador de posts atualizado:', postsCount);
    return postsCount;
  } catch (error) {
    console.error('❌ Erro ao atualizar contador de posts:', error);
    throw error;
  }
}

// ========== EXPORTAÇÕES ==========

export default {
  // Posts
  savePostToFirestore,
  getPostById,
  getPostsByUsuario,
  getAllPosts,
  likePost,
  unlikePost,
  addComment,
  getCommentsWithUserData,
  deletePost,
  updatePost,
  checkIfUserLikedPost,
  countUserPosts,
  getPostsWithFilters,
  
  // Usuários
  getUserById,
  createOrUpdateUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  checkUsernameAvailability,
  searchUsers,
  updateUserPostsCount
};