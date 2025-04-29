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
  title: 'isitfocustime – Focus, Mindfulness, Meditation & Productivity Tools',
  description: 'Use our simple focus timer, guided breathing exercises, gratitude journal, and mood tracker to boost your productivity and mental wellbeing — all distraction-free and ad-free.',
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
  ],
  openGraph: {
    title: 'isitfocustime – Free Focus, Meditation, and Mindfulness Tools',
    description: 'Boost focus and mental clarity naturally. Free tools: 25-minute timer, guided breathing, gratitude journal, mood tracker, and habit builder.',
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
    description: 'Minimalist focus, mindfulness, and productivity tools. Start a 25-minute focus session, a 5-minute meditation, or track gratitude and mood — distraction-free.',
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
        <Footer />
      </body>
  </html>
  </>
  );
}
