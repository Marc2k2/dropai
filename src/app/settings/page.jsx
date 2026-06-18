'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, CreditCard, LogOut, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const PLAN_LABELS = {
  free: { label: 'Free', color: 'text-slate-400', bg: 'bg-slate-700/40 border-slate-700/50' },
  starter: { label: 'Starter', color: 'text-blue-400', bg: 'bg-blue-600/10 border-blue-600/20' },
  pro: { label: 'Pro', color: 'text-violet-400', bg: 'bg-violet-600/10 border-violet-600/20' },
  agency: { label: 'Agency', color: 'text-amber-400', bg: 'bg-amber-600/10 border-amber-600/20' },
};

const PLAN_LIMITS = { free: 10, starter: 100, pro: Infinity, agency: Infinity };

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [usage, setUsage] = useState(0);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState('');

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUser(user);

      supabase.from('profiles').select('plan, stripe_customer_id').eq('id', user.id).single()
        .then(({ data }) => setProfile(data));

      const period = new Date().toISOString().slice(0, 7);
      supabase.from('usage').select('count').eq('user_id', user.id).eq('period', period).maybeSingle()
        .then(({ data }) => setUsage(data?.count ?? 0));
    });
  }, []);

  async function handleManageBilling() {
    setPortalLoading(true);
    setPortalError('');
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      window.location.href = json.url;
    } catch (err) {
      setPortalError(err.message);
      setPortalLoading(false);
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const plan = profile?.plan ?? 'free';
  const planMeta = PLAN_LABELS[plan] ?? PLAN_LABELS.free;
  const limit = PLAN_LIMITS[plan];
  const usagePct = limit === Infinity ? 0 : Math.min((usage / limit) * 100, 100);

  return (
    <div className="px-8 py-10 max-w-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-700/40 border border-slate-700/50">
          <Settings size={18} className="text-slate-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Account Settings</h1>
          <p className="text-xs text-slate-500">Manage your plan and account</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Account info */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Account</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white">{user?.email ?? '—'}</div>
              <div className="text-xs text-slate-500 mt-0.5">Email address</div>
            </div>
            <CheckCircle size={16} className="text-emerald-400" />
          </div>
        </div>

        {/* Plan + usage */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Plan & Usage</div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white mb-1">Current plan</div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${planMeta.bg} ${planMeta.color}`}>
                {planMeta.label}
              </span>
            </div>
            {plan === 'free' ? (
              <Link
                href="/pricing"
                className="flex items-center gap-1.5 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
              >
                Upgrade <ArrowRight size={12} />
              </Link>
            ) : (
              <button
                onClick={handleManageBilling}
                disabled={portalLoading}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-300 transition-colors"
              >
                {portalLoading ? <Loader2 size={12} className="animate-spin" /> : <CreditCard size={12} />}
                Manage billing
              </button>
            )}
          </div>

          {portalError && (
            <p className="text-xs text-rose-400">{portalError}</p>
          )}

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500">Generations this month</span>
              <span className="text-slate-400">
                {usage}{limit !== Infinity ? ` / ${limit}` : ' / ∞'}
              </span>
            </div>
            {limit !== Infinity && (
              <div className="w-full bg-[#1e1e2e] rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${usagePct > 80 ? 'bg-rose-500' : 'bg-violet-600'}`}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Billing */}
        {plan !== 'free' && (
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Billing</div>
            <button
              onClick={handleManageBilling}
              disabled={portalLoading}
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <CreditCard size={15} className="text-slate-500" />
              Open billing portal
              {portalLoading && <Loader2 size={13} className="animate-spin ml-1" />}
            </button>
            <p className="text-xs text-slate-600 mt-2">Cancel, change plan, or update payment method</p>
          </div>
        )}

        {/* Danger zone */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Session</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-rose-400 transition-colors"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
