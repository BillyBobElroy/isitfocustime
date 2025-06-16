'use client';

import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { FirestoreUser } from '@/types/firestoreUser';

export function useFirebaseUser() {
  const [user, setUser] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch latest user data from Firestore
const refetchUser = useCallback(async () => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return;

  const docRef = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    setUser(snap.data() as FirestoreUser);
  }
}, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setUser(snap.data() as FirestoreUser);
        } else {
          // fallback default if user document not found
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            firstName: '',
            lastName: '',
            displayName: '',
            avatarId: '', // ✅ load avatar
          });
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  return { user, loading, logout, refetchUser };
}
