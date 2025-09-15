// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// IMPORTANT: Replace this with your actual Firebase config
const firebaseConfig = {
  "projectId": "seva-sangathan-2-3782382-a302a",
  "appId": "1:555772377245:web:87f6b6342f69cd30d97c74",
  "storageBucket": "seva-sangathan-2-3782382-a302a.firebasestorage.app",
  "apiKey": "AIzaSyBh_h2QPy37s8UKnt7Hhs-OeZAropLC5x4",
  "authDomain": "seva-sangathan-2-3782382-a302a.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "555772377245"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
