'use client';

import { useState, useEffect } from 'react';

const presetColors = [
  '#ff4d4d', // Red
  '#4dff4d', // Green
  '#4d4dff', // Blue
  '#ff4dff', // Pink
  '#ffcc00', // Yellow
  '#00ffff', // Cyan
  '#ffffff', // White
];

export default function MoodTrackerPage() {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [color, setColor] = useState(presetColors[0]);
  const [savedMessage, setSavedMessage] = useState('');
  const [pastEntries, setPastEntries] = useState<{ mood: string; note: string; color: string; timestamp: string }[]>([]);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('moodTrackerEntries') || '[]');
    setPastEntries(stored);
  }, []);

  const handleSave = () => {
    const existing = JSON.parse(localStorage.getItem('moodTrackerEntries') || '[]');
    const newEntry = {
      mood,
      note,
      color,
      timestamp: new Date().toISOString(),
    };
    const updated = [...existing, newEntry];
    localStorage.setItem('moodTrackerEntries', JSON.stringify(updated));
    setPastEntries(updated);
    setSavedMessage('🌟 Mood saved!');
    setMood('');
    setNote('');
    setColor(presetColors[0]); // Reset to first preset
  };

  const handleClear = () => {
    localStorage.removeItem('moodTrackerEntries');
    setPastEntries([]);
    setShowPast(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 px-6 py-12 text-white">
      <h1 className="text-3xl font-bold mb-6 font-nunito">isitfocustime.com</h1>
      <p className="flex flex-col items-center justify-center text-4xl font-bold mb-4">Mood tracker</p>

      <input
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="How are you feeling? (e.g., 😊, sad, excited)"
        className="bg-zinc-800 text-white rounded-lg px-4 py-3 mb-4 w-full max-w-md font-nunito placeholder-zinc-500"
      />

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Why do you feel this way? (optional)"
        className="bg-zinc-800 text-white rounded-lg px-4 py-3 mb-6 w-full max-w-md font-nunito placeholder-zinc-500"
      />

      {/* 🎨 Color Palette Picker */}
      <div className="flex gap-3 mb-6 flex-wrap justify-center">
        {presetColors.map((preset) => (
          <button
            key={preset}
            onClick={() => setColor(preset)}
            className={`w-8 h-8 rounded-full border-2 ${
              color === preset ? 'border-green-400' : 'border-transparent'
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

      {savedMessage && (
        <p className="text-green-300 mt-2 italic">{savedMessage}</p>
      )}

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
          Clear Saved Moods
        </button>
      </div>

      {showPast && (
        <div className="mt-8 w-full max-w-md space-y-4">
          {pastEntries.length === 0 ? (
            <p className="text-zinc-400 text-center italic">No past moods saved yet.</p>
          ) : (
            pastEntries.map((entry, idx) => (
              <div key={idx} className="bg-zinc-800 rounded-lg p-4 flex items-center gap-4">
                {/* 🎨 Show color */}
                <div
                  className="w-6 h-6 rounded-full"
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
    </div>
  );
}