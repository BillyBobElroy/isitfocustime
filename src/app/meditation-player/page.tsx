'use client';

import { MeditationPlayer } from '@/components/MEditationPlayer';
import { Nunito } from 'next/font/google';

const nunito = Nunito({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function MeditationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white px-6 py-12">
      <h1 className={`${nunito.className} text-4xl font-bold mb-4`}>isitfocustime.com</h1>
      <p className="text-4xl font-bold mb-8">Meditation Timer</p>

      <MeditationPlayer />
    </div>
  );
}
