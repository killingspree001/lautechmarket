// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_vNpUQSzHrn9KqDr70ZMXJgi_PSFRdRk",
  authDomain: "lautech-marketplace.firebaseapp.com",
  projectId: "lautech-marketplace",
  storageBucket: "lautech-marketplace.firebasestorage.app",
  messagingSenderId: "92288746282",
  appId: "1:92288746282:web:0a4f515b2417457c6b9453",
  measurementId: "G-5Z8GT0M2ES"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
