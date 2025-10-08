import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjqioidLSkoPzCTEcq_uMdXS7JMGJLqtM",
  authDomain: "mindcreate-354c0.firebaseapp.com",
  projectId: "mindcreate-354c0",
  storageBucket: "mindcreate-354c0.firebasestorage.app",
  messagingSenderId: "479588412875",
  appId: "1:479588412875:web:0368bff305a85f43885a4e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

