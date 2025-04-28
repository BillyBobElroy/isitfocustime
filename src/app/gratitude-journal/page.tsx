'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';

export default function GratitudeJournal() {
  const [gratitudes, setGratitudes] = useState(['']);
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
    setGratitudes(['']);
  };

  const clearEntries = () => {
    localStorage.removeItem('gratitude-entries');
    setSavedEntries([]);
  };

  const addField = () => {
    setGratitudes([...gratitudes, '']);
  };

  const removeField = (index: number) => {
    const updated = gratitudes.filter((_, idx) => idx !== index);
    setGratitudes(updated.length ? updated : ['']);
  };

  const filteredEntries = selectedDate
    ? savedEntries.filter((e) => e.date === selectedDate)
    : savedEntries;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white px-6 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">isitfocustime.com</h1>
          <p className="text-4xl font-bold">Gratitude Journal</p>
          <p className="text-sm text-zinc-400 mt-2">Capture 1-5 things you're grateful for daily 🌟</p>
        </div>

        {gratitudes.map((g, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-3">
            <input
              type="text"
              placeholder={`I'm grateful for...`}
              value={g}
              onChange={(e) => {
                const updated = [...gratitudes];
                updated[idx] = e.target.value;
                setGratitudes(updated);
              }}
              className="flex-1 bg-zinc-800 p-3 rounded-lg"
            />
            {gratitudes.length > 1 && (
              <button
                onClick={() => removeField(idx)}
                className="text-red-400 hover:text-red-500"
              >
                ✖
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addField}
          className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg mb-4"
        >
          + Add More
        </button>

        <button
          onClick={saveEntries}
          className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-semibold"
        >
          Save Gratitudes
        </button>

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

        {/* Past Entries Section */}
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
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* (Optional) Footer Ads or Motivational Quote Later */}
      </div>
    </div>
  );
}