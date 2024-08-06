// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdpHzyO7QTrGrpx_DuAnd_TbWm01p1n8U",
  authDomain: "pantryapp-2061e.firebaseapp.com",
  projectId: "pantryapp-2061e",
  storageBucket: "pantryapp-2061e.appspot.com",
  messagingSenderId: "358670140307",
  appId: "1:358670140307:web:7db3480563bb1f8bc49e66"
};  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)


export  {firestore};