'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import { saveUserToFirestore } from '@/lib/saveUserToFirestore';
import { avatarUnlocks } from "@/lib/avatarUnlockConditions";

const avatars = [
  { id: 'focusfox', label: 'Focus Fox', image: '/avatars/characters/focusfox.png' },
  { id: 'zenzo', label: 'Zenzo', image: '/avatars/characters/zenzo.png' },
  { id: 'breezy', label: 'Breezy', image: '/avatars/characters/breezy.png' },
  { id: 'glowbear', label: 'Glow Bear', image: '/avatars/characters/glowbear.png' },
  { id: 'drift', label: 'Drift', image: '/avatars/characters/drift.png' },
  { id: 'luma', label: 'Luma', image: '/avatars/characters/luma.png' },
  { id: 'sprout', label: 'Sprout', image: '/avatars/characters/sprout.png' },
];

export default function AvatarModal({
  selectedAvatar,
  onClose,
  refetchUser,
}: {
  selectedAvatar: string;
  onClose: () => void;
  refetchUser: () => Promise<void>; // ✅ type hint
}) {
  const [current, setCurrent] = useState(selectedAvatar);
  const { user } = useFirebaseUser();

const handleSave = async () => {
  if (!user) return;
  try {
    await saveUserToFirestore(user, { avatarId: current });
    await refetchUser(); // ✅ now from dashboard
    onClose();
  } catch (err) {
    console.error('Error saving avatar:', err);
  }
};

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 p-6 rounded-2xl w-full max-w-md text-blue-500 shadow-xl"
      >
        <h2 className="text-xl font-bold mb-4">Choose Your Avatar</h2>
        <div className="grid grid-cols-2 gap-4">
          {avatars.map((a) => (
            <button
              key={a.id}
              onClick={() => setCurrent(a.id)}
              className={`border rounded-xl p-4 flex flex-col items-center justify-center transition shadow-md hover:shadow-lg ${
                current === a.id ? 'border-green-500 bg-green-50' : 'border-zinc-300'
              }`}
            >
              <Image
                src={a.image}
                alt={a.label}
                width={64}
                height={64}
                className="rounded-full mb-2"
              />
              <span className="text-sm font-medium">{a.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white hover:text-zinc-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save Avatar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
