'use client';

import { useState, useEffect, useRef } from 'react';

export function MeditationPlayer({ onMeditationEnd }: { onMeditationEnd?: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsPlaying(false);
            onMeditationEnd?.(); // Optional callback
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, onMeditationEnd]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-zinc-800 rounded-lg p-6 flex flex-col items-center text-center space-y-4 w-full">
      <h2 className="text-xl font-bold">🧘‍♂️ 5-Minute Meditation</h2>

      <button
        onClick={handlePlayPause}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
      >
        {isPlaying ? 'Pause Meditation' : 'Play Meditation'}
      </button>

      <p className="text-sm text-zinc-400">{formatTime(timeLeft)}</p>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/meditation.mp3"
        onEnded={() => {
          setIsPlaying(false);
          setTimeLeft(0);
          onMeditationEnd?.();
        }}
      />
    </div>
  );
}
