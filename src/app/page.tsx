'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Nunito } from 'next/font/google';
import { EmbedBlock } from '@/components/EmbedBlock';
import BreatheTimer from '@/components/BreatheTimer';
import { motion, AnimatePresence } from 'framer-motion';

const nunito = Nunito({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function HomePage() {
  const router = useRouter();
  const [timeInput, setTimeInput] = useState(25); // default minutes
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [quote, setQuote] = useState('');
  const [showEmbed, setShowEmbed] = useState(true);
  const [isPomodoro, setIsPomodoro] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [alarm, setAlarm] = useState<HTMLAudioElement | null>(null);

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
  
      if (isPomodoro) {
        const nextRounds = rounds + 1;
        setRounds(nextRounds);
  
        if (!isBreak) {
          if (nextRounds % 4 === 0) {
            setSecondsLeft(30 * 60); // Long break
          } else {
            setSecondsLeft(5 * 60); // Short break
          }
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
      timer = setInterval(() => setSecondsLeft(prev => prev - 1), 1000);
    } else if (isRunning && secondsLeft === 0) {
      handleTimerEnd(); // call async wrapper
    }
  
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, isPomodoro, isBreak, rounds, alarm, router]);  

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

  const getTimeSnark = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "You're up early... or never slept.";
    if (hour < 12) return "Morning grind. Respect.";
    if (hour < 18) return "Prime productivity time. Go!";
    return "Still working? You beast.";
  };

  const startTimer = () => {
    setIsRunning(true);
    setShowEmbed(false);
  };

  const startBreatheMode = () => {
    const chime = new Audio('/sounds/chime.mp3');
    chime.volume = 0.6;
    try {
      chime.play(); // user gesture-triggered
    } catch (e) {
      console.warn('Autoplay blocked:', e);
    }
  
    setIsBreathing(true);
    setShowEmbed(true);
    setIsRunning(false);
  
    setTimeout(() => {
      setIsBreathing(false);
      setQuote('Feeling calmer? Ready to focus?');
      chime.pause(); // optional, depending on how long your chime is
    }, 30000);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const secsRemain = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secsRemain).padStart(2, '0')}`;
  };

  return (
    <main className="font-nunito w-full overflow-x-hidden min-h-screen bg-zinc-900 text-white flex flex-col items-center px-4 py-12">
      {isBreathing ? (
        <BreatheTimer />
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-4">isitfocustime.com</h1>
          <p className="text-4xl font-bold mb-4">Focus Timer</p>
          {!isRunning && (
          <p className="text-xl mb-4 text-center">{quote}</p>
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

          {isPomodoro && <p className="text-sm text-zinc-500 mb-4">{isBreak ? 'Break Time' : 'Focus Time'} (Round {rounds % 4 || 1}/4)</p>}
          
          <AnimatePresence>
  {isRunning && !isBreathing && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.15, scale: [1, 1.4, 1] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute w-80 h-80 rounded-full bg-green-400 blur-3xl opacity-20"
    />
  )}
</AnimatePresence>

          <div className="text-6xl mb-6 font-bold">{formatTime(secondsLeft)}</div>

          {!isRunning && (
            <button onClick={startTimer} className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-lg rounded-xl mb-4 transition">
              Start Focus Session
            </button>
          )}

          {!isRunning && (
            <button onClick={startBreatheMode} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl mb-4 transition">
              Start 30-Second Breathe Reset
            </button>
          )}

          {!isRunning && (
            <div className="text-sm mb-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={isPomodoro} onChange={() => setIsPomodoro(!isPomodoro)} />
                Enable Real Pomodoro Mode (25/5/30)
              </label>
            </div>
          )}

          {!isRunning && (
          <nav className="text-sm space-x-4">
          <Link href="/meditation-player" className="text-green-400 hover:underline mb-4">Meditation Session</Link>
          <Link href="/5-minute-journal" className="text-green-400 hover:underline mb-4">5 Minute Journal</Link>
          </nav>
          )}

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4813693653154178"
     crossOrigin="anonymous"></script>
          
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
        </>
      )}
    </main>
  );
}
