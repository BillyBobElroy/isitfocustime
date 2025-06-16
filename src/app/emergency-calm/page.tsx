'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const messages = [
  "Take a slow breath in...",
  "Now exhale gently...",
  "Feel your feet on the ground...",
  "You are safe in this moment...",
  "Let your shoulders relax...",
  "Let go of tension bit by bit..."
];

export default function EmergencyCalmPage() {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentMessage(messages[index]);
  }, [index]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white flex flex-col items-center justify-center px-6 py-12 font-nunito">
      <h1 className="text-3xl font-bold mb-6 text-center">🆘 Emergency Calm Mode</h1>

      <motion.div
        className="w-48 h-48 rounded-full bg-blue-500/30 border-4 border-blue-400 mb-8"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.p
        key={currentMessage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-lg text-center px-4 max-w-md"
      >
        {currentMessage}
      </motion.p>

      <div className="mt-10 flex flex-col items-center gap-4">
        <Link href="/breathe-timer" className="text-blue-300 underline">Try Full Breathing Timer</Link>
        <Link href="/meditation-player" className="text-blue-300 underline">Go to Meditation</Link>
        <Link href="/" className="text-sm text-zinc-400 mt-8">Return to Dashboard</Link>
      </div>
    </main>
  );
}
