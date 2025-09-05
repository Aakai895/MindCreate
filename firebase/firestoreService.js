import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

export async function addUser(name, age) {
  return await addDoc(collection(db, "users"), { name, age });
}

export async function getUsers() {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
