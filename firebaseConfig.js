// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

const auth = getAuth(app);

export { auth };