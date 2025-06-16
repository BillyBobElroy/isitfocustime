'use client';

import { useEffect, useState } from 'react';
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Info } from 'lucide-react';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function Badge({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <div className="relative group inline-block">
      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full mr-2">{label}</span>
      <div className="absolute left-0 mt-1 w-max bg-zinc-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {tooltip}
      </div>
    </div>
  );
}

export default function SleepDiaryPage() {
  const { user } = useFirebaseUser();
  const [bedtime, setBedtime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [restfulness, setRestfulness] = useState(5);
  const [entries, setEntries] = useState<any[]>([]);
  const [showTrends, setShowTrends] = useState(false);
  const [filter, setFilter] = useState<'all' | '7days' | '30days'>('all');
  const [showRestfulness, setShowRestfulness] = useState(true);
  const [showDuration, setShowDuration] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const loadEntries = async () => {
      const ref = collection(db, 'users', user.uid, 'sleepDiary');
      const q = query(ref, orderBy('date', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(data);
    };
    loadEntries();
  }, [user]);

  const handleSave = async () => {
    if (!user?.uid) return;
    const entry = {
      bedtime,
      wakeTime,
      restfulness,
      date: Timestamp.now(),
    };
    await addDoc(collection(db, 'users', user.uid, 'sleepDiary'), entry);
    setEntries([entry, ...entries]);
    setBedtime('');
    setWakeTime('');
    setRestfulness(5);
  };

  const getFilteredEntries = () => {
    const now = new Date();
    return entries.filter((entry) => {
      const entryDate = new Date(entry.date.seconds * 1000);
      if (filter === '7days') {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return entryDate >= sevenDaysAgo;
      } else if (filter === '30days') {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return entryDate >= thirtyDaysAgo;
      }
      return true;
    });
  };

  const filtered = getFilteredEntries();

  const durations = filtered.map(e => {
    const [bHour, bMin] = e.bedtime.split(':').map(Number);
    const [wHour, wMin] = e.wakeTime.split(':').map(Number);
    let hours = wHour - bHour + (wMin - bMin) / 60;
    if (hours < 0) hours += 24;
    return parseFloat(hours.toFixed(2));
  });

  const avgRestfulness = (filtered.reduce((acc, e) => acc + e.restfulness, 0) / filtered.length || 0).toFixed(1);
  const avgDuration = (durations.reduce((acc, h) => acc + h, 0) / durations.length || 0).toFixed(2);
  const goodNights = filtered.filter(e => e.restfulness >= 7).length;
  const badNights = filtered.filter(e => e.restfulness <= 4).length;
  const longestSleep = Math.max(...durations, 0).toFixed(2);
  const shortestSleep = Math.min(...durations, 0).toFixed(2);
  const sleepStreak = (() => {
    let streak = 0;
    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i].restfulness >= 7) streak++;
      else break;
    }
    return streak;
  })();

  const chartData = {
    labels: filtered.map(e => new Date(e.date.seconds * 1000).toLocaleDateString()).reverse(),
    datasets: [
      {
        label: 'Restfulness',
        data: filtered.map(e => e.restfulness).reverse(),
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74,222,128,0.2)',
        tension: 0.4,
      },
    ],
  };

  const durationData = {
    labels: filtered.map(e => new Date(e.date.seconds * 1000).toLocaleDateString()).reverse(),
    datasets: [
      {
        label: 'Sleep Duration (hrs)',
        data: durations.reverse(),
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96,165,250,0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white px-4 py-12 flex flex-col items-center justify-center">
      <div className="text-3xl font-bold tracking-tight text-white mb-1">
        <span className="text-green-400">isit</span>focustime<span className="text-green-400">.com</span>
      </div>
      <p className="text-4xl font-black tracking-tight mb-2">🛏️ Sleep Diary</p>
      <p className="text-zinc-400 mb-8 text-center max-w-xl">Track your bedtime, wake time, and how restful you felt. View patterns over time.</p>

      <div className="w-full max-w-md space-y-4">
        <div>
          <label className="block text-sm mb-1">Bedtime</label>
          <input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} className="w-full rounded bg-zinc-800 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Wake Time</label>
          <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="w-full rounded bg-zinc-800 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Restfulness (1–10)</label>
          <input type="range" min={1} max={10} value={restfulness} onChange={(e) => setRestfulness(Number(e.target.value))} className="w-full" />
          <p className="text-sm text-center mt-1">{restfulness}</p>
        </div>
        <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg w-full">Save Entry</button>
      </div>

      {entries.length > 0 && (
        <div className="mt-10 w-full max-w-2xl">
          <div className="bg-zinc-800 p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-2">🧠 Sleep Insights</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge label="Avg Restfulness" tooltip="Average restfulness score over selected range" />
              <Badge label="Avg Duration" tooltip="Average hours of sleep per night" />
              <Badge label="Good Nights" tooltip="Number of nights with restfulness ≥ 7" />
              <Badge label="Bad Nights" tooltip="Number of nights with restfulness ≤ 4" />
              <Badge label="Rest Streak" tooltip="How many nights in a row you've slept well" />
              <Badge label="Longest Sleep" tooltip="Maximum recorded sleep duration" />
              <Badge label="Shortest Sleep" tooltip="Minimum recorded sleep duration" />
            </div>
            <ul className="text-sm space-y-1 text-zinc-300">
              <li>Average Restfulness: <span className="text-white font-semibold">{avgRestfulness} / 10</span></li>
              <li>Average Sleep Duration: <span className="text-white font-semibold">{avgDuration} hrs</span></li>
              <li>Good Nights (≥7): <span className="text-white font-semibold">{goodNights}</span></li>
              <li>Bad Nights (≤4): <span className="text-white font-semibold">{badNights}</span></li>
              <li>Restfulness Streak: <span className="text-white font-semibold">{sleepStreak} night(s)</span></li>
              <li>Longest Sleep: <span className="text-white font-semibold">{longestSleep} hrs</span></li>
              <li>Shortest Sleep: <span className="text-white font-semibold">{shortestSleep} hrs</span></li>
            </ul>
          </div>

          <button onClick={() => setShowTrends(!showTrends)} className="mt-2 mb-4 text-sm text-green-400 hover:underline">
            {showTrends ? 'Hide Trends' : 'Show Trends'}
          </button>

          {showTrends && (
            <>
              <div className="bg-zinc-800 p-4 rounded-lg shadow-inner mb-6">
                <div className="flex justify-between mb-4">
                  <div className="flex space-x-2">
                    <button onClick={() => setShowRestfulness(!showRestfulness)} className={`px-3 py-1 rounded ${showRestfulness ? 'bg-green-500' : 'bg-zinc-700'}`}>Restfulness</button>
                    <button onClick={() => setShowDuration(!showDuration)} className={`px-3 py-1 rounded ${showDuration ? 'bg-green-500' : 'bg-zinc-700'}`}>Sleep Duration</button>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-green-500' : 'bg-zinc-700'}`}>All</button>
                    <button onClick={() => setFilter('7days')} className={`px-3 py-1 rounded ${filter === '7days' ? 'bg-green-500' : 'bg-zinc-700'}`}>7d</button>
                    <button onClick={() => setFilter('30days')} className={`px-3 py-1 rounded ${filter === '30days' ? 'bg-green-500' : 'bg-zinc-700'}`}>30d</button>
                  </div>
                </div>
              </div>

              {showRestfulness && (
                <>
                  <h2 className="text-xl font-bold mb-4">📈 Restfulness Trend</h2>
                  <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </>
              )}

              {showDuration && (
                <>
                  <h2 className="text-xl font-bold mt-10 mb-4">⏱️ Sleep Duration Trend</h2>
                  <Line data={durationData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
