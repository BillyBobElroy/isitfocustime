'use client';

import { useEffect, useState } from 'react';

type Habit = {
  name: string;
  streak: number;
  completedToday: boolean;
  datesCompleted: string[];
  reminderTime?: string;
};

type ReminderProps = {
  habits: Habit[];
};

export function DailyReminder({ habits }: ReminderProps) {
  const [showReminder, setShowReminder] = useState(false);
  const [habitName, setHabitName] = useState('');

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        try {
          await Notification.requestPermission();
        } catch (error) {
          console.error('Notification permission request failed:', error);
        }
      }
    };

    requestNotificationPermission(); // ✅ Request once on mount
  }, []);

  useEffect(() => {
    const sendHabitNotification = (habitName: string) => {
      if (Notification.permission === 'granted') {
        new Notification('Habit Reminder', {
          body: `Have you completed "${habitName}" today?`,
          icon: '/icons/habit-icon.png', // optional if you have
          badge: '/icons/badge.png', // optional
        });
      }
    };

    const checkReminder = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

      for (const habit of habits) {
        if (!habit.reminderTime) continue;

        const hasCompletedToday = habit.datesCompleted.includes(todayStr);
        const isDismissed = localStorage.getItem(`dismissed-${habit.name}-${todayStr}`);
        
        if (
          habit.reminderTime === currentTime &&
          !hasCompletedToday &&
          !isDismissed
        ) {
          sendHabitNotification(habit.name); // 🎯 Fire the real notification
          setHabitName(habit.name);
          setShowReminder(true);
          break;
        }
      }
    };

    const interval = setInterval(checkReminder, 60000); // Check every 1 minute
    return () => clearInterval(interval);
  }, [habits]);

  const dismiss = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(`dismissed-${habitName}-${todayStr}`, 'true');
    setShowReminder(false);
  };

  if (!showReminder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded-lg text-white max-w-sm mx-auto">
        <h2 className="text-2xl font-bold mb-4">🌟 Daily Reminder</h2>
        <p className="mb-6 text-center">
          Have you completed <span className="font-bold text-green-400">{habitName}</span> today?
        </p>
        <button
          onClick={dismiss}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg w-full"
        >
          Mark as Done
        </button>
      </div>
    </div>
  );
}