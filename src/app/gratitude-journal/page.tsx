'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';

export default function GratitudeJournal() {
  const [gratitudeEntry, setGratitudeEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState<{ date: string; entry: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showPastEntries, setShowPastEntries] = useState(false);

  useEffect(() => {
    const storedEntries = localStorage.getItem('gratitude-entries');
    if (storedEntries) {
      setSavedEntries(JSON.parse(storedEntries));
    }
  }, []);

  const saveEntry = () => {
    if (gratitudeEntry.trim() === '') return;
    const today = new Date().toISOString().split('T')[0];
    const updatedEntries = [...savedEntries, { date: today, entry: gratitudeEntry }];
    setSavedEntries(updatedEntries);
    localStorage.setItem('gratitude-entries', JSON.stringify(updatedEntries));
    setGratitudeEntry('');
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
        <p className="flex flex-col items-center justify-center text-4xl font-bold mb-4">Gratitude Journal</p>

        <textarea
          className="w-full p-4 rounded-lg bg-zinc-800 text-white mb-4"
          rows={5}
          placeholder="Write what you're grateful for today..."
          value={gratitudeEntry}
          onChange={(e) => setGratitudeEntry(e.target.value)}
        />

        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg mb-4"
          onClick={saveEntry}
        >
          Save Gratitude Entry
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
            <ul className="space-y-2">
              {filteredEntries.map((item, index) => (
                <li key={index} className="bg-zinc-700 p-3 rounded text-sm">
                  <div className="text-xs text-zinc-400 mb-1">{item.date}</div>
                  {item.entry}
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