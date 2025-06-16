"use client";

import { useEffect, useState } from "react";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Badge } from "@/components/Badge";
import Link from "next/link";
import { getGreeting } from '@/utils/getGreeting';
import { getDailyAffirmation } from '@/lib/getDailyAffirmations';
import { getLastMood } from "@/lib/getLastMood";
import AvatarModal from "@/components/AvatarModal";
import Image from "next/image";

export default function ProfilePage() {
  const { user, refetchUser } = useFirebaseUser();
  const [stats, setStats] = useState({
    streak: 0,
    totalSessions: 0,
    totalFocusTime: 0,
    moodEntries: 0,
    habitCompletions: 0,
    routineCompletions: 0,
    daysLogged: 0,
    badges: [] as string[],
  });
  const [routine, setRoutine] = useState<string[]>([]);
  const [sleepSummary, setSleepSummary] = useState<any>(null);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'night'>('morning');
  const [affirmation, setAffirmation] = useState<string | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("default"); // e.g., from Firestore


  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('night');
  }, []);

useEffect(() => {
  const loadAffirmation = async () => {
    if (!user?.uid) return;
    const lastMood = await getLastMood(user.uid); // Make sure this is a real function
    const quote = getDailyAffirmation(timeOfDay, lastMood);
    setAffirmation(quote);
  };

  loadAffirmation();
}, [user?.uid, timeOfDay]);

  useEffect(() => {
    if (!user?.uid) return;

    const loadStats = async () => {
      try {
        const focusRef = doc(db, "users", user.uid, "focusStats", "session");
        const moodRef = doc(db, "users", user.uid, "moodStats", "summary");
        const habitRef = doc(db, "users", user.uid, "habitStats", "summary");
        const routineRef = doc(db, "users", user.uid, "routineStats", "summary");
        const activityRef = doc(db, "users", user.uid, "activityLog", "summary");

        const [focusSnap, moodSnap, habitSnap, routineSnap, activitySnap] = await Promise.all([
          getDoc(focusRef),
          getDoc(moodRef),
          getDoc(habitRef),
          getDoc(routineRef),
          getDoc(activityRef),
        ]);

        setStats({
          streak: focusSnap.exists() ? focusSnap.data().streak || 0 : 0,
          totalSessions: focusSnap.exists() ? focusSnap.data().totalSessions || 0 : 0,
          totalFocusTime: focusSnap.exists() ? focusSnap.data().totalFocusTime || 0 : 0,
          moodEntries: moodSnap.exists() ? moodSnap.data().entries || 0 : 0,
          habitCompletions: habitSnap.exists() ? habitSnap.data().completed || 0 : 0,
          routineCompletions: routineSnap.exists() ? routineSnap.data().completed || 0 : 0,
          daysLogged: activitySnap.exists() ? activitySnap.data().days || 0 : 0,
          badges: focusSnap.exists() ? focusSnap.data().badges || [] : [],
        });
      } catch (err) {
        console.error("❌ Failed to load stats:", err);
      }
    };

    const loadRoutine = () => {
      const stored = localStorage.getItem("focus-routine");
      if (stored) setRoutine(JSON.parse(stored));
    };

    const loadSleepSummary = async () => {
      try {
        const ref = collection(db, "users", user.uid, "sleepDiary");
        const snap = await getDocs(query(ref, orderBy("date", "desc")));
        const entries = snap.docs.map(doc => doc.data());
        if (entries.length === 0) return;

        const restfulnessArr = entries.map(e => e.restfulness);
        const durations = entries.map(e => {
          const [bHour, bMin] = e.bedtime.split(":" ).map(Number);
          const [wHour, wMin] = e.wakeTime.split(":" ).map(Number);
          let hours = wHour - bHour + (wMin - bMin) / 60;
          if (hours < 0) hours += 24;
          return hours;
        });

        const avgRestfulness = (restfulnessArr.reduce((a, b) => a + b, 0) / restfulnessArr.length).toFixed(1);
        const avgDuration = (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1);
        const goodNights = restfulnessArr.filter(r => r >= 7).length;
        const totalNights = entries.length;

        setSleepSummary({
          avgRestfulness,
          avgDuration,
          goodNights,
          totalNights,
        });
      } catch (err) {
        console.error("❌ Failed to load sleep data:", err);
      }
    };

    loadStats();
    loadRoutine();
    loadSleepSummary();
  }, [user?.uid]);

const getAvatar = () => {
  if (!user?.avatarId) {
    return (
      <div
        className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-2xl"
        title="Click to change avatar"
      >
        🧘
      </div>
    );
  }

  return (
    <Image
      src={`/avatars/characters/${user.avatarId}.png`}
      alt={`${user.avatarId} Avatar`}
      width={80}
      height={80}
      className="rounded-full"
      loading="eager"
    />
  );
};

  const getAdaptiveFlow = () => {
    switch (timeOfDay) {
      case 'morning':
        return (
          <>
            <motion.div whileHover={{ scale: 1.03 }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">🌞 Start fresh with a mood check-in → <Link href="/mood-tracker">Log Mood</Link></motion.div>
            <motion.div whileHover={{ scale: 1.03 }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">📔 Set intentions in your <Link href="/5-minute-journal">Morning Journal</Link></motion.div>
            <motion.div whileHover={{ scale: 1.03 }} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow">🎯 Kick off a <Link href="/focus-timer">Focus Session</Link></motion.div>
          </>
        );
      case 'afternoon':
        return (
          <>
            <motion.div whileHover={{ scale: 1.03 }} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded shadow">🌤️ Refresh with a quick <Link href="/mood-tracker">Mood Check</Link></motion.div>
            <motion.div whileHover={{ scale: 1.03 }} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded shadow">📋 Review your <Link href="/habit-tracker">Habits</Link></motion.div>
            <motion.div whileHover={{ scale: 1.03 }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow">⏱️ Restart flow with <Link href="/focus-timer">Focus Timer</Link></motion.div>
          </>
        );
      case 'night':
        return (
          <>
            <motion.div whileHover={{ scale: 1.03 }} className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded shadow">🌙 Reflect in your <Link href="/mood-tracker">Evening Mood Log</Link></motion.div>
            <motion.div whileHover={{ scale: 1.03 }} className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded shadow">🛏️ Unwind with <Link href="/5-minute-journal">Night Journal</Link></motion.div>
            <motion.div whileHover={{ scale: 1.03 }} className="bg-teal-800 hover:bg-teal-900 text-white px-4 py-2 rounded shadow">😴 Prepare sleep entry in <Link href="/sleep-diary">Sleep Diary</Link></motion.div>
            <div className="mt-4 text-sm text-zinc-300">
              <p className="mb-1">💡 Tip: Avoid screens and bright lights 30 mins before bed.</p>
              <p className="mb-1">🧘 Try a <Link href="/meditation" className="underline text-blue-300">5-min calming meditation</Link> before sleep.</p>
              <p className="mb-1">📵 Silence your notifications and breathe deeply.</p>
            </div>
          </>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl text-center"
      >
        <div className="flex flex-col items-center mb-6">
<div className="cursor-pointer" onClick={() => setShowAvatarModal(true)}>
  {getAvatar()}
</div>
</div>

        <h1 className="text-3xl font-bold mb-2">{getGreeting(user?.firstName)}</h1>
{affirmation && (
  <div className="text-center text-lg italic text-zinc-300 mt-2 px-4 mb-4">
    “{affirmation}”
  </div>
)}

        <div className="bg-zinc-800 p-6 rounded-xl shadow-md text-left mb-10 border border-zinc-700">
          <h2 className="text-xl font-bold mb-4 text-white">
            {timeOfDay === 'morning' && `🌞 Morning focus, ${user?.firstName}. Let’s set your tone for the day.`}
            {timeOfDay === 'afternoon' && `🌤️ Midday boost, ${user?.firstName}. Keep your momentum going.`}
            {timeOfDay === 'night' && `🌙 Evening check-in, ${user?.firstName}. Let’s reflect and recharge.`}
          </h2>
          <div className="flex flex-col gap-3 text-sm">
            {getAdaptiveFlow()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm mb-10">
          <StatCard label="🔥 Current Streak" value={`${stats.streak} Days`} />
          <StatCard label="🧘 Focus Sessions" value={stats.totalSessions} />
          <StatCard label="⏲️ Total Focus Time" value={`${Math.round(stats.totalFocusTime / 60)} min`} />
          <StatCard label="📓 Mood Entries" value={stats.moodEntries} />
          <StatCard label="✅ Habits Completed" value={stats.habitCompletions} />
          <StatCard label="📅 Routines Done" value={stats.routineCompletions} />
          <StatCard label="🗓️ Days Logged" value={stats.daysLogged} />
        </div>

        {sleepSummary && (
          <div className="bg-zinc-800 p-6 rounded-xl shadow-md text-left mb-10 border border-zinc-700">
            <h2 className="text-xl font-bold mb-4 text-white">😴 Sleep Summary</h2>
            <ul className="text-zinc-300 space-y-1">
              <li>🌙 Avg Restfulness: {sleepSummary.avgRestfulness} / 10</li>
              <li>🕒 Avg Sleep Duration: {sleepSummary.avgDuration} hrs</li>
              <li>💤 Good Nights: {sleepSummary.goodNights} / {sleepSummary.totalNights}</li>
            </ul>
            <Link href="/sleep-diary" className="text-sm text-blue-400 underline mt-2 inline-block">
              View full sleep diary →
            </Link>
          </div>
        )}

        {routine.length > 0 && (
          <div className="bg-zinc-800 p-6 rounded-xl shadow-md text-left mb-10 border border-zinc-700">
            <h2 className="text-xl font-bold mb-4 text-white">🧘 Your Saved Routine</h2>
            <ol className="list-decimal list-inside text-zinc-300 space-y-1">
              {routine.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            <a href="/routine-builder" className="text-sm text-blue-400 underline mt-2 inline-block">
              Edit your routine →
            </a>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">🏅 Your Badges</h2>
        {stats.badges.length === 0 ? (
          <p className="text-zinc-500 italic">No badges yet. Start focusing to earn some!</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {stats.badges.map((badge) => {
              if (badge === "first-session") return <Badge key={badge} emoji="🟢" label="First Focus" />;
              if (badge === "3-day-streak") return <Badge key={badge} emoji="🔥" label="3-Day Streak" />;
              if (badge === "10-session-club") return <Badge key={badge} emoji="🏅" label="10 Sessions" />;
              return null;
            })}
          </div>
        )}

{showAvatarModal && (
  <AvatarModal
    selectedAvatar={user?.avatarId || ''}
    onClose={() => setShowAvatarModal(false)}
    refetchUser={refetchUser} // ✅ pass this
  />
)}
      </motion.div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-zinc-800 p-4 rounded-lg">
      <p className="font-semibold text-zinc-300 mb-1">{label}</p>
      <p className="text-2xl text-white font-bold">{value}</p>
    </div>
  );
}
