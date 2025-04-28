'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkStyle = (path: string) =>
    `hover:text-green-400 transition ${
      pathname === path ? 'underline underline-offset-4 text-green-400' : ''
    }`;

  return (
    <nav className="w-full bg-zinc-900 text-white py-4 px-6 shadow-md flex justify-between items-center relative">
      <div className="text-lg font-bold">
        <Link href="/">isitfocustime.com</Link>
      </div>

      <div className="space-x-4 text-sm flex items-center">
        <Link href="/" className={linkStyle('/')}>
          Focus Timer
        </Link>

        {/* Dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hover:text-green-400 transition focus:outline-none"
          >
            Timers ▼
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-lg shadow-lg py-2 z-50">
              <Link
                href="/meditation-player"
                className="block px-4 py-2 hover:bg-zinc-700"
                onClick={() => setMenuOpen(false)}
              >
                Meditation Player
              </Link>
            </div>
          )}
        </div>

                {/* Dropdown trigger */}
                <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hover:text-green-400 transition focus:outline-none"
          >
            Journals ▼
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-lg shadow-lg py-2 z-50">
              <Link
                href="/mood-tracker"
                className="block px-4 py-2 hover:bg-zinc-700"
                onClick={() => setMenuOpen(false)}
              >
                Mood Tracker
              </Link>
              <Link
                href="/gratitude-journal"
                className="block px-4 py-2 hover:bg-zinc-700"
                onClick={() => setMenuOpen(false)}
              >
                Gratitude Journal
              </Link>
            </div>
          )}
        </div>

        {/* Blog stays outside dropdown */}
        <Link href="/blog" className={linkStyle('/blog')}>
          Blog
        </Link>
      </div>
    </nav>
  );
}
