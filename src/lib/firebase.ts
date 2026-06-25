import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "operating-helper-dz908",
  appId: "1:938149900662:web:4bd4b08e85f00bf4884a57",
  apiKey: "AIzaSyDU3MTkSnG7--_L8dFExh4-SvjC5kGcXOs",
  authDomain: "operating-helper-dz908.firebaseapp.com",
  storageBucket: "operating-helper-dz908.firebasestorage.app",
  messagingSenderId: "938149900662"
};

// Main App
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-c52cdbe4-56da-407e-b91e-91c28717e732");

// Secondary App for creating users without signing out current admin
export const secondaryApp = getApps().length > 1 ? getApp("Secondary") : initializeApp(firebaseConfig, "Secondary");
export const secondaryAuth = getAuth(secondaryApp);
