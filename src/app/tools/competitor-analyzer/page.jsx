'use client';

import { useState } from 'react';
import { ShieldEllipsis, Sparkles, ArrowLeft, AlertCircle, Loader2, Copy, Check } from 'lucide-react';

const initialForm = { myProduct: '', competitorContent: '' };

function Section({ title, children }) {
  return (
    <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{title}</span>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded-md hover:bg-white/5 ml-auto shrink-0"
    >
      {copied ? <><Check size={12} className="text-emerald-400" /><span className="text-emerald-400">Copied</span></> : <><Copy size={12} /><span>Copy</span></>}
    </button>
  );
}

export default function CompetitorAnalyzerPage() {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState('idle');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleGenerate(e) {
    e.preventDefault();
    if (!form.myProduct.trim() || !form.competitorContent.trim()) return;
    setState('loading');
    setError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'competitor-analyzer', ...form }),
      });
      if (res.status === 401) { window.location.href = '/login'; return; }
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

  return (
    <div className="px-8 py-10 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-rose-600/10 border border-rose-600/20">
          <ShieldEllipsis size={18} className="text-rose-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Competitor Analyzer</h1>
          <p className="text-xs text-slate-500">Weak points · Market gaps · Differentiation angles · Positioning</p>
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

          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15 text-amber-400/80 text-xs leading-relaxed">
            Paste competitor content below — product descriptions, About page, ad copy, homepage text. The more context you give, the sharper the analysis.
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Your Product / Niche <span className="text-rose-500">*</span>
            </label>
            <input
              name="myProduct"
              value={form.myProduct}
              onChange={handleChange}
              required
              placeholder="e.g. I sell posture correctors targeting office workers"
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-600/50 focus:ring-1 focus:ring-rose-600/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Competitor Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="competitorContent"
              value={form.competitorContent}
              onChange={handleChange}
              required
              rows={8}
              placeholder="Paste competitor product descriptions, marketing copy, about page text, ad copy, headlines, pricing, etc..."
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-600/50 focus:ring-1 focus:ring-rose-600/30 transition-colors font-mono text-xs"
            />
            <div className="text-xs text-slate-600 mt-1">
              {form.competitorContent.length} chars — more content = better analysis
            </div>
          </div>

          <button
            type="submit"
            disabled={!form.myProduct.trim() || !form.competitorContent.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Sparkles size={15} />
            Analyze Competitor
          </button>
        </form>
      )}

      {/* Loading */}
      {state === 'loading' && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-600/10 border border-rose-600/20">
            <Loader2 size={22} className="text-rose-400 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-medium">Dissecting the competition...</p>
            <p className="text-slate-500 text-xs mt-1">Finding their weak points and your openings</p>
          </div>
        </div>
      )}

      {/* Results */}
      {state === 'results' && results && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-slate-300">Competitive analysis complete</h2>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft size={12} />
              New analysis
            </button>
          </div>

          {/* Competitor overview */}
          <Section title="Competitor Overview">
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-600 uppercase tracking-wider">Positioning</span>
                <p className="text-sm text-slate-200 mt-0.5">{results.competitor_positioning}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-600 uppercase tracking-wider">Core Message</span>
                <p className="text-sm text-slate-200 mt-0.5">{results.core_message}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-600 uppercase tracking-wider">Their Target Customer</span>
                <p className="text-sm text-slate-200 mt-0.5">{results.target_customer}</p>
              </div>
            </div>
          </Section>

          {/* Weak points */}
          <div className="bg-[#111118] border border-rose-500/20 rounded-xl p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400">Their Weak Points</span>
            <ul className="mt-3 space-y-2.5">
              {results.weak_points?.map((point, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-slate-300">
                  <span className="text-rose-500 shrink-0 mt-0.5 font-bold">✕</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Market gaps */}
          <div className="bg-[#111118] border border-emerald-500/20 rounded-xl p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Market Gaps (Your Opportunity)</span>
            <ul className="mt-3 space-y-2.5">
              {results.market_gaps?.map((gap, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-slate-300">
                  <span className="text-emerald-500 shrink-0 mt-0.5">✦</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Differentiation angles */}
          {results.differentiation_angles?.length > 0 && (
            <Section title="Differentiation Angles">
              <div className="space-y-3">
                {results.differentiation_angles.map((item, i) => (
                  <div key={i} className="border border-[#1e1e2e] rounded-lg p-3">
                    <div className="text-sm font-medium text-white mb-1">{item.angle}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.execution}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Your positioning — violet accent, premium feel */}
          <div className="bg-[#111118] border border-violet-600/25 rounded-xl p-5 space-y-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">Your Positioning</span>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider">Recommended Headline</span>
                <CopyButton text={results.recommended_headline} />
              </div>
              <p className="text-white font-semibold text-base leading-snug">"{results.recommended_headline}"</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider">Positioning Statement</span>
                <CopyButton text={results.positioning_statement} />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">"{results.positioning_statement}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
