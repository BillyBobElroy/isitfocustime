import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const saveUserToFirestore = async (
  user: any,
  data?: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    onboardingComplete?: boolean;
    avatarId?: string;
  }
) => {
  if (!user?.uid) return;

  const userRef = doc(db, 'users', user.uid);

  const updateData: any = {
    uid: user.uid,
    email: user.email,
    createdAt: new Date().toISOString(),
  };

  if (data?.firstName !== undefined) updateData.firstName = data.firstName;
  if (data?.lastName !== undefined) updateData.lastName = data.lastName;
  if (data?.displayName !== undefined) updateData.displayName = data.displayName;
  if (data?.onboardingComplete !== undefined) updateData.onboardingComplete = data.onboardingComplete;
  if (data?.avatarId !== undefined) updateData.avatarId = data.avatarId;

  try {
    await setDoc(userRef, updateData, { merge: true });
  } catch (error) {
    console.error('❌ Failed to save user to Firestore:', error);
    throw error;
  }
};
