import { db } from "../firebase/firebase";  // sua config Firebase Firestore
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// --- Função para adicionar um usuário ---
export async function addUser({ nome, email, biografia }) {
  // Atenção: NÃO guarde senha aqui, use Firebase Auth para login/senha
  return await addDoc(collection(db, "usuario"), {
    nome,
    email,
    biografia
  });
}

// --- Função para buscar todos os usuários ---
export async function getUsers() {
  const querySnapshot = await getDocs(collection(db, "usuario"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// --- Função para adicionar um projeto para um usuário ---
export async function addProjeto({
  anotações,   // string
  carreira,    // number
  nomeP,      // string
  tempodata,  // timestamp (JS Date)
  usuarioID   // string (id do usuário dono)
}) {
  return await addDoc(collection(db, "projetos"), {
    anotações,
    carreira,
    nomeP,
    tempodata,
    usuarioID
  });
}

// --- Função para buscar projetos de um usuário pelo id ---
export async function getProjetosByUsuario(usuarioID) {
  const projetosRef = collection(db, "projetos");
  const q = query(projetosRef, where("usuarioID", "==", usuarioID));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
