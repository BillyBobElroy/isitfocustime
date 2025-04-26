import './globals.css';
import { Space_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'isitfocustime – Simple 25-Minute Focus Timer Online',
  description: 'A minimalist, distraction-free focus timer online. Start a 25-minute session instantly. Simple pomodoro alternative for productivity, studying, and memes.',
  openGraph: {
    title: 'isitfocustime – Focus Timer Online',
    description: 'Ridiculously simple 25-minute focus timer. A minimalist pomodoro-style site with meme energy. No distractions, just focus.',
    images: ['/og-image.png'],
  },
  keywords: [
    'focus timer online',
    '25 minute focus timer',
    'simple pomodoro timer',
    'minimalist productivity tools',
    'focus time meme'
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
      <body className={spaceMono.className}>{children}</body>
    </html>
  <Footer />
  </>
  );
}
