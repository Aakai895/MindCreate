import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
} from 'firebase/firestore';

// --- Função para adicionar um projeto para um usuário ---
export async function addProjeto({
  anotações,
  carreira,
  nomeP,
  tempodata,
  uid,
}) {
  return await addDoc(collection(db, 'projetos'), {
    anotações,
    carreira,
    nomeP,
    tempodata,
    uid,
  });
}

// --- Função para buscar projetos de um usuário pelo id ---
export async function getProjetosByUsuario(uid) {
  const projetosRef = collection(db, 'projeto');
  const q = query(projetosRef, where('usuarioID', '==', uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// --- Atualiza os dados do perfil do usuário ---
export async function updateUserProfile({
  uid,
  nome,
  bio,
  profileImageBase64,
  username,
}) {
  const userDocRef = doc(db, 'usuario', uid);

  return await setDoc(
    userDocRef,
    {
      nome,
      bio,
      imagem: profileImageBase64,
      username, 
    },
    { merge: true }
  );
}

