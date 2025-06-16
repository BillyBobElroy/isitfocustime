'use client';

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import Link from 'next/link';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import { saveUserEntry } from '@/lib/saveUserEntry';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const presetColors = [
  '#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1',
  '#5f27cd', '#ff9ff3', '#c8d6e5', '#576574',
];

const presetEmojis = ['😄', '😐', '😔', '😠', '😭', '🥳', '😎', '🤯'];

type MoodEntry = {
  mood: string;
  note: string;
  color: string;
  timestamp: string;
};

const determineFocusMode = (moods: MoodEntry[]) => {
  const recent = moods.slice(0, 5).map((entry) => entry.mood);
  const happy = ['😄', '🥳', '😎'];
  const neutral = ['😐'];
  const low = ['😔', '😭', '😠', '🤯'];

  let score = 0;
  recent.forEach((mood) => {
    if (happy.includes(mood)) score += 2;
    else if (neutral.includes(mood)) score += 1;
    else if (low.includes(mood)) score -= 1;
  });

  if (score >= 6) return 'Deep Focus';
  if (score >= 2) return 'Light Flow';
  return 'Recovery';
};

export default function MoodTrackerPage() {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [color, setColor] = useState(presetColors[0]);
  const [savedMessage, setSavedMessage] = useState('');
  const [pastEntries, setPastEntries] = useState<MoodEntry[]>([]);
  const [showPast, setShowPast] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const { user } = useFirebaseUser();
  const [suggestedMode, setSuggestedMode] = useState('');
  const [showGratitudePrompt, setShowGratitudePrompt] = useState(false);

  useEffect(() => {
    const loadEntries = async () => {
      const key = 'moodTrackerEntries';
      const localData: MoodEntry[] = JSON.parse(localStorage.getItem(key) || '[]');

      const getEntryKey = (entry: MoodEntry) =>
        `${entry.timestamp}-${entry.mood}-${entry.note}-${entry.color}`;

      const seen = new Set<string>();
      const dedupe = (entries: MoodEntry[]) =>
        entries.filter((entry) => {
          const key = getEntryKey(entry);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

      if (!user?.uid) return;

      try {
        const ref = collection(db, 'users', user.uid, 'moodEntries');
        const q = query(ref, orderBy('timestamp', 'desc'));
        const snap = await getDocs(q);

        const firestoreData = snap.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            timestamp:
              typeof data.timestamp === 'string'
                ? data.timestamp
                : data.timestamp?.toDate().toISOString() || '',
          };
        }) as MoodEntry[];

        const firestoreKeys = new Set(firestoreData.map(getEntryKey));
        const today = new Date().toISOString().split('T')[0];

        const unsynced = localData.filter((entry) => {
          const entryKey = getEntryKey(entry);
          const entryDate = entry.timestamp.split('T')[0];
          return !firestoreKeys.has(entryKey) && !entryDate.includes(today);
        });

        await Promise.all(
          unsynced.map((entry) => saveUserEntry(user.uid, 'moodEntries', entry))
        );

        const merged = dedupe([...firestoreData, ...unsynced]);
        localStorage.setItem(key, JSON.stringify(merged));

        const sanitized = merged
          .map((entry) => {
            let iso = '';
            try {
              iso = new Date(entry.timestamp).toISOString();
            } catch {
              iso = '';
            }
            return { ...entry, timestamp: iso };
          })
          .filter((entry) => entry.timestamp)
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

        setPastEntries(sanitized);
        const mode = determineFocusMode(sanitized);
        setSuggestedMode(mode);

        const refStats = doc(db, 'users', user.uid, 'moodStats', 'lastSuggestedMode');
        await setDoc(refStats, { mode, updatedAt: serverTimestamp() }, { merge: true });
      } catch (err) {
        console.error('Failed to load mood entries:', err);
      }
    };

    loadEntries();
  }, [user]);

  const handleSave = async () => {
    const newEntry: MoodEntry = {
      mood,
      note,
      color,
      timestamp: new Date().toISOString(),
    };

    const updated = [newEntry, ...pastEntries.filter(e => e.timestamp !== newEntry.timestamp)];

    if (user?.uid) {
      try {
        await saveUserEntry(user.uid, 'moodEntries', newEntry);

        const statsRef = doc(db, 'users', user.uid, 'moodStats', 'summary');
        const snap = await getDoc(statsRef);
        const currentCount = snap.exists() ? snap.data().entries || 0 : 0;

        await setDoc(
          statsRef,
          {
            entries: currentCount + 1,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Failed to save mood or update stats in Firestore:', err);
      }
    }

    localStorage.setItem('moodTrackerEntries', JSON.stringify(updated));
    setPastEntries(updated);
    setSuggestedMode(determineFocusMode(updated));
    setShowGratitudePrompt(false);
    setSavedMessage('🌟 Mood saved!');
    setShowGratitudePrompt(true);
    setMood('');
    setNote('');
    setColor(presetColors[0]);
  };

  const handleClear = async () => {
    const key = 'moodTrackerEntries';
    localStorage.removeItem(key);
    setPastEntries([]);
    setShowPast(false);

    if (user?.uid) {
      try {
        const ref = collection(db, 'users', user.uid, 'moodEntries');
        const snap = await getDocs(ref);
        const deletions = snap.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletions);
        console.log('🔥 Cleared moods from Firestore');
      } catch (err) {
        console.error('❌ Failed to clear moods from Firestore:', err);
      }
    }
  };

  const getMoodCounts = () => {
    const counts: { [color: string]: number } = {};
    pastEntries.forEach((entry) => {
      counts[entry.color] = (counts[entry.color] || 0) + 1;
    });
    return counts;
  };

  return (
    <div className="min-h-screen font-nunito bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4 flex flex-col items-center">
      <div className="max-w-md w-full space-y-8 text-center">
          <div className="text-3xl font-bold tracking-tight text-white">
          <span className="text-green-400">isit</span>focustime<span className="text-green-400">.com</span>
          </div>
          <p className="text-4xl font-black tracking-tight mb-2">Mood Tracker</p>

          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {presetEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setMood(emoji)}
                className="text-3xl hover:scale-125 transition"
              >
                {emoji}
              </button>
            ))}
          </div>

          <input
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Mood or emoji"
            className="bg-zinc-800 text-white rounded-lg px-4 py-3 mb-4 w-full max-w-md font-nunito placeholder-zinc-500"
          />

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional notes"
            className="bg-zinc-800 text-white rounded-lg px-4 py-3 mb-6 w-full max-w-md font-nunito placeholder-zinc-500 resize-none"
            rows={3}
          />

          <div className="flex gap-3 mb-6 flex-wrap justify-center">
            {presetColors.map((preset) => (
              <button
                key={preset}
                onClick={() => setColor(preset)}
                className={`w-8 h-8 rounded-full border-2 transition ${
                  color === preset ? 'border-green-400 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: preset }}
              />
            ))}
          </div>

          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 py-3 font-nunito transition mb-4"
          >
            Save Mood
          </button>

          {suggestedMode && (
            <p className="text-lg font-semibold text-purple-300 mb-4">
              Suggested Focus Mode: <span className="font-bold">{suggestedMode}</span>
            </p>
          )}

          <nav className="text-sm space-x-4">
            <Link href="/habit-tracker" className="text-green-400 hover:underline mb-4">Habit Tracker</Link>
            <Link href="/gratitude-journal" className="text-green-400 hover:underline mb-4">Gratitude Journal</Link>
          </nav>

          {savedMessage && <p className="text-green-300 mt-2 italic">{savedMessage}</p>}

          {showGratitudePrompt && (
            <div className="bg-purple-800 border border-purple-500 text-purple-100 rounded-lg p-4 mt-4">
            <p className="text-sm mb-2">💡 Want to reframe this moment with gratitude?</p>
            <Link
                href="/gratitude-journal"
                className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md transition"
          >
                ✨ Open Gratitude Journal
            </Link>
            </div>
          )}

          <div className="flex space-x-4 mt-8">
            <button
              onClick={() => {
                setShowPast(!showPast);
                setShowChart(false);
              }}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-nunito"
            >
              {showPast ? 'Hide Past Moods' : 'View Past Moods'}
            </button>

            <button
              onClick={() => {
                setShowChart(!showChart);
                setShowPast(false);
              }}
              className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg font-nunito"
            >
              {showChart ? 'Hide Mood Chart' : 'View Mood Chart'}
            </button>

            <button
              onClick={handleClear}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-nunito"
            >
              Clear Moods
            </button>
          </div>

          {showPast && (
            <div className="mt-10 w-full max-w-md space-y-4">
              {pastEntries.length === 0 ? (
                <p className="text-zinc-400 text-center italic">No moods yet.</p>
              ) : (
                pastEntries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-800 rounded-lg p-4 flex items-start gap-4"
                  >
                    <div
                      className="w-8 h-8 rounded-full mt-1 shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <div>
                      <p className="text-xl font-bold">{entry.mood}</p>
                      {entry.note && <p className="text-zinc-300 mt-1">{entry.note}</p>}
                      <p className="text-xs text-zinc-400 mt-2">{new Date(entry.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {showChart && (
            <div className="mt-10 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-center">Mood Frequency</h2>
              <Bar
                data={{
                  labels: Object.keys(getMoodCounts()),
                  datasets: [
                    {
                      label: 'Moods',
                      data: Object.values(getMoodCounts()),
                      backgroundColor: Object.keys(getMoodCounts()),
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  scales: {
                    y: { beginAtZero: true },
                  },
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </div>
          )}
        </div>

        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4813693653154178" crossOrigin="anonymous"></script>
        <div className="my-8 flex justify-center">
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '728px', height: '90px' }}
            data-ad-client="ca-pub-4813693653154178"
            data-ad-slot="8997853730"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <ins
            className="adsbygoogle inline-block md:hidden"
            style={{ width: '300px', height: '250px' }}
            data-ad-client="ca-pub-4813693653154178"
            data-ad-slot="8997853730"
          />
        </div>
      </div>
  );
}
