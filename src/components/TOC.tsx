'use client';

import { useEffect, useState } from 'react';
import { useActiveHeading } from '@/hooks/useActiveHeading';

export function TOC() {
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const activeId = useActiveHeading();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('h2, h3'));
    const mapped = elements.map((el) => ({
      id: el.id,
      text: el.textContent || '',
    }));
    setHeadings(mapped);
  }, []);

  if (headings.length === 0) return null;

  return (
<aside className="hidden xl:block w-64 pt-2 border-b border-zinc-800 pb-6">
  <div className="font-bold mb-4 text-green-400">On this page:</div>
  <ul className="space-y-2">
    {headings.map((h) => (
      <li key={h.id}>
        <a
          href={`#${h.id}`}
          className={`block ${
            activeId === h.id ? 'text-green-400 font-bold' : 'text-zinc-400'
          } hover:text-green-400 transition`}
        >
          {h.text}
        </a>
      </li>
    ))}
  </ul>
</aside>
  );
}