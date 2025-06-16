'use client';

import Link from 'next/link';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { saveUserToFirestore } from '@/lib/saveUserToFirestore';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user); // In case it's their first login
      router.push('/dashboard');
    } catch (err) {
      alert('Google login failed');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center px-4">
      {/* Signin Card */}
      <div className="bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-md">
              {/* Logo/Header */}
      <div className="flex flex-col items-center mb-4">
        <div className="text-3xl font-bold tracking-tight text-white mb-1">
          <span className="text-green-400">isit</span>focustime<span className="text-green-400">.com</span>
        </div>
        <p className="text-sm text-zinc-400">Welcome back — let’s stay focused</p>
      </div>
        <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border border-zinc-700 bg-zinc-900 text-white p-3 rounded-lg mb-3"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full border border-zinc-700 bg-zinc-900 text-white p-3 rounded-lg mb-3"
        />

        <Link href="/forgot-password" className="text-sm text-green-400 hover:underline block text-center mb-3">
          Forgot Password?
        </Link>

        <button
          onClick={handleSignIn}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold mb-3"
        >
          Sign In
        </button>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 hover:bg-red-600 transition text-white py-3 rounded-lg font-semibold"
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
}
