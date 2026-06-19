'use client';

import { useState } from 'react';
import { PenSquare, Sparkles, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import OutputCard from '@/components/OutputCard';

const TONES = ['Conversational', 'Professional', 'Urgent'];

const initialForm = {
  productName: '',
  description: '',
  targetMarket: '',
  tone: 'Conversational',
};

export default function CopyGeneratorPage() {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState('idle'); // idle | loading | results | error
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleGenerate(e) {
    e.preventDefault();
    if (!form.productName.trim() || !form.description.trim()) return;

    setState('loading');
    setError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'copy', ...form }),
      });
      if (res.status === 401) { window.location.href = '/login'; return; }
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Generation failed');
      }

      setResults(json.data);
      setState('results');
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  }

  function handleReset() {
    setState('idle');
    setResults(null);
    setError('');
  }

  return (
    <div className="px-8 py-10 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-600/10 border border-violet-600/20">
          <PenSquare size={18} className="text-violet-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Copy Generator</h1>
          <p className="text-xs text-slate-500">Headlines · Descriptions · Bullets · Meta Ads · Abandoned Cart</p>
        </div>
      </div>

      {/* Form — shown in idle/error */}
      {(state === 'idle' || state === 'error') && (
        <form onSubmit={handleGenerate} className="space-y-5">
          {state === 'error' && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              name="productName"
              value={form.productName}
              onChange={handleChange}
              required
              placeholder="e.g. Posture Corrector Pro"
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-600/50 focus:ring-1 focus:ring-violet-600/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Product Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe your product: what it does, key features, materials, how it works, any results or proof points..."
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-600/50 focus:ring-1 focus:ring-violet-600/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Target Market <span className="text-slate-600">(optional)</span>
            </label>
            <input
              name="targetMarket"
              value={form.targetMarket}
              onChange={handleChange}
              placeholder="e.g. Office workers 25-45 with back pain"
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-600/50 focus:ring-1 focus:ring-violet-600/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Tone</label>
            <div className="flex gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, tone: t }))}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    form.tone === t
                      ? 'bg-violet-600/20 border border-violet-600/40 text-violet-300'
                      : 'bg-[#111118] border border-[#1e1e2e] text-slate-400 hover:text-slate-300 hover:border-[#2e2e3e]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!form.productName.trim() || !form.description.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Sparkles size={15} />
            Generate Copy
          </button>
        </form>
      )}

      {/* Loading */}
      {state === 'loading' && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-600/20">
            <Loader2 size={22} className="text-violet-400 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-medium">Generating your copy...</p>
            <p className="text-slate-500 text-xs mt-1">Claude is writing 8 assets for you</p>
          </div>
        </div>
      )}

      {/* Results */}
      {state === 'results' && results && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-slate-300">Generated copy for <span className="text-violet-400">{form.productName}</span></h2>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft size={12} />
              New generation
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <OutputCard
              title="Headline"
              content={results.headline}
            />

            <OutputCard
              title="Subheadline"
              content={results.subheadline}
            />

            <OutputCard
              title="Product Description"
              content={results.product_description}
            />

            <OutputCard
              title="Bullet Points"
              content={results.bullets}
            />

            <div className="grid grid-cols-2 gap-4">
              <OutputCard
                title="Meta Primary Text"
                content={results.meta_primary_text}
              />
              <OutputCard
                title="Meta Headline"
                content={results.meta_headline}
              />
            </div>

            <OutputCard
              title="Abandoned Cart — Email Subject"
              content={results.abandoned_cart_subject}
            />

            <OutputCard
              title="Abandoned Cart — Email Body"
              content={results.abandoned_cart_body}
            />
          </div>
        </div>
      )}
    </div>
  );
}
