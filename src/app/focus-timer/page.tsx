'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Nunito } from 'next/font/google';
import { EmbedBlock } from '@/components/EmbedBlock';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

const nunito = Nunito({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function FocusTimerPage() {
  const router = useRouter();
  const [timeInput, setTimeInput] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [quote, setQuote] = useState('');
  const [showEmbed, setShowEmbed] = useState(true);
  const [isPomodoro, setIsPomodoro] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [alarm, setAlarm] = useState<HTMLAudioElement | null>(null);
  const { user } = useFirebaseUser();
  const [adaptiveMode, setAdaptiveMode] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAlarm(new Audio('/sounds/alarm.mp3'));
    }
  }, []);

  useEffect(() => {
    setSecondsLeft(timeInput * 60);
  }, [timeInput]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleTimerEnd = async () => {
      if (alarm) {
        try {
          await alarm.play();
        } catch (err) {
          console.warn('Playback error:', err);
        }
      }

      if (user?.uid) {
        const ref = doc(db, 'users', user.uid, 'focusStats', 'session');
        const today = new Date().toISOString().split('T')[0];

        try {
          const snap = await getDoc(ref);
          let streak = 1;
          let totalSessions = 1;
          let totalFocusTime = timeInput * 60;
          let badges: string[] = [];

          if (snap.exists()) {
            const data = snap.data();
            const last = data.lastSessionDate;
            const wasYesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0] === last;

            streak = wasYesterday ? data.streak + 1 : 1;
            totalSessions = data.totalSessions + 1;
            totalFocusTime = (data.totalFocusTime || 0) + timeInput * 60;
            badges = [...(data.badges || [])];

            if (streak === 3 && !badges.includes('3-day-streak')) badges.push('3-day-streak');
            if (totalSessions === 1 && !badges.includes('first-session')) badges.push('first-session');
            if (totalSessions === 10 && !badges.includes('10-session-club')) badges.push('10-session-club');
          } else {
            badges = ['first-session'];
          }

          await setDoc(
            ref,
            {
              lastSessionDate: today,
              streak,
              totalSessions,
              totalFocusTime,
              badges,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (err) {
          console.error('Failed to update focus streak:', err);
        }
      }

      if (isPomodoro) {
        const nextRounds = rounds + 1;
        setRounds(nextRounds);

        if (!isBreak) {
          setSecondsLeft(nextRounds % 4 === 0 ? 30 * 60 : 5 * 60);
          setIsBreak(true);
        } else {
          setSecondsLeft(25 * 60);
          setIsBreak(false);
        }
      } else {
        setTimeout(() => router.push('/you-did-it'), 10000);
      }
    };

    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    } else if (isRunning && secondsLeft === 0) {
      handleTimerEnd();
    }

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, isPomodoro, isBreak, rounds, alarm, router, user, timeInput]);

  useEffect(() => {
    const fetchSuggestedMode = async () => {
      if (!user?.uid) return;

      try {
        const ref = doc(db, 'users', user.uid, 'moodStats', 'lastSuggestedMode');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
if (data.mode) {
  setAdaptiveMode(data.mode);

  // Only override default if not manually changed
  setTimeInput((prev) => {
    if (prev !== 25) return prev;

    let minutes = 25;
    if (data.mode === 'Deep Focus') minutes = 50;
    else if (data.mode === 'Light Flow') minutes = 30;
    else if (data.mode === 'Recovery') minutes = 15;

    setSecondsLeft(minutes * 60); // ⬅️ explicitly update countdown too
    return minutes;
  });
}
        }
      } catch (err) {
        console.error('Failed to load suggested mode:', err);
      }
    };

    fetchSuggestedMode();
  }, [user]);

  useEffect(() => {
    try {
      //@ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  useEffect(() => {
    const quotes = [
      "Stop scrolling. Hit the button.",
      "You're not gonna focus yourself.",
      "Just one click away from greatness.",
      "This is the most serious site on the internet.",
      "You're already winning just by being here. Now prove it.",
    ];
    if (!isRunning) {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  }, [isRunning]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const secsRemain = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secsRemain).padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
    setShowEmbed(false);
  };

  return (
    <main className="font-nunito w-full overflow-x-hidden min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4 flex flex-col items-center">
      <div className="text-3xl font-bold tracking-tight text-white mb-1">
      <span className="text-green-400">isit</span>focustime<span className="text-green-400">.com</span>
      </div>
      <p className="text-4xl font-black tracking-tight mb-2">Focus Timer</p>

      {!isRunning && <p className="text-xl mb-4 text-center">{quote}</p>}

      {!isRunning && adaptiveMode && (
        <p className="text-sm text-purple-300 mb-2">
          Suggested: <span className="font-bold">{adaptiveMode}</span> (
          {adaptiveMode === 'Deep Focus' ? '50 min' :
           adaptiveMode === 'Light Flow' ? '30 min' :
           adaptiveMode === 'Recovery' ? '15 min' : '25 min'}
          )
        </p>
      )}

      {!isRunning && (
        <div className="mb-4 flex flex-col items-center">
          <label className="text-sm font-medium mb-2">Choose your focus time (minutes):</label>
          <input
            type="number"
            min={1}
            max={120}
            value={timeInput}
            onChange={(e) => setTimeInput(Number(e.target.value))}
            className="w-24 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-600 text-center"
          />
        </div>
      )}

      {isPomodoro && (
        <p className="text-sm text-zinc-500 mb-4">
          {isBreak ? 'Break Time' : 'Focus Time'} (Round {rounds % 4 || 1}/4)
        </p>
      )}

      <AnimatePresence>
        {isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.3, 0.2],
              scale: [1, 1.35, 1],
              background: [
                'radial-gradient(circle at center, #22c55e 0%, transparent 70%)',
                'radial-gradient(circle at center, #4ade80 0%, transparent 70%)',
                'radial-gradient(circle at center, #22c55e 0%, transparent 70%)'
              ],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', width: '20rem', height: '20rem', borderRadius: '9999px', zIndex: 0 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="text-6xl mb-6 font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {formatTime(secondsLeft)}
      </motion.div>

      {!isRunning && (
        <button
          onClick={startTimer}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-lg rounded-xl mb-4 transition"
        >
          Start Focus Session
        </button>
      )}

      {!isRunning && (
        <div className="text-sm mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPomodoro}
              onChange={() => setIsPomodoro(!isPomodoro)}
            />
            Enable Real Pomodoro Mode (25/5/30)
          </label>
        </div>
      )}

      {!isRunning && (
        <nav className="text-sm space-x-4">
          <Link href="/breathe-timer" className="text-blue-400 hover:underline mb-4">
            Try Breathe Timer
          </Link>
          <Link href="/meditation-player" className="text-green-400 hover:underline mb-4">
            Meditation
          </Link>
        </nav>
      )}

      {showEmbed && <EmbedBlock />}

      <div className="my-8 flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '728px', height: '90px' }}
          data-ad-client="ca-pub-4813693653154178"
          data-ad-slot="8997853730"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <ins
          className="adsbygoogle inline-block md:hidden"
          style={{ width: '300px', height: '250px' }}
          data-ad-client="ca-pub-4813693653154178"
          data-ad-slot="8997853730"
        />
      </div>
    </main>
  );
}
