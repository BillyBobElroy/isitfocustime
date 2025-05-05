'use client';

import { useState } from 'react';

export function EmbedBlock() {
  const [copied, setCopied] = useState(false);
  const embedCode = `<iframe src="https://isitfocustime.com/embed" width="100%" height="140" style="border:none;"></iframe>`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mt-8 w-full max-w-xl mx-auto bg-zinc-800 border border-zinc-700 rounded-lg p-4">
      <p className="text-sm text-zinc-300 mb-2">Embed this in Notion, your blog, or anywhere:</p>
      <pre className="bg-zinc-900 text-white text-xs p-3 rounded mb-2 overflow-x-auto">
        {embedCode}
      </pre>
      <button
        onClick={copyToClipboard}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
      >
        {copied ? 'Copied!' : 'Copy to Clipboard'}
      </button>
    </div>
  );
}
