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
} from 'firebase/firestore';

// Atualizar projeto pelo id com os dados passados no objeto data
export async function atualizarProjeto(id, data) {
  try {
    const projetoRef = doc(db, 'projetos', id);
    await updateDoc(projetoRef, data);
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    throw error;
  }
}

// Excluir projeto pelo id
export async function excluirProjeto(id) {
  try {
    await deleteDoc(doc(db, 'projetos', id));
  } catch (error) {
    console.error('Erro ao excluir projeto:', error);
    throw error;
  }
}

// Adicionar projeto novo
export async function addProjeto({ nomeP, dataEntrega, uid, image, projetoId}) {
  try {
    const docRef = await addDoc(collection(db, 'projetos'), {
      nomeP,
      dataEntrega,
      uid,
      image,
      projetoId,

    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar projeto:', error);
    throw error;
  }
}

// Buscar projetos de um usuário pelo uid
export async function getProjetosByUsuario(uid) {
  try {
    const projetosRef = collection(db, 'projetos');
    const q = query(projetosRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
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
    const userDocRef = doc(db, 'usuario', uid);
    await setDoc(
      userDocRef,
      {
        nome,
        bio,
        imagem: profileImageBase64,
        username,
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    throw error;
  }
}
