// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-ae9f1.firebaseapp.com",
  projectId: "real-estate-ae9f1",
  storageBucket: "real-estate-ae9f1.firebasestorage.app",
  messagingSenderId: "156783352662",
  appId: "1:156783352662:web:758ca5f97b299fd9cf54f7"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);