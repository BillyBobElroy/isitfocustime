'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { saveUserEntry } from '@/lib/saveUserEntry';

type GratitudeEntry = {
  date: string;
  entries: string[];
};

export default function GratitudeJournal() {
  const [gratitudes, setGratitudes] = useState(['']);
  const [savedEntries, setSavedEntries] = useState<GratitudeEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showPastEntries, setShowPastEntries] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const { user } = useFirebaseUser();

    const gratitudeQuotes = [
    "Gratitude turns what we have into enough.",
    "Start each day with a grateful heart.",
    "The more you practice gratitude, the more there is to be grateful for.",
    "Happiness is not the joy you feel when you get what you want, but the gratitude you feel for what you have.",
    "Gratitude unlocks the fullness of life.",
    "Today is a gift — that’s why it’s called the present.",
    "Acknowledging the good you already have in your life is the foundation for all abundance.",
    "Gratitude makes sense of our past, brings peace for today, and creates a vision for tomorrow.",
    "Feeling gratitude and not expressing it is like wrapping a present and not giving it.",
    "Gratitude is the fairest blossom which springs from the soul.",
    "Let us be grateful to the people who make us happy—they are the charming gardeners who make our souls blossom.",
    "When you arise in the morning, think of what a privilege it is to be alive, to think, to enjoy, to love.",
    "It is not joy that makes us grateful; it is gratitude that makes us joyful.",
    "Gratitude turns ordinary days into thanksgivings, routine jobs into joy, and ordinary opportunities into blessings.",
    "The root of joy is gratefulness.",
    "Wear gratitude like a cloak, and it will feed every corner of your life.",
    "No duty is more urgent than giving thanks.",
    "Gratitude is not only the greatest of virtues, but the parent of all the others.",
    "The smallest act of kindness is worth more than the grandest intention.",
    "Gratitude is the sign of noble souls.",
    "Gratitude paints little smiley faces on everything it touches.",
    "A grateful heart is a magnet for miracles.",
    "Gratitude shifts your focus from what is lacking to the abundance that is already present.",
    "Every moment offers something to be thankful for.",
    "Peace begins with a grateful heart."
  ];
  
  const dailyPrompts = [
    "What's one thing today that made you feel calm?",
    "Who made a difference in your life recently?",
    "What small win are you celebrating today?",
    "Name a sound or smell that makes you feel at peace.",
    "Recall a moment of joy from the past week."
  ];

  const gratitudeEmojis = ['🌅', '✨', '🌿', '🌞', '🌈', '💖', '🧘‍♂️'];

  const [quote, setQuote] = useState('');
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    setQuote(gratitudeQuotes[Math.floor(Math.random() * gratitudeQuotes.length)]);
    setPrompt(dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)]);
  }, []);

  useEffect(() => {
    const loadEntries = async () => {
      const key = 'gratitude-entries';
      const localData: GratitudeEntry[] = JSON.parse(localStorage.getItem(key) || '[]');
      let merged: GratitudeEntry[] = [...localData];

      if (user?.uid) {
        try {
          const ref = collection(db, 'users', user.uid, 'gratitudeEntries');
          const q = query(ref, orderBy('timestamp', 'desc'));
          const snap = await getDocs(q);
          const firestoreData = snap.docs.map((doc) => doc.data() as GratitudeEntry);

          const unsynced = localData.filter((entry: GratitudeEntry) =>
            !firestoreData.some(
              (f: GratitudeEntry) =>
                f.date === entry.date &&
                JSON.stringify(f.entries) === JSON.stringify(entry.entries)
            )
          );

          await Promise.all(
            unsynced.map((entry: GratitudeEntry) =>
              saveUserEntry(user.uid, 'gratitudeEntries', entry)
            )
          );

          merged = [...firestoreData, ...unsynced];
          localStorage.setItem(key, JSON.stringify(merged));
        } catch (err) {
          console.error('Failed to sync gratitude entries:', err);
        }
      }

      setSavedEntries(merged.sort((a, b) => b.date.localeCompare(a.date)));
    };

    loadEntries();
  }, [user]);

  const saveEntries = async () => {
    if (gratitudes.every((g) => g.trim() === '')) return;
    const today = new Date().toISOString().split('T')[0];
    const newEntry: GratitudeEntry = { date: today, entries: gratitudes };
    const updated = [...savedEntries, newEntry];

    if (user?.uid) {
      try {
        await saveUserEntry(user.uid, 'gratitudeEntries', newEntry);
      } catch (err) {
        console.error('Failed to save gratitude to Firestore:', err);
      }
    }

    localStorage.setItem('gratitude-entries', JSON.stringify(updated));
    setSavedEntries(updated);
    setGratitudes(['']);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const clearEntries = () => {
    localStorage.removeItem('gratitude-entries');
    setSavedEntries([]);
  };

  const addField = () => setGratitudes([...gratitudes, '']);

  const removeField = (index: number) => {
    const updated = gratitudes.filter((_, idx) => idx !== index);
    setGratitudes(updated.length ? updated : ['']);
  };

  const filteredEntries = selectedDate
    ? savedEntries.filter((e) => e.date === selectedDate)
    : savedEntries;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4 flex flex-col items-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <p className="text-3xl text-center">💛 🙏 🌿 ✨</p>
          <div className="text-3xl font-bold tracking-tight text-white mb-1">
          <span className="text-green-400">isit</span>focustime<span className="text-green-400">.com</span>
          </div>
          <p className="text-4xl font-black tracking-tight mb-2">Gratitude Journal</p>
          <p className="text-sm text-zinc-400 mb-2">Capture 1–5 things you're grateful for today 🌟</p>
          <div className="rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white italic text-center p-4 shadow-md text-md">
            “{quote}”
          </div>
          <p className="rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white italic text-center p-4 shadow-sm text-sm mt-2">🪷 {prompt}</p>
        </div>

        {gratitudes.map((g, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-3 bg-zinc-800 border-zinc-700 p-3 rounded-xl shadow"
          >
            <span>{gratitudeEmojis[idx % gratitudeEmojis.length]}</span>
            <input
              type="text"
              placeholder="I'm grateful for..."
              value={g}
              onChange={(e) => {
                const updated = [...gratitudes];
                updated[idx] = e.target.value;
                setGratitudes(updated);
              }}
              className="flex-1 bg-transparent text-white placeholder-zinc-400 p-2 focus:outline-none"
            />
            {gratitudes.length > 1 && (
              <button
                onClick={() => removeField(idx)}
                className="text-red-400 hover:text-red-500"
              >✖</button>
            )}
          </motion.div>
        ))}

        <button
          onClick={addField}
          className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg mb-4 transition"
        >
          + Add More
        </button>

        <button
          onClick={saveEntries}
          className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-semibold transition"
        >
          Save Gratitudes
        </button>

        <AnimatePresence>
          {showSaved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center text-green-400 font-medium"
            >
              💖 Thank you for taking a mindful moment today.
            </motion.div>
          )}
        </AnimatePresence>

        <nav className="text-sm space-x-4 text-center">
          <Link href="/mood-tracker" className="text-green-400 hover:underline mb-4">Mood Tracker</Link>
          <Link href="/habit-tracker" className="text-green-400 hover:underline mb-4">Habit Tracker</Link>
        </nav>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setShowPastEntries(!showPastEntries)}
            className="flex-1 bg-purple-500 hover:bg-purple-600 py-2 rounded-lg"
          >
            {showPastEntries ? 'Hide Past' : 'View Past Entries'}
          </button>

          <button
            onClick={clearEntries}
            className="flex-1 bg-red-500 hover:bg-red-600 py-2 rounded-lg"
          >
            Clear All
          </button>
        </div>

        {showPastEntries && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4 text-center">Past Gratitudes</h2>

            <label className="block text-sm mb-2 text-zinc-400">Filter by date:</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-zinc-800 text-white mb-4"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            {filteredEntries.length === 0 ? (
              <p className="text-center text-zinc-400">No entries for this date.</p>
            ) : (
              <ul className="space-y-4">
                {filteredEntries.map((entry, idx) => (
                  <li key={idx} className="bg-zinc-800 p-4 rounded-lg">
                    <div className="text-xs text-zinc-400 mb-2">{entry.date}</div>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {entry.entries.map((g, i) => (
                        <li key={i}>{gratitudeEmojis[i % gratitudeEmojis.length]} {g}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
