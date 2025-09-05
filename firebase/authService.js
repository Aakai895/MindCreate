import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export async function registerUser(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function loginUser(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logoutUser() {
  return await signOut(auth);
}

