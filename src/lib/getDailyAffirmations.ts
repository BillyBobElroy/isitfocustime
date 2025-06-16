export function getDailyAffirmation(timeOfDay: 'morning' | 'afternoon' | 'night', mood?: string): string {
  const affirmations: Record<string, Record<string, string[]>> = {
    morning: {
      happy: [
        "Today is a fresh canvas — keep that joy flowing.",
        "Your smile is your superpower. Let it guide you.",
      ],
      calm: [
        "Ease into the day with grace. You’ve got this.",
        "Stillness this morning is strength for the day ahead.",
      ],
      anxious: [
        "You don’t have to do it all at once — just begin.",
        "Breathe. You're safe and capable of handling today.",
      ],
      tired: [
        "Even slow mornings hold promise. Go gently.",
        "Energy builds with each small win. Start with one.",
      ],
      default: [
        "A new day, a new beginning. You are enough.",
        "Progress, not perfection. One breath, one step.",
      ],
    },
    afternoon: {
      happy: [
        "Keep riding the momentum. You’re doing great!",
        "Joy thrives in presence. Stay with it.",
      ],
      calm: [
        "Midday reset: your peace is your power.",
        "You’re moving with intention, and it shows.",
      ],
      anxious: [
        "Take one mindful pause. You’re not behind.",
        "Even now, you can return to center.",
      ],
      tired: [
        "You’ve made it halfway. A pause is productive too.",
        "Small breaks lead to big clarity.",
      ],
      default: [
        "You’re right where you need to be.",
        "Each moment is a chance to begin again.",
      ],
    },
    night: {
      happy: [
        "Celebrate the wins — big or small. You showed up.",
        "End your day with the same light you started with.",
      ],
      calm: [
        "Let stillness wrap around you. You’ve earned rest.",
        "Peace is your reward tonight.",
      ],
      anxious: [
        "The day is done. You’re allowed to let go.",
        "Your mind can rest. Everything doesn’t need solving tonight.",
      ],
      tired: [
        "You’ve carried enough. Let rest restore you.",
        "Sleep is your superpower. Embrace it.",
      ],
      default: [
        "You did your best. That’s more than enough.",
        "Release the day. Tomorrow is another chance.",
      ],
    },
  };

  const category = affirmations[timeOfDay];
  const moodKey = mood && category[mood] ? mood : 'default';
  const options = category[moodKey];

  return options[Math.floor(Math.random() * options.length)];
}