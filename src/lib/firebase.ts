import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "the147club-hq",
  appId: "1:482179632538:web:821c650ad79097eb89fe23",
  storageBucket: "the147club-hq.firebasestorage.app",
  apiKey: "AIzaSyCvEkZzZ84CjTRoOaOgBxPg8Ayt0tfST-A",
  authDomain: "the147club-hq.firebaseapp.com",
  messagingSenderId: "482179632538",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
