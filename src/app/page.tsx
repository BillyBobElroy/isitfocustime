'use client'; 

import Link from 'next/link';
import { Nunito } from 'next/font/google';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LucideTimer, LucideWind, LucideHeadphones, LucideHeart, LucideSmile, LucideNotebookPen, LucideChevronDown, LucideBrain, LucideBed, LucideClipboardList } from 'lucide-react';

const nunito = Nunito({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-700 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex justify-between items-center text-white font-semibold text-base mb-2 hover:underline"
      >
        {question}
        <LucideChevronDown className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="text-zinc-300 text-sm leading-relaxed">{answer}</p>}
    </div>
  );
};

const toolCategories = {
  Focus: [
    {
      name: 'Focus Timer',
      description: 'A minimalist timer to help you enter deep work mode. Choose a duration and start focusing.',
      link: '/focus-timer',
      icon: <LucideTimer className="w-6 h-6 text-green-400 mr-2" />,
    },
    {
      name: 'Breathe Timer',
      description: 'Take a guided breath break to calm your nervous system and refocus.',
      link: '/breathe-timer',
      icon: <LucideWind className="w-6 h-6 text-blue-400 mr-2" />,
    },
    {
      name: 'Habit Tracker',
      description: 'Track and build positive habits to support your daily routine.',
      link: '/habit-tracker',
      icon: <LucideClipboardList className="w-6 h-6 text-yellow-400 mr-2" />,
    },
    {
      name: 'Routine Builder',
      description: 'Create and save custom routines using your favorite focus tools.',
      link: '/routine-builder',
      icon: <LucideNotebookPen className="w-6 h-6 text-purple-400 mr-2" />,
    },
  ],
  'Mental Wellness': [
    {
      name: 'Meditation Player',
      description: 'Play short ambient meditations or guided sessions to relax your mind.',
      link: '/meditation-player',
      icon: <LucideHeadphones className="w-6 h-6 text-purple-400 mr-2" />,
    },
    {
      name: 'Mood Tracker',
      description: 'Track your mood over time and see patterns that help guide your routine.',
      link: '/mood-tracker',
      icon: <LucideSmile className="w-6 h-6 text-pink-400 mr-2" />,
    },
    {
      name: 'Gratitude Journal',
      description: 'Reflect on daily moments of gratitude to improve your emotional clarity.',
      link: '/gratitude-journal',
      icon: <LucideHeart className="w-6 h-6 text-red-400 mr-2" />,
    },
    {
      name: '5-Minute Journal',
      description: 'Answer simple prompts morning and night to increase self-awareness and intention.',
      link: '/5-minute-journal',
      icon: <LucideNotebookPen className="w-6 h-6 text-teal-400 mr-2" />,
    },
    {
      name: 'Mini CBT Journal',
      description: 'Challenge distorted thoughts and build resilience through cognitive journaling prompts.',
      link: '/mini-cbt-journal',
      icon: <LucideBrain className="w-6 h-6 text-indigo-400 mr-2" />,
    },
  ],
  Sleep: [
    {
      name: 'Sleep Diary',
      description: 'Log your bedtime, wake time, and restfulness to identify sleep trends.',
      link: '/sleep-diary',
      icon: <LucideBed className="w-6 h-6 text-sky-400 mr-2" />,
    },
  ],
};

export default function HomePage() {
  const [userRoutine, setUserRoutine] = useState<string[]>([]);
  const categories = Object.keys(toolCategories);
  const [selectedTab, setSelectedTab] = useState<keyof typeof toolCategories>(categories[0] as keyof typeof toolCategories);

  useEffect(() => {
    const stored = localStorage.getItem('focus-routine');
    if (stored) setUserRoutine(JSON.parse(stored));
  }, []);

  const toolDescriptions = {
    'Focus Timer': 'Set a distraction-free session and get in the zone.',
    'Breathe Timer': 'Take a 30-second guided breath break to reset.',
    'Meditation Player': 'Enjoy a calming, guided meditation session.',
    'Gratitude Journal': 'Reflect on what you’re grateful for each day.',
    'Mood Tracker': 'Track your mood and gain insights over time.',
    '5-Minute Journal': 'Start and end your day with mindful prompts.'
  };

  const toolIcons: Record<string, React.ReactElement> = {
    'Focus Timer': <LucideTimer className="w-5 h-5 mr-2" />,
    'Breathe Timer': <LucideWind className="w-5 h-5 mr-2" />,
    'Meditation Player': <LucideHeadphones className="w-5 h-5 mr-2" />,
    'Gratitude Journal': <LucideHeart className="w-5 h-5 mr-2" />,
    'Mood Tracker': <LucideSmile className="w-5 h-5 mr-2" />,
    '5-Minute Journal': <LucideNotebookPen className="w-5 h-5 mr-2" />,
  };

  const faqSections = [
    {
      title: 'General',
      items: [
        {
          question: 'What is isitfocustime.com?',
          answer: 'It is a minimalist wellness site offering simple tools to support your focus, calm, and clarity. It includes timers, journals, trackers, and guided sessions — all free and private.'
        },
        {
          question: 'Do I need to create an account?',
          answer: 'No account is needed. Your data is stored locally in your browser. No logins, tracking, or ads interrupt your experience.'
        },
        {
          question: 'Is this site really free?',
          answer: 'Yes! We fund the site through light AdSense support and future optional donations. There’s no paywall or subscription.'
        }
      ]
    },
    {
      title: 'Focus',
      items: [
        {
          question: 'How do the focus tools work?',
          answer: 'Use the Focus Timer for deep work sessions. The Routine Builder helps you organize your ideal flow. Combine with breathing or journaling for best results.'
        },
        {
          question: 'What is the difference between the Focus Timer and Pomodoro Mode?',
          answer: 'Focus Timer lets you set any duration. Pomodoro Mode adds structured breaks every 25/5/30 minutes — ideal for productivity cycles.'
        },
        {
          question: 'Can I save and reuse my routines?',
          answer: 'Yes. Your custom routines are saved to your browser and can be launched again each day with one click.'
        }
      ]
    },
    {
      title: 'Mental Wellness',
      items: [
        {
          question: 'What wellness tools are available?',
          answer: 'We offer a breathing timer, gratitude journal, 5-minute journaling, mood tracker, and meditation player — all with calming designs and thoughtful prompts.'
        },
        {
          question: 'How should I use this site daily?',
          answer: 'We suggest starting with a 5-minute morning journal, a quick breathing session before tasks, and closing your day with gratitude or a short reflection.'
        },
        {
          question: 'Is this suitable for people with anxiety or burnout?',
          answer: 'Yes. These tools were designed with accessibility and simplicity in mind. They can help reduce overwhelm, promote calm, and build micro-habits for emotional clarity.'
        }
      ]
    }
  ];

  return (
    <motion.main
      className={`font-nunito w-full overflow-x-hidden min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4 flex flex-col items-center justify-center`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <motion.section
        className="w-full mb-10 text-center pt-16 pb-16 px-6 sm:px-12 md:px-20 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl shadow-xl"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1 className="text-5xl sm:text-6xl font-black mb-3">
          Welcome to Your Focus Space
        </motion.h1>
        <motion.p className="text-xl max-w-2xl mx-auto mb-3 text-zinc-100">
          Everything your mind needs — focus, calm, and clarity in one peaceful space.
        </motion.p>
        <motion.p className="text-lg max-w-2xl mx-auto text-zinc-300 mb-4">
          Breathe in calm. Breathe out distraction. Your daily focus rituals begin here — quiet, intentional, and just for you.
        </motion.p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/routine-builder"
            className="inline-block bg-white text-zinc-900 font-semibold text-lg px-6 py-3 rounded-full shadow hover:bg-zinc-100 transition"
          >
            Build Your Focus Routine
          </Link>
        </motion.div>
      </motion.section>

      <section className="max-w-5xl mx-auto mb-20">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">🛠️ Mindfulness Tools</h2>

        <div className="flex justify-center gap-4 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedTab(cat as keyof typeof toolCategories)}
              className={`px-4 py-2 rounded-full border transition text-sm font-medium ${
                selectedTab === cat
                  ? 'bg-green-500 text-white border-green-500'
                  : 'border-zinc-600 text-zinc-300 hover:border-green-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {toolCategories[selectedTab].map((tool) => (
            <div key={tool.name} className="bg-zinc-800 border border-zinc-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                {tool.icon}
                <h3 className="text-lg font-bold">{tool.name}</h3>
              </div>
              <p className="text-zinc-300 text-sm mb-2">{tool.description}</p>
              <Link href={tool.link} className="text-green-400 text-sm hover:underline">
                Open {tool.name} →
              </Link>
            </div>
          ))}
        </div>
      </section>
      
      {/* FAQ Section */}
      <div className="max-w-3xl w-full mb-24">
        <h2 className="text-2xl font-bold mb-6 text-white">🙋‍♀️ Frequently Asked Questions</h2>
        <div className="space-y-12 text-left text-zinc-300">
          {faqSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
              <div className="space-y-5">
                {section.items.map((faq, i) => (
                  <FAQItem key={i} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.main>
  );
}
