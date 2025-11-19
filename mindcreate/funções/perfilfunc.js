import { db } from '../firebase/firebase';
import {
  collection, addDoc, getDocs, query, where,
  doc, setDoc, getDoc, serverTimestamp
} from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

// ==================== FUNÇÕES DE IMAGEM ====================

export const getBase64Size = (base64String) => {
  if (!base64String) return 0;
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  return (base64Data.length * 3) / 4 / 1024;
};

export const compressImageAggressive = async (imageUri, maxSizeKB = 300) => {
  try {
    console.log('🔧 Compressão agressiva iniciada...');
    
    let quality = 0.5;
    let compressedImage;
    let attempts = 0;
    const maxAttempts = 5;
    
    do {
      attempts++;
      console.log(`🔄 Tentativa ${attempts} - Qualidade: ${quality}`);
      
      compressedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }],
        { 
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true
        }
      );
      
      const sizeInKB = getBase64Size(compressedImage.base64);
      console.log(`📏 Tamanho após compressão: ${sizeInKB.toFixed(2)}KB`);
      
      if (sizeInKB <= maxSizeKB) {
        console.log('✅ Compressão bem-sucedida!');
        return {
          ...compressedImage,
          sizeKB: sizeInKB,
          quality: quality
        };
      }
      
      quality = Math.max(0.1, quality - 0.1);
      
    } while (attempts < maxAttempts && quality >= 0.1);
    
    const finalSize = getBase64Size(compressedImage.base64);
    console.warn(`⚠️ Não foi possível comprimir abaixo de ${maxSizeKB}KB. Tamanho final: ${finalSize.toFixed(2)}KB`);
    
    return {
      ...compressedImage,
      sizeKB: finalSize,
      quality: quality,
      warning: true
    };
    
  } catch (error) {
    console.error('❌ Erro na compressão agressiva:', error);
    throw error;
  }
};

export const pickAndCompressImage = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permissão da galeria negada');
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: false,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      return await compressImageAggressive(imageUri, 300);
    }
    return null;
  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    throw error;
  }
};

// ==================== FUNÇÕES DE POSTS ====================

export const savePostToFirestore = async (postData, usuario) => {
  try {
    if (!usuario?.uid) {
      throw new Error('Usuário não autenticado');
    }

    const base64Size = getBase64Size(postData.image.base64);
    console.log(`📊 Tentando salvar post - Tamanho: ${base64Size.toFixed(2)}KB`);
    
    if (base64Size > 900) {
      throw new Error(`CRÍTICO: Imagem tem ${base64Size.toFixed(0)}KB. Limite seguro: 900KB`);
    }
    
    const postsRef = collection(db, 'posts');
    
    const newPost = {
      userId: usuario.uid,
      userName: usuario.nome,
      userUsername: usuario.username,
      userImage: usuario.imagem,
      imageBase64: postData.image.base64,
      caption: postData.caption,
      location: postData.location,
      tags: postData.tags ? postData.tags.split(',').map(tag => tag.trim().slice(0, 20)) : [],
      likes: 0,
      comments: [],
      imageSizeKB: Math.round(base64Size),
      createdAt: serverTimestamp(),
    };
    
    console.log('💾 Salvando post no Firestore...');
    const docRef = await addDoc(postsRef, newPost);
    
    console.log('✅ Post salvo com sucesso! ID:', docRef.id);
    return { 
      id: docRef.id, 
      ...newPost,
      image: `data:image/jpeg;base64,${postData.image.base64}`
    };
  } catch (error) {
    console.error('❌ Erro ao salvar post:', error);
    throw error;
  }
};

export const getPostsByUsuario = async (userId) => {
  try {
    if (!userId) {
      console.error('❌ userId está vazio');
      return [];
    }

    console.log('🔍 Buscando posts para o usuário:', userId);
    
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('userId', '==', userId));
    
    const querySnapshot = await getDocs(q);
    const userPosts = [];
    
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      userPosts.push({
        id: doc.id,
        ...postData,
        image: postData.imageBase64 ? `data:image/jpeg;base64,${postData.imageBase64}` : null
      });
    });
    
    console.log(`✅ ${userPosts.length} posts encontrados`);
    return userPosts;
  } catch (error) {
    console.error('❌ Erro ao buscar posts:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    if (!userId) {
      throw new Error('ID do usuário não fornecido');
    }

    console.log('🔍 Buscando usuário:', userId);
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      console.log('✅ Usuário encontrado');
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      console.log('❌ Usuário não encontrado');
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    throw error;
  }
};

export const validateImageSize = (base64String) => {
  const sizeKB = getBase64Size(base64String);
  
  if (sizeKB > 950) {
    return {
      isValid: false,
      message: `Imagem muito grande: ${sizeKB.toFixed(0)}KB. Limite: 950KB`,
      sizeKB
    };
  }
  
  if (sizeKB > 800) {
    return {
      isValid: true,
      needsConfirmation: true,
      message: `Imagem no limite: ${sizeKB.toFixed(0)}KB. Continuar?`,
      sizeKB
    };
  }
  
  return {
    isValid: true,
    needsConfirmation: false,
    message: `Imagem OK: ${sizeKB.toFixed(0)}KB`,
    sizeKB
  };
};