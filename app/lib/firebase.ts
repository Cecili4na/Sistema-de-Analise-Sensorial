// Firebase Configuration and Utility Functions

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User, UserRole } from './types';

const firebaseConfig = {
   apiKey: "AIzaSyDdNnQFQ04Pcszsc9xZiq6qwyyrMszEt8Y",
   authDomain: "analise-b39de.firebaseapp.com", 
   projectId: "analise-b39de",
   storageBucket: "analise-b39de.appspot.com",
   messagingSenderId: "685477663321",
   appId: "1:685477663321:web:3ba7ef37caecde6ab65748",
   measurementId: "G-EZGVH2QFHM"
};

const createFirebaseApp = () => {
 if (typeof window === "undefined") return null;
 return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

const app = createFirebaseApp();
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export async function getUserRole(uid: string): Promise<UserRole | null> {
 if (!db) return null;
 const userDoc = await getDoc(doc(db, 'users', uid));
 return userDoc.exists() ? userDoc.data().role : null;
}

export async function createUserProfile(user: User) {
 if (!db) return;
 await setDoc(doc(db, 'users', user.uid), {
   ...user,
   createdAt: serverTimestamp()
 });
}