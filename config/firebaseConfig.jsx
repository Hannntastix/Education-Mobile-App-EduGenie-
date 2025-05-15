import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_FIREBASE_API,
  authDomain: "edugenie-42c60.firebaseapp.com",
  projectId: "edugenie-42c60",
  storageBucket: "edugenie-42c60.appspot.com",
  messagingSenderId: "435417886612",
  appId: "1:435417886612:web:89439d3f1aa44bd0ee6981",
  measurementId: "G-339PM1TV02"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});

export const db = getFirestore(app);