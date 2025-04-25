'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function YouDidIt() {
  const [quote, setQuote] = useState('');
  const { width, height } = useWindowSize();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const quotes = [
      "You did it! You focused like a beast. 💪",
      "Legend status achieved. Now take a break.",
      "That was pure discipline. 👑",
      "Look at you go! Productivity unlocked.",
      "You crushed it. No distractions, just results."
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white text-center px-4">
      {hasMounted && <Confetti width={width} height={height} />}
      <h1 className="text-5xl font-bold mb-6">🎉 You Did It!</h1>
      <p className="text-2xl mb-6">{quote}</p>

      <div className="my-8 flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '728px', height: '90px' }}
          data-ad-client="ca-pub-4813693653154178"
          data-ad-slot="8997853730"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

      <Link href="/">
        <button className="px-6 py-3 bg-white text-green-900 text-lg font-semibold rounded-lg hover:bg-gray-100 transition">
          Start Another Session
        </button>
      </Link>
    </main>
  );
}
