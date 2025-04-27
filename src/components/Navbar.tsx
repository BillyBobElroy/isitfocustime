'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    `hover:text-green-400 transition ${
      pathname === path ? 'underline underline-offset-4 text-green-400' : ''
    }`;

  return (
    <nav className="w-full bg-zinc-900 text-white py-4 px-6 shadow-md flex justify-between items-center">
      <div className="text-lg font-bold">
        <Link href="/">isitfocustime.com</Link>
      </div>
      <div className="space-x-4 text-sm">
        <Link href="/" className={linkStyle('/')}>
          Focus Timer
        </Link>
        <Link href="/mood-tracker" className={linkStyle('/mood-tracker')}>
          Mood Tracker
        </Link>
        <Link href="/gratitude-journal" className={linkStyle('/gratitude-journal')}>
          Gratitude Journal
        </Link>
        <Link href="/blog" className={linkStyle('/blog')}>
          Blog
        </Link>
      </div>
    </nav>
  );
}
