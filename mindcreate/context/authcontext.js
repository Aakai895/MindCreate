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
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  // 🔄 Escuta login/logout + sincroniza Firestore com onSnapshot
  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'usuario', user.uid);

        // 👂 Escuta em tempo real os dados do usuário no Firestore
        unsubscribeSnapshot = onSnapshot(docRef, async (docSnap) => {
          if (docSnap.exists()) {
            setUsuario({ uid: user.uid, email: user.email, ...docSnap.data() });
          } else {
            // Cria dados iniciais se não existir
            const novoUsuario = {
              uid: user.uid,
              email: user.email,
              criadoEm: new Date(),
            };
            await setDoc(docRef, novoUsuario);
            setUsuario(novoUsuario);
          }
        });
      } else {
        setUsuario(null);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  // 🧾 Registrar novo usuário
  async function registerUser(email, password, nome) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const novoUsuario = {
      uid: user.uid,
      nome,
      email,
      criadoEm: new Date(),
    };

    await setDoc(doc(db, 'usuario', user.uid), novoUsuario);
    setUsuario(novoUsuario);

    return user;
  }

  // 🔐 Login
  async function loginUser(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // onSnapshot já cuida de atualizar o `usuario`
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
        setUsuario, // caso precise atualizar manualmente
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
