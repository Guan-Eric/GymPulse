// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVehi6VMJzEO54C3NEhkVSdDYVTMHeFNo",
  authDomain: "fitai-2e02d.firebaseapp.com",
  projectId: "fitai-2e02d",
  storageBucket: "fitai-2e02d.appspot.com",
  messagingSenderId: "174909441573",
  appId: "1:174909441573:web:3d640113eb5cbcede6e1cc",
  measurementId: "G-3MPCBKXSM0",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
