// types/FirestoreUser.ts
export type FirestoreUser = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  onboardingComplete?: boolean;
  avatarId?: string;
  unlockedAvatars?: string[];
};
