'use client';

import { useState } from 'react';
import { Clapperboard, Sparkles, ArrowLeft, AlertCircle, Loader2, Copy, Check } from 'lucide-react';

const PLATFORMS = ['TikTok', 'Instagram Reels', 'Both'];
const DURATIONS = ['15 seconds', '30 seconds', '60 seconds'];

const initialForm = {
  productName: '',
  description: '',
  keyBenefit: '',
  platform: 'TikTok',
  duration: '30 seconds',
};

function ScriptCard({ script, index }) {
  const [copiedFull, setCopiedFull] = useState(false);

  async function handleCopyFull() {
    await navigator.clipboard.writeText(script.full_script);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  }

  const accentColors = ['violet', 'blue', 'emerald'];
  const color = accentColors[index % accentColors.length];

  const colorClasses = {
    violet: { border: 'border-violet-600/20', badge: 'bg-violet-600/15 text-violet-400', label: 'text-violet-400' },
    blue: { border: 'border-blue-600/20', badge: 'bg-blue-600/15 text-blue-400', label: 'text-blue-400' },
    emerald: { border: 'border-emerald-600/20', badge: 'bg-emerald-600/15 text-emerald-400', label: 'text-emerald-400' },
  };
  const c = colorClasses[color];

  return (
    <div className={`bg-[#111118] border ${c.border} rounded-xl p-5 space-y-4 animate-fade-in`}>
      {/* Script header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${c.badge}`}>Script {index + 1}</span>
          <span className="text-sm font-medium text-white">{script.angle}</span>
        </div>
        <button
          onClick={handleCopyFull}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded-md hover:bg-white/5"
        >
          {copiedFull ? (
            <><Check size={12} className="text-emerald-400" /><span className="text-emerald-400">Copied</span></>
          ) : (
            <><Copy size={12} /><span>Copy full script</span></>
          )}
        </button>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        <div>
          <div className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${c.label}`}>Hook (0–3 sec)</div>
          <p className="text-sm text-white font-medium bg-[#0d0d15] rounded-lg px-3 py-2 border border-[#1e1e2e]">
            "{script.hook}"
          </p>
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Full Script</div>
          <pre className="text-xs text-slate-300 bg-[#0d0d15] rounded-lg px-3 py-3 border border-[#1e1e2e] whitespace-pre-wrap font-sans leading-relaxed">
            {script.full_script}
          </pre>
        </div>

        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 shrink-0 mt-0.5">Why it works</span>
          <p className="text-xs text-slate-500">{script.why_it_works}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdScriptsPage() {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState('idle');
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
        body: JSON.stringify({ type: 'ad-scripts', ...form }),
      });
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
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-600/20">
          <Clapperboard size={18} className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Ad Script Creator</h1>
          <p className="text-xs text-slate-500">3 UGC scripts per product — Hook · Body · CTA · Camera notes</p>
        </div>
      </div>

      {/* Form */}
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
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-600/50 focus:ring-1 focus:ring-blue-600/30 transition-colors"
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
              rows={3}
              placeholder="What does it do? Who is it for? What problem does it solve?"
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-600/50 focus:ring-1 focus:ring-blue-600/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              #1 Key Benefit <span className="text-slate-600">(optional)</span>
            </label>
            <input
              name="keyBenefit"
              value={form.keyBenefit}
              onChange={handleChange}
              placeholder="e.g. Relieves back pain in 15 minutes"
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-600/50 focus:ring-1 focus:ring-blue-600/30 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Platform</label>
              <div className="space-y-1.5">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, platform: p }))}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      form.platform === p
                        ? 'bg-blue-600/20 border border-blue-600/40 text-blue-300'
                        : 'bg-[#111118] border border-[#1e1e2e] text-slate-400 hover:text-slate-300 hover:border-[#2e2e3e]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Duration</label>
              <div className="space-y-1.5">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, duration: d }))}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      form.duration === d
                        ? 'bg-blue-600/20 border border-blue-600/40 text-blue-300'
                        : 'bg-[#111118] border border-[#1e1e2e] text-slate-400 hover:text-slate-300 hover:border-[#2e2e3e]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!form.productName.trim() || !form.description.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Sparkles size={15} />
            Generate 3 Scripts
          </button>
        </form>
      )}

      {/* Loading */}
      {state === 'loading' && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-600/20">
            <Loader2 size={22} className="text-blue-400 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-medium">Writing your scripts...</p>
            <p className="text-slate-500 text-xs mt-1">Claude is crafting 3 different angles</p>
          </div>
        </div>
      )}

      {/* Results */}
      {state === 'results' && results && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-300">
              3 scripts for <span className="text-blue-400">{form.productName}</span>
              <span className="text-slate-600"> · {form.platform} · {form.duration}</span>
            </h2>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft size={12} />
              New product
            </button>
          </div>

          {results.scripts?.map((script, i) => (
            <ScriptCard key={i} script={script} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
