import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import localConfig from '../../firebase-applet-config.json';

// Configuration prioritized: Environment variables (Vercel/Cloud) > local config file
export const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || localConfig.apiKey,
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain,
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || localConfig.projectId,
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket,
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId,
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || localConfig.appId,
};

export const databaseId = 
  import.meta.env?.VITE_FIREBASE_DATABASE_ID || 
  localConfig.firestoreDatabaseId || 
  'ai-studio-sipakainga-bcab648b-634a-4ab1-9f53-744d154bbf31';

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db: Firestore = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
export const auth: Auth = getAuth(app);
