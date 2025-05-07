'use client';

import { useEffect, useState } from 'react';

const morningPrompts = [
  'What are you grateful for today?',
  'What is your intention for the day?',
  'What would make today great?'
];

const eveningPrompts = [
  'What went well today?',
  'What are you proud of today?',
  'How can you improve tomorrow?'
];

export default function JournalPage() {
  const [isMorning, setIsMorning] = useState(true);
  const [entries, setEntries] = useState<string[]>(['', '', '']);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    setIsMorning(hour < 17); // before 5pm = morning journal, else evening

    const key = hour < 17 ? 'journal-morning' : 'journal-evening';
    const stored = localStorage.getItem(key);
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  const handleChange = (index: number, value: string) => {
    const updated = [...entries];
    updated[index] = value;
    setEntries(updated);
  };

  const handleSave = () => {
    const key = isMorning ? 'journal-morning' : 'journal-evening';
    localStorage.setItem(key, JSON.stringify(entries));
    setSaved(true);
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

      {saved && <p className="mt-4 text-green-600">Your journal entry was saved!</p>}
    
    
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4813693653154178"
     crossOrigin="anonymous"></script>
    
    </main>
  );
}
