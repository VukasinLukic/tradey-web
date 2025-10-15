// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqGrnMqTeMGWOmmpKHjZn3S99-WZ0yzWs",
  authDomain: "vibe-hakaton.firebaseapp.com",
  projectId: "vibe-hakaton",
  storageBucket: "vibe-hakaton.firebasestorage.app",
  messagingSenderId: "225908111904",
  appId: "1:225908111904:web:36ffedcbbdfd2ed0b85a45",
  measurementId: "G-1KRVHGJHVZ"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
