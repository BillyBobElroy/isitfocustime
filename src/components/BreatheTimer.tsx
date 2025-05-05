'use client';

import { useEffect, useState } from 'react';

const calmingMessages = [
  "Inhale calm, exhale tension.",
  "You are exactly where you need to be.",
  "Let your thoughts drift like clouds.",
  "Breathe deeply. You're doing great.",
  "Let the moment be enough.",
  "Inhale strength. Exhale doubt.",
  "One breath at a time.",
  "You are safe. You are steady.",
  "Your breath is your anchor.",
  "Inhale peace. Exhale stress.",
  "Return to now. Return to calm.",
  "Allow yourself this moment.",
  "You're grounded. You're present.",
  "This breath connects you to stillness.",
  "You are calm. You are clear.",
  "Every breath resets the moment.",
  "Let go of tension with each exhale.",
  "You’re doing just fine.",
  "Keep breathing, gently and slowly.",
  "Find the rhythm of peace.",
  "Trust the breath. Trust the pause.",
  "Nothing to fix. Just to breathe.",
  "You are not your thoughts.",
  "Ease in. Ease out.",
  "Stillness is strength.",
];

export default function BreatheTimer() {
  const [seconds, setSeconds] = useState(30);
  const [message, setMessage] = useState('');
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    const messageInterval = setInterval(() => {
      const random = Math.floor(Math.random() * calmingMessages.length);
      setMessage(calmingMessages[random]);
    }, 10000);

    setMessage(calmingMessages[Math.floor(Math.random() * calmingMessages.length)]);
  
    const countdown = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          clearInterval(messageInterval);
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
  
    const pulse = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.3 : 1));
    }, 3000);
  
    return () => {
      clearInterval(countdown);
      clearInterval(messageInterval);
      clearInterval(pulse);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-10 mb-6">
      <div
        className="w-40 h-40 rounded-full bg-blue-400 transition-transform duration-3000 ease-in-out"
        style={{ transform: `scale(${scale})` }}
      />
      <p className="text-6xl font-nunito mt-6">{seconds > 0 ? seconds : 'Done'}</p>
      <p className="text-xl mt-4 italic max-w-md text-blue-100">{message}</p>
    </div>
  );
}
