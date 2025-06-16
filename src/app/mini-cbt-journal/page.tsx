'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const prompts = [
  "What’s the evidence this thought is true?",
  "What’s the evidence against it?",
  "What would I tell a friend in this situation?",
  "What’s a more balanced thought I could try instead?"
];

export default function MiniCBTJournalPage() {
  const [responses, setResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [savedEntries, setSavedEntries] = useState<string[]>([]);
  const [showPast, setShowPast] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const local = localStorage.getItem('cbtEntries');
    if (local) setSavedEntries(JSON.parse(local));
  }, []);

  const handleSave = () => {
    const updated = [...savedEntries, responses.join('\n')];
    localStorage.setItem('cbtEntries', JSON.stringify(updated));
    setSavedEntries(updated);
    setResponses([]);
    setCurrentPromptIndex(0);
    setCurrentResponse('');
  };

  const handleNext = () => {
    setResponses((prev) => [...prev, currentResponse]);
    setCurrentResponse('');
    setCurrentPromptIndex((prev) => prev + 1);
  };

  const filteredEntries = savedEntries.filter(entry =>
    entry.toLowerCase().includes(filter.toLowerCase())
  );

  return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="text-3xl font-bold tracking-tight text-white mb-1">
          <span className="text-green-400">isit</span>focustime<span className="text-green-400">.com</span>
          </div>
          <p className="text-4xl font-black tracking-tight mb-2">🧠 Mini CBT Journal</p>
        <p className="text-zinc-400 mb-6">
          Challenge negative thoughts and build resilience using short prompts.
        </p>

        {currentPromptIndex < prompts.length ? (
          <div className="mb-8">
            <p className="text-lg font-semibold mb-2">{prompts[currentPromptIndex]}</p>
            <Textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder="Write your response..."
              className="w-full h-32 bg-zinc-800 text-white p-4 rounded-lg"
            />
            <Button onClick={handleNext} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
              Next
            </Button>
          </div>
        ) : (
          <div className="mb-8">
            <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white">
              ✅ Save Entry
            </Button>
          </div>
        )}

        <div className="mb-6">
          <Button
            onClick={() => setShowPast(!showPast)}
            className="bg-zinc-700 hover:bg-zinc-600 text-white"
          >
            {showPast ? 'Hide Past Entries' : 'View Past Entries'}
          </Button>
        </div>

        {showPast && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="Filter responses..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 mb-4"
            />
            <ul className="space-y-4">
              {filteredEntries.map((entry, i) => (
                <li key={i} className="bg-zinc-800 p-4 rounded-lg text-sm text-zinc-300 whitespace-pre-line">
                  {entry}
                </li>
              ))}
              {filteredEntries.length === 0 && <p className="text-zinc-400">No matching entries.</p>}
            </ul>
          </div>
        )}

        <nav className="text-sm space-x-4">
          <Link href="/gratitude-journal" className="text-green-400 hover:underline">Gratitude Journal</Link>
          <Link href="/mood-tracker" className="text-blue-400 hover:underline">Mood Tracker</Link>
        </nav>
      </div>
      </div>
      </div>
  );
}
