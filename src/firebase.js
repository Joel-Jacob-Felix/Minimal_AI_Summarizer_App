import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLDQIGrLNzLFV8tlqvgm-2PynyAyAM_Rk",
  authDomain: "mainproject-45274.firebaseapp.com",
  projectId: "mainproject-45274",
  storageBucket: "mainproject-45274.firebasestorage.app",
  messagingSenderId: "1052572670458",
  appId: "1:1052572670458:web:44faa0e4b094b0dd1eec43"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
