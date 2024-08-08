// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD9TyQ9zPi9rca4Bjt0gvb6ba1RQLYeNAA",
  authDomain: "gbc-wip-group7.firebaseapp.com",
  projectId: "gbc-wip-group7",
  storageBucket: "gbc-wip-group7.appspot.com",
  messagingSenderId: "116668475662",
  appId: "1:116668475662:web:b621b6e88297a359fe4f5f",
  measurementId: "G-XEEPHH0X3F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized');

const auth = getAuth(app);
const db = getFirestore(app);

console.log('Auth and Firestore initialized');

export { auth, db };
