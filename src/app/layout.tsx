import './globals.css';
import { Nunito, Nunito_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const nunito = Nunito({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'isitfocustime – Focus & Mindfulness Tools for Better Productivity',
  description: 'A minimalist focus and mindfulness platform. Start 25-minute focus sessions, 5-minute meditations, track moods, and journal gratitude — all distraction-free. Boost your productivity and mental clarity naturally.',
  openGraph: {
    title: 'isitfocustime – Focus Timer, Meditation, Mood Tracker & More',
    description: 'Focus deeper with a 25-minute timer, meditation mode, mood tracker, and gratitude journal. Minimalist. Free. No distractions.',  
    images: ['/og-image.png'],
  },
  keywords: [
    'focus timer online',
    '25 minute focus timer',
    '5 minute meditation timer',
    'simple pomodoro timer',
    'minimalist productivity tools',
    'focus time meme',
    'daily gratitude journal templates free',
    'gratitude journal templates free',
    'free online mood tracker',
    'best 30 second breathe timers free',
    'best 30 second focus timers free',
    'focus and mindfulness tools free',
    'online breathing exercise timer',
    'meditation timer with calming background',
    'daily mood tracker free tool',
    'gratitude and mood journaling app',
    'calm down timers online free',
    'focus apps without ads',
    'relaxation breathing bubble online',
    'pomodoro alternative for ADHD focus',
    'simple 5-minute meditation practice',
    'guided breathing exercise online',
    'mood journal templates printable free',
    'improve focus and productivity naturally',
    'habit trackers for focus and wellness',
  ],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <Navbar />
    <html lang="en">
      <body className={nunito.className}>{children}</body>
    </html>
  <Footer />
  </>
  );
}
