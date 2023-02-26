import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import "firebase/auth";
import firebaseConfig from "./firebase.config";

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
