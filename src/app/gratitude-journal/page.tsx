'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';

export default function GratitudeJournal() {
  const [gratitudes, setGratitudes] = useState(['', '', '']);
  const [savedEntries, setSavedEntries] = useState<{ date: string; entries: string[] }[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showPastEntries, setShowPastEntries] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('gratitude-entries');
    if (stored) {
      setSavedEntries(JSON.parse(stored));
    }
  }, []);

  const saveEntries = () => {
    if (gratitudes.every((g) => g.trim() === '')) return;
    const today = new Date().toISOString().split('T')[0];
    const updated = [...savedEntries, { date: today, entries: gratitudes }];
    setSavedEntries(updated);
    localStorage.setItem('gratitude-entries', JSON.stringify(updated));
    setGratitudes(['', '', '']);
  };

  const clearEntries = () => {
    localStorage.removeItem('gratitude-entries');
    setSavedEntries([]);
  };

  const filteredEntries = selectedDate
    ? savedEntries.filter((e) => e.date === selectedDate)
    : savedEntries;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white px-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">isitfocustime.com</h1>
        <p className="text-4xl font-bold mb-6 text-center">Gratitude Journal</p>

        {gratitudes.map((g, idx) => (
          <input
            key={idx}
            type="text"
            className="w-full p-3 mb-3 rounded-lg bg-zinc-800 text-white"
            placeholder={`I'm grateful for... ${idx + 1}`}
            value={g}
            onChange={(e) => {
              const updated = [...gratitudes];
              updated[idx] = e.target.value;
              setGratitudes(updated);
            }}
          />
        ))}

        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg mb-4"
          onClick={saveEntries}
        >
          Save Gratitude
        </button>

        <button
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg mb-6"
          onClick={clearEntries}
        >
          Clear All Entries
        </button>

        <div className="mb-6">
          <label className="block text-sm mb-2">Pick a date to view entries:</label>
          <input
            type="date"
            className="w-full p-2 rounded-lg bg-zinc-800 text-white"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg mb-6"
          onClick={() => setShowPastEntries(!showPastEntries)}
        >
          {showPastEntries ? 'Hide Past Entries' : 'View Past Entries'}
        </button>

        {showPastEntries && filteredEntries.length > 0 && (
          <div className="bg-zinc-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Past Gratitudes</h2>
            <ul className="space-y-4">
              {filteredEntries.map((item, idx) => (
                <li key={idx} className="bg-zinc-700 p-4 rounded text-sm">
                  <div className="text-xs text-zinc-400 mb-2">{item.date}</div>
                  <ul className="list-disc pl-5">
                    {item.entries.map((entry, i) => (
                      <li key={i}>{entry}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showPastEntries && filteredEntries.length === 0 && (
          <p className="text-center text-zinc-400">No entries for this date.</p>
        )}
      </div>
    </div>
  );
}