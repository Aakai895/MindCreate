// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8ca9w230uMoGZNdAOAh_Eet3pUGutm_I",
  authDomain: "mindc-f4718.firebaseapp.com",
  projectId: "mindc-f4718",
  storageBucket: "mindc-f4718.firebasestorage.app",
  messagingSenderId: "907225952398",
  appId: "1:907225952398:web:bdffbf128e323d0f5ed9df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);