export function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  const firstName = name ? `, ${name}` : '';

  if (hour < 5) return `You're up early${firstName}. 🌅 Let's ease into the day.`;
  if (hour < 12) return `Good morning${firstName}! ☀️ Ready to start fresh?`;
  if (hour < 17) return `Good afternoon${firstName}. 🌿 Take a mindful break.`;
  if (hour < 21) return `Good evening${firstName}. 🌙 Let’s wind down together.`;
  return `Late night focus${firstName}? 🌌 Let’s keep it light and calm.`;
}
