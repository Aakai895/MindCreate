import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  // 🔄 Escuta login/deslog e busca dados do Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'usuario', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUsuario({ uid: user.uid, email: user.email, ...docSnap.data() });
        } else {
          // Se não tiver dados no Firestore, salva algo básico
          await setDoc(docRef, {
            uid: user.uid,
            email: user.email,
            criadoEm: new Date(),
          });
          setUsuario({ uid: user.uid, email: user.email });
        }
      } else {
        setUsuario(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 👤 Criação de conta
  async function registerUser(email, password, nome) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Salva no Firestore o perfil do usuário
    await setDoc(doc(db, 'usuario', user.uid), {
      uid: user.uid,
      nome,
      email,
      criadoEm: new Date(),
    });

    // Atualiza o estado global
    setUsuario({ uid: user.uid, nome, email });
    return user;
  }

  // 🔐 Login
  async function loginUser(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Busca dados do perfil no Firestore
    const docRef = doc(db, 'usuario', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUsuario({ uid: user.uid, email: user.email, ...docSnap.data() });
    } else {
      setUsuario({ uid: user.uid, email: user.email });
    }

    return user;
  }

  // 🚪 Logout
  async function logoutUser() {
    await signOut(auth);
    setUsuario(null);
  }

  // ➕ Adicionar projeto
  async function addProjeto({ anotações, carreira, nomeP, tempodata }) {
    if (!auth.currentUser) throw new Error('Usuário não autenticado');

    return await addDoc(collection(db, 'projetos'), {
      anotações,
      carreira,
      nomeP,
      tempodata,
      usuarioID: auth.currentUser.uid,
    });
  }

  // 📄 Buscar projetos do usuário
  async function getProjetosByUsuario() {
    if (!auth.currentUser) throw new Error('Usuário não autenticado');

    const projetosRef = collection(db, 'projetos');
    const q = query(projetosRef, where('usuarioID', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  return (
    <AppContext.Provider
      value={{
        usuario,
        registerUser,
        loginUser,
        logoutUser,
        addProjeto,
        getProjetosByUsuario,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
