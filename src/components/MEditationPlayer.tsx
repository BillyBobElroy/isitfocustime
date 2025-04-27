'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MeditationPlayer() {
  const [isMeditating, setIsMeditating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [colorIndex, setColorIndex] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const colors = ['#6EE7B7', '#93C5FD', '#FBCFE8', '#FDE68A', '#A5B4FC', '#FCA5A5', '#A7F3D0', '#BFDBFE', '#DDD6FE', '#FDE68A', '#FBCFE8', '#C7D2FE', '#FECDD3', '#FCD34D']; // Pastel colors

  useEffect(() => {
    if (isMeditating) {
      // Start meditation timer
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            stopMeditation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Start color cycle
      const colorTimer = setInterval(() => {
        setColorIndex((prev) => (prev + 1) % colors.length);
      }, 5000);

      // Play audio
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }

      return () => {
        clearInterval(intervalRef.current!);
        clearInterval(colorTimer);
      };
    }
  }, [isMeditating]);

  const handleStart = () => {
    setIsMeditating(true);
    setTimeLeft(5 * 60); // Reset 5 minutes
  };

  const stopMeditation = () => {
    setIsMeditating(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <audio ref={audioRef} src="/sounds/meditation.mp3" preload="auto" />

      {!isMeditating && (
        <button
          onClick={handleStart}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Start 5-Minute Meditation
        </button>
      )}

      <AnimatePresence>
        {isMeditating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, backgroundColor: colors[colorIndex] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 flex flex-col items-center justify-center z-50"
          >
            {/* Breathing Circle */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-48 h-48 bg-white rounded-full opacity-20"
            />

            {/* Timer */}
            <p className="mt-8 text-2xl font-bold text-white">{formatTime(timeLeft)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}