'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Space_Mono } from 'next/font/google';
import { EmbedBlock } from '@/components/EmbedBlock';
import BreatheTimer from '@/components/BreatheTimer';
import { MeditationPlayer } from '@/components/MEditationPlayer';

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {
  const router = useRouter() as any;
  const [timeInput, setTimeInput] = useState(25); // default in minutes
  const [secondsLeft, setSecondsLeft] = useState(timeInput * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [quote, setQuote] = useState('');
  const [showEmbed, setShowEmbed] = useState(true);
  const [isPomodoro, setIsPomodoro] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const alarm = typeof window !== 'undefined' ? new Audio('/sounds/alarm.mp3') : null;

  useEffect(() => {
    setSecondsLeft(timeInput * 60);
  }, [timeInput]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
  
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      if (alarm) {
        alarm.play();
      }
  
      if (isPomodoro) {
        const nextPhase = isBreak ? 'focus' : 'break';
        setIsBreak(!isBreak);
        setSecondsLeft(nextPhase === 'focus' ? timeInput * 60 : 5 * 60);
      } else {
        setTimeout(() => {
          router.push(`/you-did-it`);
        }, 10000); // Wait 10s before redirect
      }
    }
  
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, isPomodoro, isBreak]);

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  // Meme layer: rotating quotes
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

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const secsRemain = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secsRemain).padStart(2, '0')}`;
  };

  const startBreatheMode = () => {
    setIsBreathing(true);
    setShowEmbed(true);
    setIsRunning(false); // extra safety
  
    setTimeout(() => {
      setIsBreathing(false);
      setQuote('Feeling calmer? Ready to focus?');
    }, 30000);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white px-4">
      {isBreathing ? (
        <BreatheTimer />
      ) : (
        <>
          <h1 className={`${spaceMono.className} text-4xl font-bold mb-4`}>isitfocustime.com</h1>
          <p className="text-xl mb-2 text-center">{quote}</p>
          {!isRunning && <p className="text-sm text-zinc-400 mb-4">{getTimeSnark()}</p>}
  
          {!isRunning && (
            <div className="mb-4 text-center flex flex-col items-center justify-center">
              <label className="block mb-2 text-sm font-medium">Choose your focus time (minutes):</label>
              <input
                type="number"
                min={1}
                max={120}
                value={timeInput}
                onChange={(e) => setTimeInput(Number(e.target.value))}
                className="w-24 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-white text-center"
              />
              {timeInput >= 60 && (
                <p className="text-yellow-400 text-sm mt-4">💀 That's a long one. Don’t forget to blink.</p>
              )}
            </div>
          )}

          {isPomodoro && (
            <p className="text-sm text-zinc-400 mb-4">
              {isBreak ? 'Break Time' : 'Focus Time'}
            </p>
          )}
  
          <div className="text-6xl font-mono mb-4">{formatTime(secondsLeft)}</div>
  
          {!isRunning && (
            <button
              onClick={startTimer}
              className="px-6 py-3 bg-green-500 text-white text-lg rounded-lg hover:bg-green-600 transition"
            >
              Start Focus Session
            </button>
          )}

          <MeditationPlayer />
  
          {!isRunning && !isBreathing && (
            <button
              onClick={startBreatheMode}
              className="mt-4 px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Start 30-Second Breathe Reset
            </button>
          )}
  
          {!isRunning && (
            <div className="mt-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isPomodoro}
                  onChange={() => setIsPomodoro(!isPomodoro)}
                />
                Enable Real Pomodoro Mode (25/5)
              </label>
            </div>
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
        </>
      )}
    </main>
  );
}  