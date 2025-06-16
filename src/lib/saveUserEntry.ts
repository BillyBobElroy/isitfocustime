import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export async function saveUserEntry(uid: string, tool: string, data: object) {
  try {
    // Save the main tool entry
    const ref = collection(db, 'users', uid, tool);
    await addDoc(ref, {
      ...data,
      timestamp: serverTimestamp(),
    });

    // Prepare for tracking daily activity
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const activityRef = doc(db, 'users', uid, 'activityLog', 'summary');
    const snap = await getDoc(activityRef);

    let loggedDates: string[] = [];
    let days = 0;
    let streak = 1;
    let lastLoggedDate = today;

    if (snap.exists()) {
      const activity = snap.data();
      loggedDates = activity.loggedDates || [];
      days = activity.days || 0;
      lastLoggedDate = activity.lastLoggedDate || today;

      if (!loggedDates.includes(today)) {
        loggedDates.push(today);
        days += 1;

        if (lastLoggedDate === yesterday) {
          streak = activity.streak + 1;
        } else {
          streak = 1; // reset streak
        }
      } else {
        streak = activity.streak || 1;
      }
    } else {
      loggedDates = [today];
      days = 1;
      streak = 1;
    }

    await setDoc(
      activityRef,
      {
        loggedDates,
        days,
        streak,
        lastLoggedDate: today,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error(`[Firestore] Failed to save to ${tool}:`, err);
  }
}
