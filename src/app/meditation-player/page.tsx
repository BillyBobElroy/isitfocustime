'use client';

import { MeditationPlayer } from '@/components/MEditationPlayer';
import { Nunito } from 'next/font/google';
import Link from 'next/link';

const nunito = Nunito({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function MeditationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white px-6 py-12">
            <div className="max-w-md w-full space-y-8">
            <div className="text-center">
      <h1 className={`${nunito.className} text-4xl font-bold mb-4`}>isitfocustime.com</h1>
      <p className="text-4xl font-bold mb-8">Meditation Timer</p>

      <MeditationPlayer />

      <nav className="text-sm space-x-4 text-center mt-4">
          <Link href="/" className="text-green-400 hover:underline mb-4">Focus & Breathe Timer</Link>
          <Link href="/gratitude-journal" className="text-green-400 hover:underline mb-4">Gratitude Journal</Link>
          </nav>

      <div className="my-8 flex justify-center">
            <ins
              className="adsbygoogle"
              style={{ display: 'inline-block', width: '728px', height: '90px' }}
              data-ad-client="ca-pub-4813693653154178"
              data-ad-slot="8997853730"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />

            
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4813693653154178"
     crossOrigin="anonymous"></script>
            <ins
              className="adsbygoogle inline-block md:hidden"
              style={{ width: '300px', height: '250px' }}
              data-ad-client="ca-pub-4813693653154178"
              data-ad-slot="8997853730"
            />
          </div>
    </div>
    </div>
    </div>
  );
}
