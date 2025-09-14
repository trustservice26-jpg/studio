// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// IMPORTANT: Replace this with your actual Firebase config
const firebaseConfig = {
  "projectId": "studio-4090377415-e5f3f",
  "appId": "1:623875597997:web:5a29c0d58bec8444644824",
  "storageBucket": "studio-4090377415-e5f3f.firebasestorage.app",
  "apiKey": "AIzaSyCjJZWh5DxteqjBEToWWa7270EVtGFgJdw",
  "authDomain": "studio-4090377415-e5f3f.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "623875597997"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
