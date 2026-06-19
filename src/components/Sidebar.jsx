'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, PenSquare, Clapperboard, ScanSearch, ShieldEllipsis, Zap, LogOut, Settings, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Copy Generator', href: '/tools/copy-generator', icon: PenSquare },
  { label: 'Ad Scripts', href: '/tools/ad-scripts', icon: Clapperboard },
  { label: 'Product Analyzer', href: '/tools/product-analyzer', icon: ScanSearch },
  { label: 'Competitor Spy', href: '/tools/competitor-analyzer', icon: ShieldEllipsis },
];

const PLAN_LIMITS = { free: 10, starter: 100, pro: Infinity, agency: Infinity };

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState('free');
  const [usage, setUsage] = useState(0);

  useEffect(() => {
    let supabase;
    try { supabase = createClient(); } catch { return; }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUser(user);

      const period = new Date().toISOString().slice(0, 7);
      supabase.from('usage').select('count').eq('user_id', user.id).eq('period', period).maybeSingle()
        .then(({ data }) => { if (data) setUsage(data.count); });

      supabase.from('profiles').select('plan').eq('id', user.id).single()
        .then(({ data }) => { if (data?.plan) setPlan(data.plan); });
    }).catch(() => {});
  }, []);

  async function handleLogout() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    router.push('/login');
    router.refresh();
  }

  const limit = PLAN_LIMITS[plan] ?? 10;
  const usagePct = limit === Infinity ? 0 : Math.min((usage / limit) * 100, 100);
  const planLabel = { free: 'Free', starter: 'Starter', pro: 'Pro', agency: 'Agency' }[plan] ?? 'Free';

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 flex flex-col bg-[#0d0d15] border-r border-[#1e1e2e] z-10">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#1e1e2e]">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-600">
          <Zap size={14} className="text-white fill-white" />
        </div>
        <span className="font-semibold text-white tracking-tight">Huntly</span>
        <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded bg-violet-600/20 text-violet-400 border border-violet-600/30">
          BETA
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group ${
                active
                  ? 'bg-violet-600/15 text-violet-300 border border-violet-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon size={15} className={active ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-400'} />
              <span>{label}</span>
            </Link>
          );
        })}

        {/* Separator */}
        <div className="pt-2 pb-1">
          <div className="border-t border-[#1e1e2e]" />
        </div>

        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group ${
            pathname === '/settings'
              ? 'bg-violet-600/15 text-violet-300 border border-violet-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Settings size={15} className={pathname === '/settings' ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-400'} />
          <span>Settings</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#1e1e2e] space-y-3">
        {/* Upgrade CTA — only on free plan */}
        {plan === 'free' && (
          <Link
            href="/pricing"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-violet-600/10 border border-violet-600/20 text-violet-400 hover:bg-violet-600/15 transition-all group text-xs font-medium"
          >
            <span>Upgrade plan</span>
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* Usage bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500">{planLabel} plan</span>
            <span className="text-slate-600">
              {limit === Infinity ? `${usage} / ∞` : `${usage} / ${limit}`}
            </span>
          </div>
          {limit !== Infinity && (
            <div className="w-full bg-[#1e1e2e] rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all ${usagePct > 80 ? 'bg-rose-500' : 'bg-violet-600'}`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          )}
        </div>

        {/* User + logout */}
        {user && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-600 truncate">{user.email}</span>
            <button onClick={handleLogout} title="Sign out" className="shrink-0 text-slate-600 hover:text-slate-400 transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
