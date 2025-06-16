'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Guide() {
  const [showWave, setShowWave] = useState(false);
  const pathname = usePathname();

  // 👇 Define guide messages per route
  const guideMessages: Record<string, { title: string; subtitle: string }> = {
    '/dashboard': {
      title: 'Welcome back! 👋',
      subtitle: 'This is your daily hub. Click your avatar to customize it.',
    },
    '/focus-timer': {
      title: 'Ready to focus?',
      subtitle: 'Set your timer and enter a deep work zone.',
    },
    '/meditation-player': {
      title: 'Let’s breathe. 🌿',
      subtitle: 'Pick a session to begin your mindful moment.',
    },
    '/gratitude-journal': {
      title: 'Grateful thoughts ✨',
      subtitle: 'Write down something that made you smile today.',
    },
    // fallback
    default: {
      title: 'Hi there! 👋',
      subtitle: 'I’m your guide. Let’s get focused!',
    },
  };

  const message = guideMessages[pathname] || guideMessages.default;

  useEffect(() => {
    if (!sessionStorage.getItem('guideGreeted')) {
      setShowWave(true);
      sessionStorage.setItem('guideGreeted', 'true');
      setTimeout(() => setShowWave(false), 4000);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-zinc-800 text-white px-4 py-3 rounded-xl shadow-xl max-w-sm"
    >
      <motion.div
        animate={showWave ? { rotate: [0, 20, -10, 10, 0] } : {}}
        transition={{ duration: 1, repeat: 1 }}
      >
        <Image src="/guide/wave.png" alt="Guide" width={48} height={48} />
      </motion.div>
      <div>
        <p className="font-bold">{message.title}</p>
        <p className="text-sm text-zinc-300">{message.subtitle}</p>
      </div>
    </motion.div>
  );
}
