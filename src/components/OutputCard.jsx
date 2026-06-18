'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function OutputCard({ title, content, mono = false }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(
      Array.isArray(content) ? content.join('\n') : content
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded-md hover:bg-white/5"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {Array.isArray(content) ? (
        <ul className="space-y-2">
          {content.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-300">
              <span className="text-violet-500 mt-0.5 shrink-0">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={`text-sm text-slate-200 leading-relaxed whitespace-pre-wrap ${mono ? 'font-mono text-xs' : ''}`}>
          {content}
        </p>
      )}
    </div>
  );
}
