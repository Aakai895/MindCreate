import { db } from './firebase';
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

// Buscar posts de um usuário
export async function getPostsByUsuario(userId) {
  try {
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
      image: doc.data().imageBase64 ? `data:image/jpeg;base64,${doc.data().imageBase64}` : null
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
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map((doc) => ({ 
      id: doc.id,
      ...doc.data(),
      image: doc.data().imageBase64 ? `data:image/jpeg;base64,${doc.data().imageBase64}` : null
    }));
    
    return posts;
  } catch (error) {
    console.error('❌ Erro ao buscar todos os posts:', error);
    throw error;
  }
}

// Curtir um post
export async function likePost(postId, userId) {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId)
    });
    console.log('👍 Post curtido');
  } catch (error) {
    console.error('❌ Erro ao curtir post:', error);
    throw error;
  }
}

// Descurtir um post
export async function unlikePost(postId, userId) {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId)
    });
    console.log('👎 Post descurtido');
  } catch (error) {
    console.error('❌ Erro ao descurtir post:', error);
    throw error;
  }
}

// Adicionar comentário
export async function addComment(postId, commentData) {
  try {
    const postRef = doc(db, 'posts', postId);
    const comment = {
      id: Date.now().toString(),
      userId: commentData.userId,
      userName: commentData.userName,
      userImage: commentData.userImage,
      text: commentData.text,
      createdAt: serverTimestamp(),
    };
    
    await updateDoc(postRef, {
      comments: arrayUnion(comment)
    });
    
    console.log('💬 Comentário adicionado');
    return comment;
  } catch (error) {
    console.error('❌ Erro ao adicionar comentário:', error);
    throw error;
  }
}

// Deletar post
export async function deletePost(id) {
  try {
    await deleteDoc(doc(db, 'posts', id));
    console.log('🗑️ Post deletado');
  } catch (error) {
    console.error('❌ Erro ao deletar post:', error);
    throw error;
  }
}

// ========== FUNÇÕES DE USUÁRIOS ==========

// Buscar usuário por ID
export async function getUserById(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'usuario', userId));
    
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
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
    const userDocRef = doc(db, 'users', uid);
    await setDoc(
      userDocRef,
      {
        uid,
        nome,
        username,
        email,
        imagem,
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
  } catch (error) {
    console.error('❌ Erro ao atualizar perfil:', error);
    throw error;
  }
}

// Atualizar perfil do usuário com validação de username
export async function updateUserProfile({
  uid,
  nome,
  bio,
  profileImageBase64,
  username,
}) {
  try {
    if (!uid) {
      throw new Error('UID do usuário não fornecido');
    }

    const userDocRef = doc(db, 'usuario', uid);
    const userDoc = await getDoc(userDocRef);
    const currentUserData = userDoc.exists() ? userDoc.data() : {};

    // Se o username foi alterado, verificar disponibilidade
    if (username && username !== currentUserData.username) {
      const usernameCheck = await checkUsernameAvailability(username);
      
      if (!usernameCheck.available) {
        throw new Error(usernameCheck.error);
      }
    }

    // Preparar dados para atualização
    const updateData = {
      nome: nome || '',
      bio: bio || '',
      updatedAt: serverTimestamp()
    };

    // Adicionar username apenas se foi fornecido
    if (username) {
      updateData.username = username.toLowerCase().trim();
    }

    // Adicionar imagem se foi fornecida
    if (profileImageBase64) {
      updateData.imagem = profileImageBase64;
    }

    console.log('💾 Atualizando perfil:', updateData);
    
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
    
    console.log('✅ Usuário seguido');
  } catch (error) {
    console.error('❌ Erro ao seguir usuário:', error);
    throw error;
  }
}

// Deixar de seguir usuário
export async function unfollowUser(currentUserId, userToUnfollowId) {
  try {
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
    
    console.log('✅ Deixou de seguir usuário');
  } catch (error) {
    console.error('❌ Erro ao deixar de seguir usuário:', error);
    throw error;
  }
}

// ========== FUNÇÕES DE PROJETOS ==========

// Atualizar projeto pelo id com os dados passados no objeto data
export async function atualizarProjeto(id, data) {
  console.log('🔄 Atualizando projeto ID:', id);
  
  try {
    const projetoRef = doc(db, 'projetos', id);
    await updateDoc(projetoRef, data);
    console.log('✅ Projeto atualizado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao atualizar projeto:', error);
    throw error;
  }
}

// Excluir projeto pelo id
export async function excluirProjeto(id) {
  try {
    await deleteDoc(doc(db, 'projetos', id));
    console.log('🗑️ Projeto excluído');
  } catch (error) {
    console.error('❌ Erro ao excluir projeto:', error);
    throw error;
  }
}

// Adicionar projeto novo
export async function addProjeto({ nomeP, dataEntrega, uid, image, projetoId }) {
  try {
    const docRef = await addDoc(collection(db, 'projetos'), {
      nomeP,
      dataEntrega,
      uid,
      image,
      projetoId,
      tempo: 0,
      carreiras: 1,
      anotacoes: '',
      iniciado: false,
      createdAt: new Date()
    });
    console.log('✅ Projeto criado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Erro ao adicionar projeto:', error);
    throw error;
  }
}

// Buscar projetos de um usuário pelo uid
export async function getProjetosByUsuario(uid) {
  try {
    const projetosRef = collection(db, 'projetos');
    const q = query(projetosRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    const projetos = querySnapshot.docs.map((doc) => ({ 
      id: doc.id,
      ...doc.data() 
    }));
    
    console.log('📋 Projetos encontrados:', projetos.length);
    return projetos;
  } catch (error) {
    console.error('❌ Erro ao buscar projetos:', error);
    throw error;
  }
}