// components/Badge.tsx
export function Badge({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="flex flex-col items-center p-2 bg-zinc-800 rounded-xl border border-zinc-700 shadow-sm w-24">
      <span className="text-2xl">{emoji}</span>
      <span className="text-xs text-zinc-300 mt-1 text-center">{label}</span>
    </div>
  );
}
