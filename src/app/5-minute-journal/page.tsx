'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, PencilLine } from 'lucide-react';
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { saveUserEntry } from '@/lib/saveUserEntry';

const morningPrompts = [
  'What are you grateful for today?',
  'What is your intention for the day?',
  'What would make today great?',
];

const eveningPrompts = [
  'What went well today?',
  'What are you proud of today?',
  'How can you improve tomorrow?',
];

type Entry = {
  date: string;
  type: 'morning' | 'evening';
  responses: string[];
};

export default function JournalPage() {
  const [isMorning, setIsMorning] = useState(true);
  const [entries, setEntries] = useState(['', '', '']);
  const [saved, setSaved] = useState(false);
  const [pastEntries, setPastEntries] = useState<Entry[]>([]);
  const [filter, setFilter] = useState<'all' | 'morning' | 'evening'>('all');
  const [page, setPage] = useState(1);
  const entriesPerPage = 5;
  const { user } = useFirebaseUser();

  useEffect(() => {
    const loadEntries = async () => {
      const hour = new Date().getHours();
      setIsMorning(hour < 17);

      const localKey = 'journal-entries';
      const localData: Entry[] = JSON.parse(localStorage.getItem(localKey) || '[]');
      let mergedEntries: Entry[] = [...localData];

      if (user?.uid) {
        try {
          const ref = collection(db, 'users', user.uid, 'fiveMinJournal');
          const q = query(ref, orderBy('timestamp', 'desc'));
          const snap = await getDocs(q);

          const firestoreEntries: Entry[] = snap.docs.map((doc) => ({
            ...(doc.data() as Entry),
          }));

          // Merge and prevent duplicates (same date + type)
          const unsynced = localData.filter(
            (entry) =>
              !firestoreEntries.some(
                (f) => f.date === entry.date && f.type === entry.type
              )
          );

          // Auto-sync unsynced local entries to Firestore
          await Promise.all(
            unsynced.map((entry) =>
              saveUserEntry(user.uid, 'fiveMinJournal', entry)
            )
          );

          mergedEntries = [
            ...firestoreEntries,
            ...unsynced,
          ].sort((a, b) => b.date.localeCompare(a.date));

          localStorage.setItem(localKey, JSON.stringify(mergedEntries));
        } catch (err) {
          console.error('Failed to fetch or sync Firestore entries:', err);
        }
      }

      setPastEntries(mergedEntries);
    };

    loadEntries();
  }, [user]);

  const handleChange = (index: number, value: string) => {
    const updated = [...entries];
    updated[index] = value;
    setEntries(updated);
  };

  const handleSave = async () => {
    const today = new Date().toISOString().split('T')[0];
    const key = 'journal-entries';

    const newEntry: Entry = {
      date: today,
      type: isMorning ? 'morning' : 'evening',
      responses: entries,
    };

    // Save to Firestore
    if (user?.uid) {
      try {
        await saveUserEntry(user.uid, 'fiveMinJournal', newEntry);
      } catch (err) {
        console.error('Firestore save failed:', err);
      }
    }

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = existing.filter(
      (e: Entry) => !(e.date === today && e.type === newEntry.type)
    );
    const updated = [newEntry, ...filtered];
    localStorage.setItem(key, JSON.stringify(updated));
    setPastEntries(updated);
    setSaved(true);
    setEntries(['', '', '']);
    setTimeout(() => setSaved(false), 3000);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const prompts = isMorning ? morningPrompts : eveningPrompts;

  const filteredEntries = pastEntries.filter((entry) =>
    filter === 'all' ? true : entry.type === filter
  );

  const paginatedEntries = filteredEntries.slice(
    (page - 1) * entriesPerPage,
    page * entriesPerPage
  );

  return (
    <motion.main
      className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4 flex flex-col items-center font-nunito"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.section
        className="w-full max-w-3xl mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
          <div className="text-3xl font-bold tracking-tight text-white mb-1">
          <span className="text-green-400">isit</span>focustime<span className="text-green-400">.com</span>
          </div>
        <p className="text-4xl font-black tracking-tight mb-2">5-Minute Journal</p>
        <p className="text-xl text-zinc-200 mb-4">{greeting()}, take a moment to reflect mindfully.</p>
        <p className="text-lg text-zinc-400">
          Start or end your day with intention. Your answers are saved privately in your browser{user ? ' and your account' : ''}.
        </p>
      </motion.section>

      <section className="w-full max-w-xl space-y-6">
        {prompts.map((prompt, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
          >
            <label className="font-semibold text-zinc-100 mb-2 flex items-center gap-2">
              {isMorning ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-purple-300" />} {prompt}
            </label>
            <textarea
              rows={3}
              value={entries[idx]}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="w-full flex items-center gap-2 mb-3 bg-zinc-800 border-zinc-700 p-3 rounded-xl shadow"
            />
          </motion.div>
        ))}
      </section>

      <button
        onClick={handleSave}
        className="mt-8 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition"
      >
        Save Journal Entry
      </button>

      <AnimatePresence>
        {saved && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-green-400"
          >
            Your journal entry was saved!
          </motion.p>
        )}
      </AnimatePresence>

      {filteredEntries.length > 0 && (
        <div className="mt-16 w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-4">📔 Past Entries</h2>

          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-zinc-400">
              Showing {Math.min((page - 1) * entriesPerPage + 1, filteredEntries.length)}–
              {Math.min(page * entriesPerPage, filteredEntries.length)} of {filteredEntries.length}
            </p>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as 'all' | 'morning' | 'evening');
                setPage(1);
              }}
              className="bg-zinc-800 border border-zinc-600 text-sm rounded px-3 py-2 text-white"
            >
              <option value="all">All Entries</option>
              <option value="morning">🌞 Morning Only</option>
              <option value="evening">🌙 Evening Only</option>
            </select>
          </div>

          <ul className="space-y-6">
            {paginatedEntries.map((entry, idx) => (
              <li
                key={idx}
                className="bg-zinc-800 p-4 rounded-lg border border-zinc-700"
              >
                <p className="text-sm text-zinc-400 mb-2">
                  {entry.date} – {entry.type === 'morning' ? '🌞 Morning' : '🌙 Evening'}
                </p>
                <ul className="list-disc pl-4 space-y-1 text-sm text-white">
                  {entry.responses.map((res, i) => (
                    <li key={i}>
                      {res || <span className="italic text-zinc-500">[empty]</span>}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-zinc-700 rounded-lg disabled:opacity-40"
            >
              ← Previous
            </button>
            <button
              onClick={() =>
                setPage((p) =>
                  p < Math.ceil(filteredEntries.length / entriesPerPage) ? p + 1 : p
                )
              }
              disabled={page >= Math.ceil(filteredEntries.length / entriesPerPage)}
              className="px-4 py-2 bg-zinc-700 rounded-lg disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </motion.main>
  );
}
