'use client';

import { useState } from 'react';
import BreatheTimer from '@/components/BreatheTimer';
import Link from 'next/link';

export default function BreatheTimerPage() {
  const [started, setStarted] = useState(false);

  return (
    <main className="font-nunito w-full overflow-x-hidden min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold tracking-tight text-white mb-1">
          <span className="text-green-400">isit</span>focustime<span className="text-green-400">.com</span>
          </div>
          <p className="text-4xl font-black tracking-tight mb-4">🫁 Breathe Timer</p>
      <p className="text-lg mb-6 text-center max-w-md">
        Take a calming 30-second breath break. Focus on your breath and reset your mind.
      </p>

      {!started ? (
        <button
          onClick={() => setStarted(true)}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-xl transition"
        >
          Start Breathe Timer
        </button>
      ) : (
        <BreatheTimer />
      )}

      <div className="mt-10 text-sm text-center">
        <p className="mb-2">Need more tools?</p>
        <Link href="/focus-timer" className="text-green-400 hover:underline">Back to Focus Timer</Link>
      </div>

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
