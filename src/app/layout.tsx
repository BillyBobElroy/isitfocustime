import './globals.css';
import { Nunito, Nunito_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Analytics } from "@vercel/analytics/next"

const nunito = Nunito({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'isitfocustime – Focus, Mindfulness, Meditation & Productivity Tools',
  description: 'Boost your focus, build habits, and support your mental wellbeing with our free online tools. Use our 25-minute focus timer, 5-minute journal, breathing exercises, habit tracker, and more — all distraction-free.',
  keywords: [
    'focus timer online',
    '25 minute focus session',
    'simple pomodoro alternative',
    'minimalist productivity app',
    'daily gratitude journal template',
    'mood tracking app free',
    'online meditation timer',
    'breathing exercise timer',
    'mental wellbeing tools free',
    'habit tracker online',
    'calm breathing bubble',
    'adhd focus timers',
    'free mindfulness app',
    'focus tools without ads',
    'relaxation timers',
    'daily mood log',
    'gratitude app no login',
    '5 minute meditation session',
    'guided breathing timer free',
    'productive study timer',
    'build positive habits',
    'self improvement toolkit',
    'daily focus routine',
    '5 minute journal template',
    'adhd productivity tools',
    'box breathing exercise online',
    'habit tracker without login',
    'mood tracker for anxiety',
    'gratitude prompts daily',
    'meditation timer no ads',
    'guided mindfulness timer',
    'journal for self reflection',
    'digital wellness tools',
    'timer for deep work',
    'distraction-free focus session',
    'study with me timer',
    'calm down breathing tool',
    'free productivity dashboard',
    'mental health check-in tool',
    'build daily habits online',
    'mindfulness tools for students',
    'routine tracker app free',
  ],
  openGraph: {
    title: 'isitfocustime – Free Focus, Meditation, and Mindfulness Tools',
    description: 'Focus better and feel calmer with our minimalist wellness suite: 25-minute timer, guided breathing, mood tracker, gratitude journal, and habit builder — all free.',
    url: 'https://isitfocustime.com', 
    siteName: 'isitfocustime.com',
    images: [
      {
        url: '/og-image.png', // customize later if needed
        width: 1200,
        height: 630,
        alt: 'isitfocustime – Focus and Mindfulness Platform',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'isitfocustime – Boost Focus and Calm Your Mind',
    description: 'Use our free, tools to focus, build better habits, and track your mental health: 5-minute journal, deep focus timer, mood log, and more.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL('https://isitfocustime.com'), // 📦 (optional but good for absolute URL building)
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <html lang="en">
      <body className={nunito.className}>
        <Navbar />
        {children}
          <Analytics />
        <Footer />
      </body>
  </html>
  </>
  );
}
