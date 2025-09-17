import { auth, db } from "../firebase/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export async function registerUser(email, password, nome) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Usuário criado com sucesso:", user.uid);

    await setDoc(doc(db, "usuario", user.uid), {
      uid: user.uid,
      nome: nome,
      email: email,
      criadoEm: new Date()
    });

    console.log("Dados salvos no Firestore com sucesso!");
    return user;
  } catch (error) {
    console.error("Erro durante o registro ou ao salvar no Firestore:", error);
    throw error; // repropaga para a tela mostrar o erro
  }
}

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login realizado com sucesso:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error; // repropaga para mostrar o erro na tela
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    console.log("Logout realizado com sucesso.");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
}
