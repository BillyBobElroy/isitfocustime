'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus('📧 Password reset link sent to your email.');
    } catch (err) {
      setStatus('❌ Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center px-4">
      {/* Logo/Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="text-3xl font-bold tracking-tight text-white mb-1">
          <span className="text-green-400">isit</span>focustime<span className="text-green-400">.com</span>
        </div>
        <p className="text-sm text-zinc-400">Reset your password to stay focused</p>
      </div>

      {/* Reset Card */}
      <div className="bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full border border-zinc-700 bg-zinc-900 text-white p-3 rounded-lg mb-4"
        />

        <button
          onClick={handleReset}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
        >
          Send Reset Email
        </button>

        {status && <p className="text-sm mt-4 text-center text-zinc-300">{status}</p>}

        <button
          onClick={() => router.push('/signin')}
          className="w-full mt-6 text-sm text-green-400 hover:underline"
        >
          ← Back to Sign In
        </button>
      </div>
    </div>
  );
}
