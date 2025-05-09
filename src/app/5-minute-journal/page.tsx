'use client';

import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const hour = new Date().getHours();
    setIsMorning(hour < 17); // before 5pm = morning journal, else evening

    const key = 'journal-entries';
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed: Entry[] = JSON.parse(stored);
      setPastEntries(parsed.sort((a, b) => b.date.localeCompare(a.date)));
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    const updated = [...entries];
    updated[index] = value;
    setEntries(updated);
  };

  const handleSave = () => {
    const today = new Date().toISOString().split('T')[0];
    const key = 'journal-entries';

    const newEntry: Entry = {
      date: today,
      type: isMorning ? 'morning' : 'evening',
      responses: entries,
    };

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

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-4 py-12 flex flex-col items-center font-nunito">
      <h1 className="text-4xl font-bold mb-2">5-Minute Journal</h1>
      <p className="text-xl text-white mb-6">{greeting()}, take a moment to reflect.</p>

      <div className="w-full max-w-xl space-y-6">
        {prompts.map((prompt, idx) => (
          <div key={idx}>
            <label className="block font-semibold mb-2">{prompt}</label>
            <textarea
              rows={3}
              value={entries[idx]}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-8 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl"
      >
        Save Entry
      </button>

      {saved && <p className="mt-4 text-green-400">Your journal entry was saved!</p>}

      {/* Past Entries */}
      {pastEntries.length > 0 && (
        <div className="mt-12 w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-4">📔 Past Entries</h2>
          <ul className="space-y-6">
            {pastEntries.map((entry, idx) => (
              <li key={idx} className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                <p className="text-sm text-zinc-400 mb-2">
                  {entry.date} – {entry.type === 'morning' ? '🌞 Morning' : '🌙 Evening'}
                </p>
                <ul className="list-disc pl-4 space-y-1 text-sm text-white">
                  {entry.responses.map((res, i) => (
                    <li key={i}>{res || <span className="italic text-zinc-500">[empty]</span>}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
