'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const { user, logout } = useFirebaseUser();
  const [focusOpen, setFocusOpen] = useState(false);
const [wellnessOpen, setWellnessOpen] = useState(false);
const [sleepOpen, setSleepOpen] = useState(false);

  const linkStyle = (path: string) =>
    `hover:text-green-400 transition ${
      pathname === path ? 'underline underline-offset-4 text-green-400' : ''
    }`;

  const handleMouseEnter = (menu: string) => setHoveredDropdown(menu);
  const handleMouseLeave = () => setHoveredDropdown(null);

  return (
    <nav className="w-full bg-zinc-900 text-white py-4 px-6 shadow-md flex justify-between items-center relative">
      <div className="text-lg font-bold">
        <Link href="/">
          <span className="text-green-400">isit</span>focustime<span className="text-green-400">.com</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center justify-center space-x-6 text-sm flex-1">
        <Link href="/" className={linkStyle('/')}>Home</Link>

        <div className="relative" onMouseEnter={() => handleMouseEnter('timer')} onMouseLeave={handleMouseLeave}>
          <button className="hover:text-green-400 transition flex items-center gap-1">
            Focus
            <span className={`transform transition-transform ${hoveredDropdown === 'timer' ? 'rotate-180' : 'rotate-0'}`}>▼</span>
          </button>
          <div className={`absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-zinc-800 rounded-lg shadow-lg py-2 z-50 transition-all duration-200 ${hoveredDropdown === 'timer' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <Link href="/focus-timer" className="block px-4 py-2 hover:bg-zinc-700">Focus Timer</Link>
            <Link href="/breathe-timer" className="block px-4 py-2 hover:bg-zinc-700">Breathe Timer</Link>
            <Link href="/habit-tracker" className="block px-4 py-2 hover:bg-zinc-700">Habit Tracker</Link>
            <Link href="/routine-builder" className="block px-4 py-2 hover:bg-zinc-700">Routine Builder</Link>
          </div>
        </div>

        <div className="relative" onMouseEnter={() => handleMouseEnter('tools')} onMouseLeave={handleMouseLeave}>
          <button className="hover:text-green-400 transition flex items-center gap-1">
            Mental Wellness
            <span className={`transform transition-transform ${hoveredDropdown === 'tools' ? 'rotate-180' : 'rotate-0'}`}>▼</span>
          </button>
          <div className={`absolute left-1/2 -translate-x-1/2 mt-2 w-52 bg-zinc-800 rounded-lg shadow-lg py-2 z-50 transition-all duration-200 ${hoveredDropdown === 'tools' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <Link href="/meditation-player" className="block px-4 py-2 hover:bg-zinc-700">Meditation Player</Link>
            <Link href="/mood-tracker" className="block px-4 py-2 hover:bg-zinc-700">Mood Tracker</Link>
            <Link href="/gratitude-journal" className="block px-4 py-2 hover:bg-zinc-700">Gratitude Journal</Link>
            <Link href="/5-minute-journal" className="block px-4 py-2 hover:bg-zinc-700">5-Minute Journal</Link>
            <Link href="/mini-cbt-journal" className="block px-4 py-2 hover:bg-zinc-700">Mini CBT Journal</Link>
          </div>
        </div>

        <div className="relative" onMouseEnter={() => handleMouseEnter('sleep')} onMouseLeave={handleMouseLeave}>
          <button className="hover:text-green-400 transition flex items-center gap-1">
            Sleep
            <span className={`transform transition-transform ${hoveredDropdown === 'sleep' ? 'rotate-180' : 'rotate-0'}`}>▼</span>
          </button>
          <div className={`absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-zinc-800 rounded-lg shadow-lg py-2 z-50 transition-all duration-200 ${hoveredDropdown === 'sleep' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <Link href="/sleep-diary" className="block px-4 py-2 hover:bg-zinc-700">Sleep Diary</Link>
          </div>
        </div>

        <Link href="/blog" className={linkStyle('/blog')}>Blog</Link>
      </div>

        {/* Auth Section */}
        {user ? (
          <div
            className="relative group flex items-center gap-2"
            onMouseEnter={() => handleMouseEnter('user')}
            onMouseLeave={handleMouseLeave}
          >
          {/* Avatar on the left */}
  {user.avatarId ? (
    <Image
      src={`/avatars/characters/${user.avatarId}.png`}
      alt="Avatar"
      width={32}
      height={32}
      className="rounded-full border border-white shadow-sm"
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-sm">
      🧘
    </div>
  )}
            <button className="text-green-400 font-medium flex items-center gap-1">
              {user.firstName || 'User'}
              <span className={`transform transition-transform ${hoveredDropdown === 'user' ? 'rotate-180' : 'rotate-0'}`}>▼</span>
            </button>
            <div className={`absolute top-full right-0 mt-2 w-32 bg-zinc-800 rounded-lg shadow-lg py-2 z-50 transition-all duration-200 ${hoveredDropdown === 'user' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <Link href="/dashboard" className="block px-4 py-2 hover:bg-zinc-700">Dashboard</Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-zinc-700 text-red-400"
              >
                Log Out
              </button>
            </div>
          </div>
        ) : (
          <>
<div className="flex items-center gap-4">
  <Link href="/signin" className="hover:text-green-400">
    Sign In
  </Link>
  <Link
    href="/signup"
    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
  >
    Sign Up
  </Link>
</div>
          </>
        )}

      {/* Mobile Hamburger */}
      <div className="flex md:hidden">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

{/* Mobile Menu */}
{mobileMenuOpen && (
  <div className="absolute block top-16 right-0 w-64 bg-zinc-800 rounded-lg shadow-lg py-4 px-6 z-50 space-y-4 text-white text-sm">

    {/* Focus Dropdown */}
    <div>
      <button
        onClick={() => setFocusOpen((prev) => !prev)}
        className="flex justify-between w-full font-semibold"
      >
        Focus <span>{focusOpen ? '▲' : '▼'}</span>
      </button>
      {focusOpen && (
        <div className="ml-3 mt-2 space-y-2">
          <Link href="/focus-timer" className="block w-full text-left" onClick={() => setMobileMenuOpen(false)}>Focus Timer</Link>
          <Link href="/breathe-timer" className="block w-full text-left" onClick={() => setMobileMenuOpen(false)}>Breathe Timer</Link>
          <Link href="/habit-tracker" className="block w-full text-left" onClick={() => setMobileMenuOpen(false)}>Habit Tracker</Link>
          <Link href="/routine-builder" className="block w-full text-left" onClick={() => setMobileMenuOpen(false)}>Routine Builder</Link>
        </div>
      )}
    </div>

    {/* Mental Wellness Dropdown */}
    <div>
      <button
        onClick={() => setWellnessOpen((prev) => !prev)}
        className="justify-between w-full font-semibold"
      >
        Mental Wellness <span>{wellnessOpen ? '▲' : '▼'}</span>
      </button>
      {wellnessOpen && (
        <div className="ml-3 mt-2 space-y-2">
          <Link href="/meditation-player" className="block w-full text-left" onClick={() => setMobileMenuOpen(false)}>Meditation Player</Link>
          <Link href="/mood-tracker" className="block w-full text-left" onClick={() => setMobileMenuOpen(false)}>Mood Tracker</Link>
          <Link href="/gratitude-journal" className="block w-full text-left" onClick={() => setMobileMenuOpen(false)}>Gratitude Journal</Link>
          <Link href="/5-minute-journal" className="block w-full text-left" onClick={() => setMobileMenuOpen(false)}>5-Minute Journal</Link>
          <Link href="/mini-cbt-journal" className="block w-full text-left" onClick={() => setMobileMenuOpen(false)}>Mini CBT Journal</Link>
        </div>
      )}
    </div>

    {/* Sleep Dropdown */}
    <div>
      <button
        onClick={() => setSleepOpen((prev) => !prev)}
        className="flex justify-between w-full font-semibold"
      >
        Sleep <span>{sleepOpen ? '▲' : '▼'}</span>
      </button>
      {sleepOpen && (
        <div className="ml-3 mt-2 space-y-2">
          <Link href="/sleep-diary" className="block w-full text-left" onClick={() => setMobileMenuOpen(false)}>Sleep Diary</Link>
        </div>
      )}
    </div>

    {/* Blog */}
    <Link href="/blog" className={linkStyle('/blog')} onClick={() => setMobileMenuOpen(false)}>Blog</Link>

    {/* Auth */}
    {user ? (
      <>
        <span className="block w-full text-green-400 font-medium">Hello, {user.firstName}</span>
        <button onClick={logout} className="block w-full text-red-400 hover:underline">Log Out</button>
      </>
    ) : (
      <>
        <Link href="/signin" className="block w-full text-left hover:text-green-400" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
        <Link href="/signup" className="block w-full text-left hover:text-green-400" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
      </>
    )}
  </div>
)}
    </nav>
  );
}
