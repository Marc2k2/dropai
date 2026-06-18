'use client';

import { useState } from 'react';
import { ScanSearch, Sparkles, ArrowLeft, AlertCircle, Loader2, TrendingUp, AlertTriangle, XCircle, Zap } from 'lucide-react';
import OutputCard from '@/components/OutputCard';

const CATEGORIES = ['General', 'Health & Wellness', 'Beauty', 'Home & Kitchen', 'Fitness', 'Tech & Gadgets', 'Pet Products', 'Fashion', 'Baby & Kids', 'Outdoor'];

const initialForm = { productName: '', description: '', category: 'General', pricePoint: '' };

const verdictConfig = {
  go: {
    label: 'GO FOR IT',
    icon: TrendingUp,
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300',
  },
  maybe: {
    label: 'PROCEED WITH CAUTION',
    icon: AlertTriangle,
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300',
  },
  avoid: {
    label: 'AVOID',
    icon: XCircle,
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    badge: 'bg-rose-500/20 text-rose-300',
  },
};

function SaturationBar({ score }) {
  const pct = (score / 10) * 100;
  const color = score <= 4 ? 'bg-emerald-500' : score <= 6 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-slate-500">Saturation</span>
        <span className={`font-semibold ${score <= 4 ? 'text-emerald-400' : score <= 6 ? 'text-amber-400' : 'text-rose-400'}`}>
          {score}/10
        </span>
      </div>
      <div className="w-full bg-[#1e1e2e] rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-slate-600 mt-1">
        <span>Low competition</span>
        <span>Saturated</span>
      </div>
    </div>
  );
}

export default function ProductAnalyzerPage() {
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
        body: JSON.stringify({ type: 'product-analyzer', ...form }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Analysis failed');
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

  const verdict = results ? verdictConfig[results.verdict] ?? verdictConfig.maybe : null;

  return (
    <div className="px-8 py-10 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-600/10 border border-emerald-600/20">
          <ScanSearch size={18} className="text-emerald-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Product Analyzer</h1>
          <p className="text-xs text-slate-500">Verdict · Virgin angle · Target person · TikTok hook · Risk</p>
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
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-600/50 focus:ring-1 focus:ring-emerald-600/30 transition-colors"
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
              placeholder="Describe the product: what it does, how it works, key features, who it's for, any unique mechanism..."
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-600/50 focus:ring-1 focus:ring-emerald-600/30 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-600/50 focus:ring-1 focus:ring-emerald-600/30 transition-colors"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Selling Price <span className="text-slate-600">(optional)</span>
              </label>
              <input
                name="pricePoint"
                value={form.pricePoint}
                onChange={handleChange}
                placeholder="e.g. $29.99"
                className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-600/50 focus:ring-1 focus:ring-emerald-600/30 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!form.productName.trim() || !form.description.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Sparkles size={15} />
            Analyze Product
          </button>
        </form>
      )}

      {/* Loading */}
      {state === 'loading' && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-600/20">
            <Loader2 size={22} className="text-emerald-400 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-medium">Analyzing the market...</p>
            <p className="text-slate-500 text-xs mt-1">Claude is building your strategic brief</p>
          </div>
        </div>
      )}

      {/* Results */}
      {state === 'results' && results && verdict && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-slate-300">
              Analysis for <span className="text-emerald-400">{form.productName}</span>
            </h2>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft size={12} />
              New analysis
            </button>
          </div>

          {/* Verdict card */}
          <div className={`p-5 rounded-xl border ${verdict.bg} ${verdict.border}`}>
            <div className="flex items-center gap-3 mb-2">
              <verdict.icon size={20} className={verdict.text} />
              <span className={`text-base font-bold tracking-wide ${verdict.text}`}>{verdict.label}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{results.verdict_reason}</p>
          </div>

          {/* Virgin angle + Central pain */}
          <div className="grid grid-cols-2 gap-4">
            <OutputCard title="Virgin Angle" content={results.virgin_angle} />
            <OutputCard title="Central Pain" content={results.central_pain} />
          </div>

          {/* Target person */}
          <OutputCard title="Target Person" content={results.target_person} />

          {/* TikTok hook — highlighted */}
          <div className="bg-[#111118] border border-violet-600/25 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={13} className="text-violet-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">TikTok Hook (0–3 sec)</span>
            </div>
            <p className="text-white font-medium text-sm leading-relaxed">"{results.tiktok_hook}"</p>
          </div>

          {/* Saturation + Risk + Markets */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4">
              <SaturationBar score={results.saturation_score} />
              {results.saturation_note && (
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{results.saturation_note}</p>
              )}
            </div>
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4 space-y-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Main Risk</span>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">{results.main_risk}</p>
              </div>
              {results.recommended_markets?.length > 0 && (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Best Markets</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {results.recommended_markets.map((m) => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded bg-slate-700/50 text-slate-300 border border-slate-700/50">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick wins */}
          {results.quick_wins?.length > 0 && (
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Quick Wins</span>
              <ul className="mt-3 space-y-2">
                {results.quick_wins.map((win, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-slate-300">
                    <span className="text-emerald-500 shrink-0 mt-0.5">✦</span>
                    <span>{win}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
