// funcoes/firestoreHelpers.js
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
  getDoc,
  runTransaction,
  limit as limitQuery
} from 'firebase/firestore';

/**
 * Util - normaliza imagem base64 para data URI.
 * Se já vier com prefixo "data:image", retorna igual.
 * Se vier puro base64, tenta detectar JPEG/PNG pelo prefixo e adiciona data:image/jpeg;base64, por segurança.
 */
function normalizeBase64DataUri(base64, mimeHint = 'image/jpeg') {
  if (!base64) return null;

  // já é data uri
  if (base64.startsWith('data:image')) {
    return base64;
  }

  // tentativa simples de detectar PNG (/iVBOR) ou JPEG (/9j/) — caso não detecte, usa mimeHint
  const prefix = base64.startsWith('/9j') || base64.startsWith('9j') ? 'image/jpeg'
    : base64.startsWith('iVBOR') || base64.startsWith('/iVBOR') ? 'image/png'
    : mimeHint;

  return `data:${prefix};base64,${base64}`;
}

/* ==========================================================
   POSTS
   ========================================================== */

/**
 * Salva post no Firestore.
 * Garante que a imagem seja salva como data URI (base64 com prefixo).
 */
export async function savePostToFirestore({
  userId,
  userName,
  userUsername,
  userImage,       // aceita data URI (recomendado) ou base64
  imageBase64,     // aceita data URI (recomendado) ou base64 puro
  caption,
  location,
  tags
}) {
  try {
    const postsRef = collection(db, 'posts');

    const normalizedImageBase64 = normalizeBase64DataUri(imageBase64);
    const normalizedUserImage = normalizeBase64DataUri(userImage);

    const docRef = await addDoc(postsRef, {
      userId,
      userName: userName || '',
      userUsername: userUsername || '',
      userImage: normalizedUserImage || null,
      imageBase64: normalizedImageBase64 || null,
      caption: caption || '',
      location: location || null,
      tags: tags ? (Array.isArray(tags) ? tags.map(t => t.trim()) : tags.split(',').map(t => t.trim())) : [],
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Post criado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Erro ao criar post:', error);
    throw error;
  }
}

/**
 * Retorna posts de um usuário (ordenados por createdAt desc).
 * Atenção: se usar orderBy + where por createdAt, pode precisar criar índice composto no Firestore.
 */
export async function getPostsByUsuario(userId) {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const posts = querySnapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        // garantir que, na UI, haja um campo image com data-uri (compatível com Image source.uri)
        image: data.imageBase64 ? data.imageBase64 : null
      };
    });

    console.log('📋 Posts encontrados:', posts.length);
    return posts;
  } catch (error) {
    console.error('❌ Erro ao buscar posts:', error);
    throw error;
  }
}

/**
 * Busca todos os posts, ordenados por createdAt desc.
 * Use com cautela (paginacão recomendada em produção).
 */
export async function getAllPosts() {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const posts = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        image: data.imageBase64 ? data.imageBase64 : null
      };
    });

    return posts;
  } catch (error) {
    console.error('❌ Erro ao buscar todos os posts:', error);
    throw error;
  }
}

/**
 * Retorna até "limit" posts aleatórios.
 * Implementação simples: busca N últimos posts (ou todos se poucos),
 * embaralha e retorna o número pedido.
 *
 * Nota: para escala, implementar sampling server-side ou índices.
 */
export async function getRandomPosts(limit = 10) {
  try {
    // pega um lote limitado para performance (ex.: 100) e embaralha localmente
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'), limitQuery(100));
    const snapshot = await getDocs(q);

    const all = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        image: data.imageBase64 ? data.imageBase64 : null
      };
    });

    // embaralhar (Fisher-Yates)
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }

    return all.slice(0, limit);
  } catch (error) {
    console.error('❌ Erro ao buscar posts aleatórios:', error);
    throw error;
  }
}

/**
 * Curtir post com proteção contra double-like usando transaction.
 * Se o usuário já curtiu, retorna { alreadyLiked: true }.
 */
export async function likePost(postId, userId) {
  if (!postId || !userId) throw new Error('postId e userId são necessários');

  const postRef = doc(db, 'posts', postId);

  try {
    await runTransaction(db, async (tx) => {
      const postSnap = await tx.get(postRef);
      if (!postSnap.exists()) throw new Error('Post não encontrado');

      const postData = postSnap.data();
      const likedBy = Array.isArray(postData.likedBy) ? postData.likedBy : [];

      if (likedBy.includes(userId)) {
        // já curtiu — nada a fazer
        console.log('ℹ️ Usuário já curtiu este post');
        return;
      }

      tx.update(postRef, {
        likes: increment(1),
        likedBy: arrayUnion(userId)
      });
    });

    console.log('👍 Post curtido');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao curtir post:', error);
    throw error;
  }
}

/**
 * Descurtir post com proteção usando transaction.
 * Se o usuário NÃO tiver curtido, ignora.
 */
export async function unlikePost(postId, userId) {
  if (!postId || !userId) throw new Error('postId e userId são necessários');

  const postRef = doc(db, 'posts', postId);

  try {
    await runTransaction(db, async (tx) => {
      const postSnap = await tx.get(postRef);
      if (!postSnap.exists()) throw new Error('Post não encontrado');

      const postData = postSnap.data();
      const likedBy = Array.isArray(postData.likedBy) ? postData.likedBy : [];

      if (!likedBy.includes(userId)) {
        // não estava curtido — nada a fazer
        console.log('ℹ️ Usuário não tinha curtido este post');
        return;
      }

      tx.update(postRef, {
        likes: increment(-1),
        likedBy: arrayRemove(userId)
      });
    });

    console.log('👎 Post descurtido');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao descurtir post:', error);
    throw error;
  }
}

/**
 * Adicionar comentário (usa arrayUnion — cuidado com ordenação de comentários).
 * Retorna o comentário criado (com id local).
 */
export async function addComment(postId, commentData) {
  try {
    if (!postId) throw new Error('postId é necessário');

    const postRef = doc(db, 'posts', postId);
    const comment = {
      id: Date.now().toString(),
      userId: commentData.userId || '',
      userName: commentData.userName || '',
      userImage: normalizeBase64DataUri(commentData.userImage) || null,
      text: commentData.text || '',
      createdAt: serverTimestamp()
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

export async function deletePost(id) {
  try {
    if (!id) throw new Error('id é necessário');
    await deleteDoc(doc(db, 'posts', id));
    console.log('🗑️ Post deletado');
  } catch (error) {
    console.error('❌ Erro ao deletar post:', error);
    throw error;
  }
}

/* ==========================================================
   USUÁRIOS (coleção: "usuario")
   ========================================================== */

/**
 * Buscar usuário por ID (coleção "usuario")
 */
export async function getUserById(userId) {
  try {
    if (!userId) return null;
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

/**
 * Cria ou atualiza o perfil do usuário na coleção 'usuario'
 * - normaliza imagem (data URI)
 * - mantém contadores e campos essenciais
 */
export async function createOrUpdateUserProfile({
  uid,
  nome,
  username,
  email,
  imagem, // base64 ou data URI
  bio
}) {
  try {
    if (!uid) throw new Error('UID é necessário');

    const userDocRef = doc(db, 'usuario', uid);
    const normalizedImage = normalizeBase64DataUri(imagem);

    await setDoc(
      userDocRef,
      {
        uid,
        nome: nome || '',
        username: username ? username.toLowerCase().trim() : '',
        email: email || '',
        imagem: normalizedImage || null,
        bio: bio || '',
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        followers: [],
        following: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    console.log('✅ Perfil do usuário criado/atualizado');
  } catch (error) {
    console.error('❌ Erro ao atualizar perfil:', error);
    throw error;
  }
}

/**
 * Checa disponibilidade de username (não considera o mesmo uid).
 * Retorna { available: boolean, error?: string }
 */
export async function checkUsernameAvailability(username, currentUid = null) {
  try {
    if (!username) return { available: false, error: 'Username vazio' };

    const usuariosRef = collection(db, 'usuario');
    const q = query(usuariosRef, where('username', '==', username.toLowerCase().trim()));
    const snap = await getDocs(q);

    // se existe algum documento com esse username que não seja o currentUid => já usado
    const exists = snap.docs.some(docSnap => docSnap.id !== currentUid);
    return exists ? { available: false, error: 'Username já está em uso' } : { available: true };
  } catch (error) {
    console.error('❌ Erro ao checar username:', error);
    throw error;
  }
}

/**
 * Atualizar perfil do usuário (coleção 'usuario') — inclui validação de username.
 */
export async function updateUserProfile({
  uid,
  nome,
  bio,
  profileImageBase64,
  username,
}) {
  try {
    if (!uid) throw new Error('UID do usuário não fornecido');

    const userDocRef = doc(db, 'usuario', uid);
    const userDoc = await getDoc(userDocRef);
    const currentUserData = userDoc.exists() ? userDoc.data() : {};

    // Se o username foi alterado, verificar disponibilidade
    if (username && username !== currentUserData.username) {
      const usernameCheck = await checkUsernameAvailability(username, uid);
      if (!usernameCheck.available) {
        throw new Error(usernameCheck.error || 'Username indisponível');
      }
    }

    // Preparar dados para atualização
    const updateData = {
      nome: nome || (currentUserData.nome || ''),
      bio: bio !== undefined ? bio : (currentUserData.bio || ''),
      updatedAt: serverTimestamp()
    };

    if (username) {
      updateData.username = username.toLowerCase().trim();
    }

    if (profileImageBase64) {
      updateData.imagem = normalizeBase64DataUri(profileImageBase64);
    }

    await updateDoc(userDocRef, updateData);
    console.log('✅ Perfil atualizado com sucesso');

    return { success: true, message: 'Perfil atualizado com sucesso!' };
  } catch (error) {
    console.error('❌ Erro ao atualizar perfil do usuário:', error);
    throw error;
  }
}

/**
 * Seguir usuário (usa transaction para manter contadores consistentes)
 */
export async function followUser(currentUserId, userToFollowId) {
  try {
    if (!currentUserId || !userToFollowId) throw new Error('IDs necessários');

    const currentUserRef = doc(db, 'usuario', currentUserId);
    const userToFollowRef = doc(db, 'usuario', userToFollowId);

    await runTransaction(db, async (tx) => {
      const currentSnap = await tx.get(currentUserRef);
      const toFollowSnap = await tx.get(userToFollowRef);

      if (!currentSnap.exists() || !toFollowSnap.exists()) {
        throw new Error('Usuário não encontrado');
      }

      const currentData = currentSnap.data();
      const toFollowData = toFollowSnap.data();

      const alreadyFollowing = Array.isArray(currentData.following) && currentData.following.includes(userToFollowId);
      if (alreadyFollowing) {
        console.log('ℹ️ Já segue o usuário');
        return;
      }

      tx.update(currentUserRef, {
        following: arrayUnion(userToFollowId),
        followingCount: increment(1)
      });

      tx.update(userToFollowRef, {
        followers: arrayUnion(currentUserId),
        followersCount: increment(1)
      });
    });

    console.log('✅ Usuário seguido');
  } catch (error) {
    console.error('❌ Erro ao seguir usuário:', error);
    throw error;
  }
}

/**
 * Deixar de seguir usuário (transaction para consistência)
 */
export async function unfollowUser(currentUserId, userToUnfollowId) {
  try {
    if (!currentUserId || !userToUnfollowId) throw new Error('IDs necessários');

    const currentUserRef = doc(db, 'usuario', currentUserId);
    const userToUnfollowRef = doc(db, 'usuario', userToUnfollowId);

    await runTransaction(db, async (tx) => {
      const currentSnap = await tx.get(currentUserRef);
      const toUnfollowSnap = await tx.get(userToUnfollowRef);

      if (!currentSnap.exists() || !toUnfollowSnap.exists()) {
        throw new Error('Usuário não encontrado');
      }

      const currentData = currentSnap.data();
      const alreadyFollowing = Array.isArray(currentData.following) && currentData.following.includes(userToUnfollowId);
      if (!alreadyFollowing) {
        console.log('ℹ️ Não estava seguindo o usuário');
        return;
      }

      tx.update(currentUserRef, {
        following: arrayRemove(userToUnfollowId),
        followingCount: increment(-1)
      });

      tx.update(userToUnfollowRef, {
        followers: arrayRemove(currentUserId),
        followersCount: increment(-1)
      });
    });

    console.log('✅ Deixou de seguir usuário');
  } catch (error) {
    console.error('❌ Erro ao deixar de seguir usuário:', error);
    throw error;
  }
}

/* ==========================================================
   PROJETOS
   ========================================================== */

/**
 * Atualizar projeto (coleção 'projetos')
 */
export async function atualizarProjeto(id, data) {
  console.log('🔄 Atualizando projeto ID:', id);
  try {
    if (!id) throw new Error('ID do projeto necessário');
    const projetoRef = doc(db, 'projetos', id);

    // Se vier tipoProjeto no data, ele será salvo aqui
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };

    await updateDoc(projetoRef, updateData);
    console.log('✅ Projeto atualizado com sucesso');
    console.log('📝 Dados atualizados:', updateData); // Log para debug
  } catch (error) {
    console.error('❌ Erro ao atualizar projeto:', error);
    throw error;
  }
}
/**
 * Excluir projeto
 */
export async function excluirProjeto(id) {
  try {
    if (!id) throw new Error('ID do projeto necessário');
    await deleteDoc(doc(db, 'projetos', id));
    console.log('🗑️ Projeto excluído');
  } catch (error) {
    console.error('❌ Erro ao excluir projeto:', error);
    throw error;
  }
}

/**
 * Adicionar novo projeto
 */
/**
 * Adicionar novo projeto - CORRIGIDA
 */
export async function addProjeto({ nomeP, dataEntrega, uid, image, projetoId, tipoProjeto }) { // ADICIONE tipoProjeto aqui
  try {
    const normalizedImage = normalizeBase64DataUri(image);
    const docRef = await addDoc(collection(db, 'projetos'), {
      nomeP: nomeP || '',
      dataEntrega: dataEntrega || null,
      uid,
      image: normalizedImage || null,
      projetoId: projetoId || null,
      tipoProjeto: tipoProjeto || '', // ADICIONE ESTA LINHA!
      tempo: 0,
      carreiras: 1,
      anotacoes: '',
      iniciado: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('✅ Projeto criado com ID:', docRef.id);
    console.log('📝 Tipo de projeto salvo:', tipoProjeto); // Adicione este log
    return docRef.id;
  } catch (error) {
    console.error('❌ Erro ao adicionar projeto:', error);
    throw error;
  }
}

/**
 * Buscar projetos por uid
 */
export async function getProjetosByUsuario(uid) {
  try {
    if (!uid) return [];
    const projetosRef = collection(db, 'projetos');
    const q = query(projetosRef, where('uid', '==', uid));
    const snapshot = await getDocs(q);

    const projetos = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    console.log('📋 Projetos encontrados:', projetos.length);
    return projetos;
  } catch (error) {
    console.error('❌ Erro ao buscar projetos:', error);
    throw error;
  }
}
