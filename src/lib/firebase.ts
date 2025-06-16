// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDaNPo-sdX2Te5HJZ-nywCjahW9jsLpAyc',
  authDomain: 'isitfocustime.firebaseapp.com',
  projectId: 'isitfocustime',
  storageBucket: 'isitfocustime.firebasestorage.app',
  messagingSenderId: '136734578709',
  appId: '1:136734578709:web:060472b5eba923c553961c',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
