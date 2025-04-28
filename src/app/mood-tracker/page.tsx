'use client';

import { useState, useEffect } from 'react';

// 🎨 Expand preset mood colors
const presetColors = [
  '#ff6b6b', // Coral Red
  '#feca57', // Warm Yellow
  '#48dbfb', // Light Blue
  '#1dd1a1', // Teal
  '#5f27cd', // Purple
  '#ff9ff3', // Pink
  '#c8d6e5', // Light Gray
  '#576574', // Slate Gray
];

type MoodEntry = {
  mood: string;
  note: string;
  color: string;
  timestamp: string;
};

export default function MoodTrackerPage() {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [color, setColor] = useState(presetColors[0]);
  const [savedMessage, setSavedMessage] = useState('');
  const [pastEntries, setPastEntries] = useState<MoodEntry[]>([]);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('moodTrackerEntries') || '[]');
    setPastEntries(stored);
  }, []);

  const handleSave = () => {
    const newEntry: MoodEntry = {
      mood,
      note,
      color,
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...pastEntries]; // Newest on top
    localStorage.setItem('moodTrackerEntries', JSON.stringify(updated));
    setPastEntries(updated);
    setSavedMessage('🌟 Mood saved!');
    setMood('');
    setNote('');
    setColor(presetColors[0]);
  };

  const handleClear = () => {
    localStorage.removeItem('moodTrackerEntries');
    setPastEntries([]);
    setShowPast(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-900 px-6 py-12 text-white">
      <h1 className="text-3xl font-bold mb-6 font-nunito">isitfocustime.com</h1>
      <p className="text-4xl font-bold mb-8">Mood Tracker</p>

      {/* Mood Input */}
      <input
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="One word or emoji for your mood"
        className="bg-zinc-800 text-white rounded-lg px-4 py-3 mb-4 w-full max-w-md font-nunito placeholder-zinc-500"
      />

      {/* Note Input */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional note about your day"
        className="bg-zinc-800 text-white rounded-lg px-4 py-3 mb-6 w-full max-w-md font-nunito placeholder-zinc-500 resize-none"
        rows={3}
      />

      {/* Color Picker */}
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

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 py-3 font-nunito transition mb-4"
      >
        Save Mood
      </button>

      {savedMessage && <p className="text-green-300 mt-2 italic">{savedMessage}</p>}

      {/* Past Moods Toggle */}
      <div className="flex space-x-4 mt-8">
        <button
          onClick={() => setShowPast(!showPast)}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-nunito"
        >
          {showPast ? 'Hide Past Moods' : 'View Past Moods'}
        </button>

        <button
          onClick={handleClear}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-nunito"
        >
          Clear Moods
        </button>
      </div>

      {/* Past Moods */}
      {showPast && (
        <div className="mt-10 w-full max-w-md space-y-4">
          {pastEntries.length === 0 ? (
            <p className="text-zinc-400 text-center italic">No past moods saved yet.</p>
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
                  <p className="text-xl font-bold font-nunito">{entry.mood}</p>
                  {entry.note && <p className="text-zinc-300 mt-1">{entry.note}</p>}
                  <p className="text-xs text-zinc-400 mt-2">{new Date(entry.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}