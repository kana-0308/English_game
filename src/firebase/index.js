// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeVPmP7Lh0m3snGIq2hvCDXL14lTD4heU",
  authDomain: "english-app-pbl.firebaseapp.com",
  projectId: "english-app-pbl",
  storageBucket: "english-app-pbl.firebasestorage.app",
  messagingSenderId: "785647830769",
  appId: "1:785647830769:web:b7f7992317d088344acb50",
  measurementId: "G-4PXRQYGKH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);