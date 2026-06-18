'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Zap, Loader2 } from 'lucide-react';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '€19',
    period: '/month',
    description: 'For dropshippers testing new products',
    features: [
      '100 AI generations / month',
      'Copy Generator',
      'Ad Script Creator',
      'Product Analyzer',
      'Competitor Spy',
      'Email support',
    ],
    cta: 'Start with Starter',
    highlight: false,
    color: 'border-[#1e1e2e] hover:border-slate-600',
    btnColor: 'bg-slate-700 hover:bg-slate-600 text-white',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€49',
    period: '/month',
    description: 'For dropshippers actively scaling',
    features: [
      'Unlimited AI generations',
      'Everything in Starter',
      'Faster response priority',
      'Early access to new tools',
      'Priority support',
    ],
    cta: 'Go Pro',
    highlight: true,
    color: 'border-violet-600/50 ring-1 ring-violet-600/20',
    btnColor: 'bg-violet-600 hover:bg-violet-500 text-white',
  },
  {
    id: 'agency',
    name: 'Agency',
    price: '€149',
    period: '/month',
    description: 'For agencies managing multiple brands',
    features: [
      'Unlimited AI generations',
      'Everything in Pro',
      'Multiple workspaces',
      'White-label exports',
      'API access',
      'Dedicated support',
    ],
    cta: 'Go Agency',
    highlight: false,
    color: 'border-[#1e1e2e] hover:border-slate-600',
    btnColor: 'bg-slate-700 hover:bg-slate-600 text-white',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');

  async function handleUpgrade(planId) {
    setLoading(planId);
    setError('');

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      window.location.href = json.url;
    } catch (err) {
      setError(err.message || 'Failed to start checkout. Try again.');
      setLoading(null);
    }
  }

  return (
    <div className="px-8 py-10 max-w-5xl">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/15 border border-violet-600/25 text-violet-400 text-xs font-medium mb-4">
          <Zap size={11} className="fill-violet-400" />
          Simple pricing
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2">
          Replace €119/mês of tools with one
        </h1>
        <p className="text-slate-400 text-sm">
          Minea + Jasper + AdCreative combined. Starting at €19/mês.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-[#111118] border rounded-2xl p-6 flex flex-col transition-all ${plan.color}`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full bg-violet-600 text-white text-[10px] font-semibold tracking-wide">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="mb-5">
              <div className="text-sm font-medium text-slate-400 mb-1">{plan.name}</div>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-500 text-sm mb-1">{plan.period}</span>
              </div>
              <p className="text-xs text-slate-500">{plan.description}</p>
            </div>

            <ul className="space-y-2.5 flex-1 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check size={13} className="text-violet-400 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={!!loading}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-60 ${plan.btnColor}`}
            >
              {loading === plan.id ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                plan.cta
              )}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ note */}
      <p className="text-center text-xs text-slate-600 mt-8">
        All plans billed monthly · Cancel anytime · Powered by Stripe
      </p>
    </div>
  );
}
