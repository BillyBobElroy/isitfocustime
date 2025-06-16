'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { saveUserToFirestore } from '@/lib/saveUserToFirestore';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await saveUserToFirestore(userCredential.user, {
        firstName,
        lastName,
        displayName,
        onboardingComplete: false,
      });
      router.push('/onboarding');
    } catch (err) {
      alert('Signup failed');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user, {
        onboardingComplete: false,
      });
      router.push('/onboarding');
    } catch (err) {
      alert('Google signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center px-4">
      <div className="bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
        <div className="text-3xl font-bold tracking-tight text-white mb-1">
          <span className="text-green-400">isit</span>focustime<span className="text-green-400">.com</span>
        </div>
          <p className="text-sm text-zinc-400">Focus. Reflect. Grow.</p>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">Create Your Account</h1>

        {/* First + Last Name */}
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="flex-1 sm:max-w-[185px] border border-zinc-700 bg-zinc-900 text-white p-3 rounded-lg"
          />
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="flex-1 sm:max-w-[185px] border border-zinc-700 bg-zinc-900 text-white p-3 rounded-lg"
          />
        </div>

        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display Name (optional)"
          className="w-full border border-zinc-700 bg-zinc-900 text-white p-3 rounded-lg mb-3"
        />

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
          className="w-full border border-zinc-700 bg-zinc-900 text-white p-3 rounded-lg mb-6"
        />

        <button
          onClick={handleSignUp}
          className="w-full bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-lg font-semibold mb-4"
        >
          Sign Up
        </button>
        <button
          onClick={handleGoogleSignUp}
          className="w-full bg-red-500 hover:bg-red-600 transition text-white py-3 rounded-lg font-semibold"
        >
          Sign Up with Google
        </button>
      </div>
    </div>
  );
}
