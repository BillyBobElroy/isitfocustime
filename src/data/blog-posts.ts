// data/blog-posts.ts
import { BlogPost } from '@/types/blog';

export const blogPosts: BlogPost[] = [
  {
    title: "5-Minute Focus Sessions: Why They Work",
    slug: "5-minute-focus-sessions",
    date: "2025-04-27",
    summary: "Learn why short focus sprints can beat long work marathons.",
    category: "Focus",
    seo: {
      title: "5-Minute Focus Sessions for Productivity",
      description: "Discover why tiny bursts of focused work beat long tiring marathons. Get started with just 5 minutes!",
    },
    content: `
### Why 5-Minute Focus Sessions Work

Many people think productivity means working non-stop for hours. But studies show that **short bursts of focus** can be more effective for:
- Beating procrastination
- Reducing mental fatigue
- Building positive momentum

Try a 5-minute session today using isitfocus.time!
    `.trim(),
  },
  {
    title: "Top 3 Mood Tracking Methods for Beginners",
    slug: "mood-tracking-methods",
    date: "2025-04-27",
    summary: "Want to track your mood? Here are the easiest ways to start.",
    category: "Mood",
    seo: {
      title: "Best Mood Tracking Methods for Beginners",
      description: "Learn simple and effective ways to start tracking your mood daily for better emotional awareness.",
    },
    content: `
### How to Start Mood Tracking

Tracking your mood daily can:
- Improve emotional awareness
- Help spot life patterns
- Make therapy/counseling more effective

Try our [Mood Tracker](/mood-tracker) to log today's feelings!
    `.trim(),
  },
];
