import { initializeApp } from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";

export const app = initializeApp(firebaseConfig);
