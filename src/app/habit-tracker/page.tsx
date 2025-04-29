'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/Calendar';
import { DailyReminder } from '@/components/DailyReminder';

type Habit = {
  name: string;
  streak: number;
  completedToday: boolean;
  datesCompleted: string[];
  reminderTime?: string;
  priority: 'High' | 'Medium' | 'Low'; // ✅ new priority field
};

export default function HabitTrackerPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [selectedHabit, setSelectedHabit] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('habit-tracker-habits');
    if (stored) setHabits(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
  }, [habits]);

  const handleAddHabit = () => {
    if (!newHabit.trim()) return;
    setHabits([...habits, { 
      name: newHabit.trim(), 
      streak: 0, 
      completedToday: false, 
      datesCompleted: [], 
      reminderTime: newReminderTime || undefined,
      priority: newPriority,
    }]);
    setNewHabit('');
    setNewReminderTime('');
    setNewPriority('Medium');
  };

  const handleMarkComplete = (index: number) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = [...habits];
    if (!updated[index].datesCompleted.includes(today)) {
      updated[index].streak += 1;
      updated[index].datesCompleted.push(today);
    }
    updated[index].completedToday = true;
    setHabits(updated);
  };

  const handleDeleteHabit = (index: number) => {
    const updated = [...habits];
    updated.splice(index, 1);
    setHabits(updated);
    if (selectedHabit === habits[index]?.name) setSelectedHabit('');
  };

  const handleReminderChange = (habitName: string, newTime: string) => {
    const updated = habits.map(h => 
      h.name === habitName ? { ...h, reminderTime: newTime } : h
    );
    setHabits(updated);
  };

  const handleNameChange = (index: number, newName: string) => {
    const updated = [...habits];
    updated[index].name = newName;
    setHabits(updated);
  };

  const handlePriorityChange = (index: number, newPriority: 'High' | 'Medium' | 'Low') => {
    const updated = [...habits];
    updated[index].priority = newPriority;
    setHabits(updated);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Habit Tracker</h1>

      {/* ➕ New Habit Form */}
      <div className="flex flex-col gap-4 mb-6 w-full max-w-md">
        <input
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add new habit"
          className="bg-zinc-800 px-4 py-2 rounded-lg"
        />
        <input
          type="time"
          value={newReminderTime}
          onChange={(e) => setNewReminderTime(e.target.value)}
          className="bg-zinc-800 text-white px-4 py-2 rounded-lg"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as 'High' | 'Medium' | 'Low')}
          className="bg-zinc-800 text-white px-4 py-2 rounded-lg"
        >
          <option value="High">🔥 High Priority</option>
          <option value="Medium">💪 Medium Priority</option>
          <option value="Low">🌱 Low Priority</option>
        </select>
        <button onClick={handleAddHabit} className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600">
          Add Habit
        </button>
      </div>

      {/* 🧱 Habit List */}
      <div className="w-full max-w-md space-y-4">
        {habits.length === 0 ? (
          <p className="text-zinc-400 italic text-center">No habits yet. Start building!</p>
        ) : (
          habits.map((habit, idx) => (
            <div key={idx} className="flex flex-col gap-2 bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <input
                    value={habit.name}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    className="bg-zinc-700 px-2 py-1 rounded text-white mb-2 text-sm"
                  />
                  <select
                    value={habit.priority}
                    onChange={(e) => handlePriorityChange(idx, e.target.value as 'High' | 'Medium' | 'Low')}
                    className="bg-zinc-700 px-2 py-1 rounded text-white text-xs mb-2"
                  >
                    <option value="High">🔥 High</option>
                    <option value="Medium">💪 Medium</option>
                    <option value="Low">🌱 Low</option>
                  </select>
                  <p className="text-sm text-zinc-400">🔥 Streak: {habit.streak}</p>
                  {habit.reminderTime && (
                    <p className="text-xs text-zinc-400">⏰ Reminder at {habit.reminderTime}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {!habit.completedToday && (
                    <button
                      onClick={() => handleMarkComplete(idx)}
                      className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-xs"
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedHabit(habit.name)}
                    className="bg-purple-500 px-3 py-1 rounded hover:bg-purple-600 text-xs"
                  >
                    Calendar
                  </button>
                  <button
                    onClick={() => handleDeleteHabit(idx)}
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* 🕒 Reminder Edit */}
              <input
                type="time"
                value={habit.reminderTime || ''}
                onChange={(e) => handleReminderChange(habit.name, e.target.value)}
                className="bg-zinc-700 p-2 rounded-lg mt-2"
              />
            </div>
          ))
        )}
      </div>

      {/* 🗓️ Calendar Section */}
      {selectedHabit && (
        <div className="mt-10 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">{selectedHabit} Completion</h2>
          <Calendar completedDates={habits.find(h => h.name === selectedHabit)?.datesCompleted || []} />
          <button
            onClick={() => setSelectedHabit('')}
            className="mt-6 bg-zinc-700 px-4 py-2 rounded-lg w-full hover:bg-zinc-600"
          >
            Close Calendar
          </button>
        </div>
      )}

      {/* 🔔 Daily Reminder Modal */}
      <DailyReminder habits={habits} />
    </div>
  );
}