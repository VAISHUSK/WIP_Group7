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

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
