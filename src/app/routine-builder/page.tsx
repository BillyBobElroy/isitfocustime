'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import { db } from '@/lib/firebase';
import {
  collection,
  getDoc,
  getDocs,
  orderBy,
  query,
  doc,
  setDoc,
} from 'firebase/firestore';
import { saveUserEntry } from '@/lib/saveUserEntry';

const templates = [
  {
    name: '🌅 Morning Focus Routine',
    steps: ['5-Minute Meditation', 'Gratitude Journal', 'Stretch', 'Review Priorities'],
  },
  {
    name: '💻 Deep Work Setup',
    steps: ['Box Breathing', 'Set 25-Min Focus Timer', 'Turn on Do Not Disturb'],
  },
  {
    name: '🌤️ Afternoon Reset',
    steps: ['5-Min Walk', 'Breathing Bubble', 'Guided Reset Meditation'],
  },
];

const allTools = [
  'Focus Timer',
  'Breathe Timer',
  'Meditation Player',
  'Habit Tracker',
  'Mood Tracker',
  'Gratitude Journal',
  '5-Minute Journal',
  'Stretch',
  'Review Priorities',
  'Go For a Walk',
  'Box Breathing',
  'Guided Reset Meditation',
  'Turn on Do Not Disturb',
  'Set 25-Min Focus Timer',
];

const toolLinks = {
  'Focus Timer': '/focus-timer',
  'Breathe Timer': '/breathe-timer',
  'Meditation Player': '/meditation-player',
  'Habit Tracker': '/habit-tracker',
  'Mood Tracker': '/mood-tracker',
  'Gratitude Journal': '/gratitude-journal',
  '5-Minute Journal': '/journal-builder',
  '5-Minute Meditation': '/meditation-player',
  'Set 25-Min Focus Timer': '/focus-timer',
  'Breathing Bubble': '/breathe-timer',
  'Box Breathing': '/breathe-timer',
  'Guided Reset Meditation': '/meditation-player',
};

export default function RoutineBuilderPage() {
  const [customRoutine, setCustomRoutine] = useState<string[]>([]);
  const [suggestedSteps, setSuggestedSteps] = useState<string[]>([]);
  const { user } = useFirebaseUser();

  useEffect(() => {
    const loadRoutine = async () => {
      const key = 'focus-routine';
      const localData: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      let merged = [...localData];

      if (user?.uid) {
        try {
          const ref = collection(db, 'users', user.uid, 'routines');
          const q = query(ref, orderBy('timestamp', 'desc'));
          const snap = await getDocs(q);
          const firestoreData = snap.docs.map(doc => doc.data()) as { steps: string[] }[];

          const latest = firestoreData[0]?.steps || [];
          const isSame = JSON.stringify(latest) === JSON.stringify(localData);
          if (!isSame) {
            merged = latest.length ? latest : localData;
          }
        } catch (err) {
          console.error('Failed to load routine from Firestore:', err);
        }
      }

      setCustomRoutine(merged);
    };

    const suggestStepsFromContext = async () => {
      if (!user?.uid) return;

      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      const hour = now.getHours();

      try {
        const [habitSnap, moodSnap] = await Promise.all([
          getDocs(collection(db, 'users', user.uid, 'habitTrackerEntries')),
          getDoc(doc(db, 'users', user.uid, 'moodStats', 'lastSuggestedMode')),
        ]);

        const recentHabits = habitSnap.docs.map(d => d.data()).filter((d: any) => d.date?.startsWith(today));
        const completed = new Set((recentHabits || []).map((d: any) => d.name));
        const moodMode = moodSnap.exists() ? moodSnap.data().mode : '';

        const candidates: string[] = [];
        if (hour < 11) candidates.push('5-Minute Meditation', 'Gratitude Journal', 'Stretch');
        if (hour >= 11 && hour < 16) candidates.push('Go For a Walk', 'Guided Reset Meditation');
        if (hour >= 16) candidates.push('5-Minute Journal', 'Breathing Bubble');

        if (moodMode === 'Deep Focus') candidates.push('Set 25-Min Focus Timer');
        else if (moodMode === 'Recovery') candidates.push('Guided Reset Meditation');

        const suggestions = candidates.filter(step => !completed.has(step) && !customRoutine.includes(step));
        if (suggestions.length) setSuggestedSteps(suggestions);
      } catch (err) {
        console.error('Failed to fetch context-aware suggestions:', err);
      }
    };

    loadRoutine();
    suggestStepsFromContext();
  }, [user]);

  const saveRoutine = async () => {
    localStorage.setItem('focus-routine', JSON.stringify(customRoutine));

    if (user?.uid) {
      try {
        await saveUserEntry(user.uid, 'routines', { steps: customRoutine });
      } catch (err) {
        console.error('Failed to save routine to Firestore:', err);
      }
    }
  };

  const markRoutineComplete = async () => {
    if (!user?.uid) return;

    try {
      const statsRef = doc(db, 'users', user.uid, 'routineStats', 'summary');
      const snap = await getDoc(statsRef);
      const current = snap.exists() ? snap.data().completed || 0 : 0;

      await setDoc(
        statsRef,
        {
          completed: current + 1,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      alert('🎉 Routine marked as complete!');
    } catch (err) {
      console.error('Failed to update routine completion stat:', err);
      alert('❌ Failed to mark routine as complete.');
    }
  };

  const addStep = (step: string) => {
    setCustomRoutine((prev) => [...prev, step]);
  };

  const clearRoutine = () => {
    setCustomRoutine([]);
    localStorage.removeItem('focus-routine');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4 flex flex-col items-center">
      <div className="text-3xl font-bold tracking-tight text-white mb-1">
      <span className="text-green-400">isit</span>focustime<span className="text-green-400">.com</span>
      </div>
      <p className="text-4xl font-black tracking-tight mb-2">📅 Build Your Focus Routine</p>
      <p className="text-zinc-400 mb-10 text-center max-w-lg">
        Create a personalized focus ritual using your favorite mindfulness tools. Choose a template or craft your own.
      </p>

      {suggestedSteps.length > 0 && (
        <div className="mb-6 p-4 border border-purple-500 rounded-lg bg-zinc-800 text-purple-300 text-sm">
          <p className="mb-2">✨ Suggestions based on habits, time of day, and mood:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedSteps.map((step, i) => (
              <Button key={i} onClick={() => addStep(step)} className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1">
                ➕ {step}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {templates.map((template, index) => (
          <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              className="bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition border border-zinc-700"
              onClick={() => setCustomRoutine(template.steps)}
            >
              <CardContent className="p-5">
                <h2 className="text-xl font-bold text-white mb-3">{template.name}</h2>
                <ul className="text-sm text-zinc-300 space-y-1">
                  {template.steps.map((step, i) => (
                    <li key={i}>• {step}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl w-full mb-10">
        <h3 className="text-2xl font-bold mb-3 text-center">🧘‍♀️ Customize Your Routine</h3>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
          {allTools.map((step) => (
            <Button
              key={step}
              onClick={() => addStep(step)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white text-sm py-2"
            >
              ➕ {step}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-800 p-5 rounded-xl max-w-2xl w-full mb-6 shadow border border-zinc-700">
        <h4 className="text-lg font-bold mb-2 text-white">📝 Your Routine</h4>
        {customRoutine.length === 0 ? (
          <p className="text-zinc-400 italic">No steps added yet. Select from above or pick a template.</p>
        ) : (
          <>
            <ol className="list-decimal list-inside text-zinc-200 space-y-2">
              {customRoutine.map((step, index) => (
                <li key={index}>
                  {toolLinks[step as keyof typeof toolLinks] ? (
            <Link href={toolLinks[step as keyof typeof toolLinks]} className="text-blue-400 hover:underline">
                {step}
            </Link>
              ) : (
            <span className="text-zinc-300">{step}</span>
              )}
                </li>
              ))}
            </ol>

            {user?.uid && (
              <Button
                onClick={markRoutineComplete}
                className="bg-blue-500 hover:bg-blue-600 text-white mt-4"
              >
                ✅ Mark Routine as Complete
              </Button>
            )}
          </>
        )}
      </div>

      <div className="flex gap-4">
        <Button
          onClick={saveRoutine}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          ✅ Save Routine
        </Button>
        <Button
          onClick={clearRoutine}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
        >
          🗑️ Clear
        </Button>
      </div>
    </div>
  );
}
