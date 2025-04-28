'use client';

import { MeditationPlayer } from '@/components/MEditationPlayer';

export default function MeditationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center font-nunito">Meditation Timer</h1>

      <MeditationPlayer />
    </div>
  );
}
