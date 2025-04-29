'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);

  const linkStyle = (path: string) =>
    `hover:text-green-400 transition ${
      pathname === path ? 'underline underline-offset-4 text-green-400' : ''
    }`;

  const handleMouseEnter = (menu: string) => {
    setHoveredDropdown(menu);
  };

  const handleMouseLeave = () => {
    setHoveredDropdown(null);
  };

  return (
    <nav className="w-full bg-zinc-900 text-white py-4 px-6 shadow-md flex justify-between items-center relative">
      <div className="text-lg font-bold">
        <Link href="/">isitfocustime.com</Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6 text-sm">
        <Link href="/" className={linkStyle('/')}>
          Focus Timer
        </Link>

{/* Timers Dropdown */}
<div
  className="relative group"
  onMouseEnter={() => handleMouseEnter('timer')}
  onMouseLeave={handleMouseLeave}
>
  <button className="hover:text-green-400 transition flex items-center gap-1">
    Timers
    <span
      className={`transform transition-transform ${
        hoveredDropdown === 'timer' ? 'rotate-180' : 'rotate-0'
      }`}
    >
      ▼
    </span>
  </button>

  {/* Make the dropdown a child inside the same container */}
  <div
    className={`absolute right-0 mt-2 w-48 bg-zinc-800 rounded-lg shadow-lg py-2 z-50 transition-all duration-200 ${
      hoveredDropdown === 'timer' ? 'opacity-100 visible' : 'opacity-0 invisible'
    }`}
  >
    <Link
      href="/meditation-player"
      className="block px-4 py-2 hover:bg-zinc-700"
    >
      Meditation Player
    </Link>
  </div>
</div>

 {/* Journals & Trackers Dropdown */}
<div
  className="relative group"
  onMouseEnter={() => handleMouseEnter('tools')}
  onMouseLeave={handleMouseLeave}
>
  <button className="hover:text-green-400 transition flex items-center gap-1">
    Journals & Trackers
    <span
      className={`transform transition-transform ${
        hoveredDropdown === 'tools' ? 'rotate-180' : 'rotate-0'
      }`}
    >
      ▼
    </span>
  </button>

  <div
    className={`absolute right-0 mt-2 w-48 bg-zinc-800 rounded-lg shadow-lg py-2 z-50 transition-all duration-200 ${
      hoveredDropdown === 'tools' ? 'opacity-100 visible' : 'opacity-0 invisible'
    }`}
  >
    <Link href="/habit-tracker" className="block px-4 py-2 hover:bg-zinc-700">
      Habit Tracker
    </Link>
    <Link href="/mood-tracker" className="block px-4 py-2 hover:bg-zinc-700">
      Mood Tracker
    </Link>
    <Link href="/gratitude-journal" className="block px-4 py-2 hover:bg-zinc-700">
      Gratitude Journal
    </Link>
  </div>
</div>

        <Link href="/blog" className={linkStyle('/blog')}>
          Blog
        </Link>
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="flex md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Slideout Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 right-0 w-56 bg-zinc-800 rounded-lg shadow-lg py-4 flex flex-col items-start space-y-4 px-6 z-50">
          <Link href="/" className={linkStyle('/')} onClick={() => setMobileMenuOpen(false)}>
            Focus Timer
          </Link>
          <Link href="/meditation-player" className={linkStyle('/meditation-player')} onClick={() => setMobileMenuOpen(false)}>
            Meditation Player
          </Link>
          <Link href="/habit-tracker" className={linkStyle('/habit-tracker')} onClick={() => setMobileMenuOpen(false)}>
            Habit Tracker
          </Link>
          <Link href="/mood-tracker" className={linkStyle('/mood-tracker')} onClick={() => setMobileMenuOpen(false)}>
            Mood Tracker
          </Link>
          <Link href="/gratitude-journal" className={linkStyle('/gratitude-journal')} onClick={() => setMobileMenuOpen(false)}>
            Gratitude Journal
          </Link>
          <Link href="/blog" className={linkStyle('/blog')} onClick={() => setMobileMenuOpen(false)}>
            Blog
          </Link>
        </div>
      )}
    </nav>
  );
}
