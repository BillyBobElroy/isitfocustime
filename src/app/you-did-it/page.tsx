'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function YouDidIt() {
  const [quote, setQuote] = useState('');
  const [scoreMessage, setScoreMessage] = useState('');
  const { width, height } = useWindowSize();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const quotes = [
  "That was pure discipline. 👑",
  "You crushed it. No distractions, just domination.",
  "Look at you go. 🏆 Elon would be proud.",
  "You focused more than the average squirrel.",
  "All grind, no scroll. Respect.",
  "Just out-focused 99.7% of humanity.",
  "This is why you're built different.",
  "That session? Historic.",
  "Your brain just grew a new wrinkle.",
  "You're now eligible for a productivity tattoo.",
  "Legend status: UNLOCKED.",
  "The timer bowed down to your focus.",
  "Your dopamine resistance is unmatched.",
  "You focused so hard, your coffee got scared.",
  "One session closer to world domination.",
  "Everyone else: doomscrolling. You: winning.",
  "If focus was currency, you'd be rich.",
  "NASA called. They need your discipline.",
  "Your inner monologue just got quieter.",
  "The procrastination demons weep tonight.",
  "Productivity? Consider it demolished.",
  "You were so focused, it should be illegal.",
  "Your future self says thanks.",
  "That focus session was clinically hot.",
  "You stared at the void, and worked anyway.",
  "You vs. who you were yesterday? You won.",
  "You're now 0.3% closer to being a time wizard.",
  "That focus session just cured my ADHD by proxy.",
  "Time = respected. Mind = refined.",
  "Not all heroes wear capes. Some click 'Start'.",
  "Your chair deserves a round of applause.",
  "You just pulled off a mental heist. 💼",
  "You ignored every distraction. That’s elite.",
  "Did you just earn a black belt in concentration?",
  "The silence applauded you. Well done.",
  "That timer couldn’t handle your power.",
  "Somewhere, your to-do list just shivered.",
  "That was focus. The good kind.",
  "A productivity monk. That’s you now.",
  "This site’s proud of you. For real.",
  "Even your phone was like: whoa.",
  "You’re focused. You’re dangerous.",
  "I heard a bell ring. A new neural path unlocked.",
  "That session? 10/10 productivity wizards would recommend.",
  "Someone tell the algorithm you’re winning.",
  "That wasn’t just focus. That was ART.",
  "This is the way. 🧘‍♂️"
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const focusScores = [
  "You’re 2 levels closer to Monk Mode.",
  "Neuroplasticity = upgraded.",
  "Focus Multiplier: x1.7. Try again?",
  "You just speedran your to-do list.",
  "You're vibrating at a higher frequency now.",
  "Caffeine effectiveness +12%.",
  "A productivity aura now surrounds you.",
  "You earned 3.5 discipline points. Unspendable, but real.",
  "Time itself bent slightly in your favor.",
    ];
    setScoreMessage(focusScores[Math.floor(Math.random() * focusScores.length)]);

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white text-center px-4">
      {hasMounted && <Confetti width={width} height={height} />}
      <h1 className="text-5xl font-bold mb-6">🎉 You Did It!</h1>
      <p className="text-2xl mb-6">{quote}</p>

      <p className="text-lg mt-2 text-green-300 italic">
        You’re {Math.floor(Math.random() * 51 + 50)}% more focused than yesterday’s version of you.
      </p>

      <p className="text-lg mt-2 text-green-300 italic mb-4">{scoreMessage}</p>

      <Link href="/">
        <button className="px-6 py-3 bg-white text-green-900 text-lg font-semibold rounded-lg hover:bg-gray-100 transition">
          Start Another Session
        </button>
      </Link>

      <div className="my-8 flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '728px', height: '90px' }}
          data-ad-client="ca-pub-4813693653154178"
          data-ad-slot="8997853730"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </main>
  );
}
