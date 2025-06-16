"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const intents = [
  "Productivity",
  "Calm",
  "Mental Clarity",
  "Better Sleep",
  "Mood Boost",
];

const tools = [
  "Focus Timer",
  "Breathe Timer",
  "Meditation Player",
  "Mood Tracker",
  "Gratitude Journal",
  "Habit Tracker",
  "5-Minute Journal",
  "Routine Builder",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useFirebaseUser();
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [dailyTime, setDailyTime] = useState('');

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const handleFinish = async () => {
    if (!user?.uid) return;
    await setDoc(
      doc(db, "users", user.uid),
      {
        onboardingComplete: true,
        onboardingData: {
          intent,
          selectedTools,
          dailyTime,
        },
      },
      { merge: true }
    );
    router.push("/dashboard");
  };

  const Progress = () => (
    <div className="flex justify-center gap-2 mb-6">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`w-4 h-4 rounded-full transition ${
            step >= s ? 'bg-green-400' : 'bg-zinc-700'
          }`}
        />
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-8 flex flex-col items-center">
      <div className="max-w-xl w-full">
        <Progress />
        {step === 1 && (
          <div className="bg-zinc-800 p-6 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold mb-4 text-center">Welcome to isitfocustime</h1>
            <p className="mb-6 text-zinc-400 text-center">Let’s personalize your experience. What’s your main focus right now?</p>
            <div className="grid gap-3">
              {intents.map((item) => (
                <button
                  key={item}
                  onClick={() => setIntent(item)}
                  className={`p-3 rounded-lg border ${
                    intent === item ? 'bg-green-600 border-green-400' : 'bg-zinc-800 border-zinc-600'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!intent}
              className="mt-6 w-full bg-green-500 py-3 rounded-lg disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-zinc-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Select your tools</h2>
            <div className="grid gap-2">
              {tools.map((tool) => (
                <button
                  key={tool}
                  onClick={() => toggleTool(tool)}
                  className={`p-2 rounded-lg border ${
                    selectedTools.includes(tool) ? 'bg-green-600 border-green-400' : 'bg-zinc-800 border-zinc-600'
                  }`}
                >
                  {tool}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(3)}
              className="mt-6 w-full bg-green-500 py-3 rounded-lg"
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-zinc-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Choose a daily check-in time (optional)</h2>
            <input
              type="time"
              value={dailyTime}
              onChange={(e) => setDailyTime(e.target.value)}
              className="w-full p-3 bg-zinc-700 rounded-lg text-white mb-6"
            />
            <button
              onClick={handleFinish}
              className="w-full bg-green-500 py-3 rounded-lg"
            >
              Finish Onboarding
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
