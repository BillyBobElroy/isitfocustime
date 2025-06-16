import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getLastMood(userId: string): Promise<string | undefined> {
  try {
    // 1. Attempt Firestore fetch
    const ref = doc(db, "users", userId, "moodStats", "latest");
    const snap = await getDoc(ref);

    if (snap.exists() && snap.data().mood) {
      return snap.data().mood;
    }
  } catch (err) {
    console.warn("⚠️ Could not fetch mood from Firestore:", err);
  }

  // 2. Fallback: localStorage
  try {
    const localMood = localStorage.getItem("lastMoodEntry");
    if (localMood) return localMood;
  } catch (err) {
    console.warn("⚠️ Could not fetch mood from localStorage:", err);
  }

  return undefined;
}
