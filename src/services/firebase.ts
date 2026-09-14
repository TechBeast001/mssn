import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use the specific firestoreDatabaseId if specified, or standard instance
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Sign in anonymously to guarantee authenticated Firestore security rules work seamlessly
export const initAuth = async () => {
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
  } catch (err) {
    console.warn('Anonymous auth note:', err);
  }
};

initAuth();

export {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp,
  writeBatch
};
