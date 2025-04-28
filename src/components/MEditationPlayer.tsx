'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MeditationPlayer() {
  const [isMeditating, setIsMeditating] = useState(false);
  const [sessionLength, setSessionLength] = useState(5); // Default 5 mins
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [colorIndex, setColorIndex] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const colors = ['#6EE7B7', '#93C5FD', '#FBCFE8', '#FDE68A', '#A5B4FC', '#FCA5A5', '#A7F3D0', '#BFDBFE', '#DDD6FE', '#FDE68A', '#FBCFE8', '#C7D2FE', '#FECDD3', '#FCD34D'];

  useEffect(() => {
    if (isMeditating) {
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

      const colorTimer = setInterval(() => {
        setColorIndex((prev) => (prev + 1) % colors.length);
      }, 10000);

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
    setTimeLeft(sessionLength * 60);

    if (audioRef.current) {
      audioRef.current.src = sessionLength === 5 ? '/sounds/meditation.mp3' : '/sounds/meditation1.mp3';
      audioRef.current.load(); // 👈 ensure it reloads the new audio
    }
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
      <audio ref={audioRef} preload="auto" />

      {!isMeditating && (
        <>
          <p className="text-zinc-400 text-sm mb-4 font-semibold">
            Select your meditation length:
          </p>

          <div className="flex gap-4 mb-6">
            {[5, 10].map((minutes) => (
              <motion.button
                key={minutes}
                onClick={() => setSessionLength(minutes)}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: sessionLength === minutes ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  sessionLength === minutes
                    ? 'bg-green-500 text-white'
                    : 'bg-zinc-700 text-white hover:bg-zinc-600'
                }`}
              >
                {minutes} min
              </motion.button>
            ))}
          </div>

          <button
            onClick={handleStart}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg"
          >
            Start {sessionLength}-Minute Meditation
          </button>
        </>
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
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="w-48 h-48 bg-white rounded-full opacity-20"
            />

            <p className="mt-8 text-2xl font-bold text-white">{formatTime(timeLeft)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}