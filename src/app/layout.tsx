import './globals.css';
import { Space_Mono } from 'next/font/google';
import type { Metadata } from 'next';

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'isitfocus.time',
  description: 'A ridiculously simple focus timer.',
  openGraph: {
    title: 'isitfocus.time',
    description: 'Start focusing right now.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={spaceMono.className}>{children}</body>
    </html>
  );
}
