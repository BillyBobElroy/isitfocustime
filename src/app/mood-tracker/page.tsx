'use client';

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2'; // 📈 for chart later (I'll set it up simply)

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

const presetEmojis = ['😄', '😐', '😔', '😠', '😭', '🥳', '😎', '🤯'];

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
  const [showChart, setShowChart] = useState(false);

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
    const updated = [newEntry, ...pastEntries];
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

  const getMoodCounts = () => {
    const counts: { [color: string]: number } = {};
    pastEntries.forEach((entry) => {
      counts[entry.color] = (counts[entry.color] || 0) + 1;
    });
    return counts;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-900 px-6 py-12 text-white">
      <h1 className="text-3xl font-bold mb-6 font-nunito">isitfocustime.com</h1>
      <p className="text-4xl font-bold mb-8">Mood Tracker</p>

      {/* Favorite Emoji Quick Select */}
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

      {/* Mood Input */}
      <input
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="Mood or emoji"
        className="bg-zinc-800 text-white rounded-lg px-4 py-3 mb-4 w-full max-w-md font-nunito placeholder-zinc-500"
      />

      {/* Note Input */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional notes"
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

      {/* Save Mood */}
      <button
        onClick={handleSave}
        className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 py-3 font-nunito transition mb-4"
      >
        Save Mood
      </button>

      {savedMessage && <p className="text-green-300 mt-2 italic">{savedMessage}</p>}

      {/* Toggle Past Moods and Chart */}
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

      {/* Past Moods */}
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

      {/* Mood Chart */}
      {showChart && (
        <div className="mt-10 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4 text-center">Mood Frequency</h2>
          {/* Very simple bar chart */}
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
  );
}