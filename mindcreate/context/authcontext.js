import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // ajuste o caminho conforme seu projeto

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  // Monitorar usuário logado automaticamente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Busca dados no Firestore
        const userDoc = await getDoc(doc(db, 'usuario', user.uid));
        if (userDoc.exists()) {
          setUsuario(userDoc.data());
        } else {
          setUsuario(null);
          console.warn('Usuário logado, mas dados não encontrados no Firestore');
        }
      } else {
        setUsuario(null);
      }
    });

    // Cleanup no unmount
    return () => unsubscribe();
  }, []);

  async function registerUser(email, password, nome) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const novoUsuario = {
        uid: user.uid,
        nome,
        email,
        criadoEm: new Date(),
      };

      await setDoc(doc(db, 'usuario', user.uid), novoUsuario);

      setUsuario(novoUsuario); // atualiza estado global

      console.log('Usuário registrado e salvo no Firestore:', novoUsuario);
      return user;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  async function loginUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Busca dados no Firestore
      const userDoc = await getDoc(doc(db, 'usuario', user.uid));
      if (userDoc.exists()) {
        setUsuario(userDoc.data());
      } else {
        setUsuario(null);
        console.warn('Dados do usuário não encontrados no Firestore!');
      }

      console.log('Login realizado:', user.uid);
      return user;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  async function logoutUser() {
    try {
      await signOut(auth);
      setUsuario(null);
      console.log('Logout realizado com sucesso.');
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  }

  return (
    <AppContext.Provider value={{ usuario, registerUser, loginUser, logoutUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
