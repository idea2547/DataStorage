import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebase from 'firebase/compat/app';
import { getDatabase } from "firebase/database";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdJnRVI6m9Uo8wbKZsZt6z0W8Nqw1LH8M",
  authDomain: "nimble-furnace-331612.firebaseapp.com",
  databaseURL: "https://nimble-furnace-331612-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nimble-furnace-331612",
  storageBucket: "nimble-furnace-331612.appspot.com",
  messagingSenderId: "958487820888",
  appId: "1:958487820888:web:f697290730f9503fe0a82d",
  measurementId: "G-R4BRRKTNQD"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth(firebaseApp)


const db = getFirestore(firebaseApp);

export { auth, db };


