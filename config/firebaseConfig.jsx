import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAY65Yp4SZX2wPGDfPczWUG-Tey1o4nsNc",
  authDomain: "edugenie-42c60.firebaseapp.com",
  projectId: "edugenie-42c60",
  storageBucket: "edugenie-42c60.firebasestorage.app",
  messagingSenderId: "435417886612",
  appId: "1:435417886612:web:89439d3f1aa44bd0ee6981",
  measurementId: "G-339PM1TV02"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
auth.setPersistence(browserLocalPersistence).then(() => {
  console.log("Persistence set successfully.");
}).catch((error) => {
  console.error("Error setting persistence:", error);
});

export const db = getFirestore(app);
