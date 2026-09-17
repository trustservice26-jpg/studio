// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "seva-sangathan-2-3782382-a302a",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:555772377245:web:87f6b6342f69cd30d97c74",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "seva-sangathan-2-3782382-a302a.firebasestorage.app",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBh_h2QPy37s8UKnt7Hhs-OeZAropLC5x4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "seva-sangathan-2-3782382-a302a.firebaseapp.com",
  measurementId: "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "555772377245"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
