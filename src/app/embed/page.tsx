'use client';

import { useState, useEffect } from 'react';

export default function EmbedTimer() {
  const [secondsLeft, setSecondsLeft] = useState(1500); // default: 25 min
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const startTimer = () => setIsRunning(true);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-zinc-800 text-white rounded-lg shadow-lg text-center">
      <div className="text-2xl font-mono mb-2">{formatTime(secondsLeft)}</div>
      {!isRunning && (
        <button
          onClick={startTimer}
          className="text-sm px-4 py-1 bg-green-500 rounded hover:bg-green-600 transition"
        >
          Start Focus
        </button>
      )}
    </div>
  );
}