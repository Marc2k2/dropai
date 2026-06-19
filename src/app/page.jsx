import Link from 'next/link';
import { PenSquare, Clapperboard, ScanSearch, ShieldEllipsis, ArrowRight } from 'lucide-react';

const tools = [
  {
    label: 'Copy Generator',
    description: 'Headlines, product descriptions, bullet points, Meta ads, and abandoned cart emails — all conversion-optimized.',
    href: '/tools/copy-generator',
    icon: PenSquare,
    color: 'violet',
    ready: true,
  },
  {
    label: 'Ad Script Creator',
    description: 'Three TikTok/Reels UGC scripts per product. Hook, body, CTA — ready to record.',
    href: '/tools/ad-scripts',
    icon: Clapperboard,
    color: 'blue',
    ready: true,
  },
  {
    label: 'Product Analyzer',
    description: 'Paste a product and get a full strategic breakdown: audience, unused angle, saturation score, and risk assessment.',
    href: '/tools/product-analyzer',
    icon: ScanSearch,
    color: 'emerald',
    ready: true,
  },
  {
    label: 'Competitor Spy',
    description: 'Analyze a competitor store — positioning, weak points, and differentiation strategy.',
    href: '/tools/competitor-analyzer',
    icon: ShieldEllipsis,
    color: 'rose',
    ready: true,
  },
];

const colorMap = {
  violet: { bg: 'bg-violet-600/10', border: 'border-violet-600/20', icon: 'text-violet-400', badge: 'bg-violet-600/20 text-violet-300 border-violet-500/30' },
  blue: { bg: 'bg-blue-600/10', border: 'border-blue-600/20', icon: 'text-blue-400', badge: 'bg-blue-600/20 text-blue-300 border-blue-500/30' },
  emerald: { bg: 'bg-emerald-600/10', border: 'border-emerald-600/20', icon: 'text-emerald-400', badge: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30' },
  rose: { bg: 'bg-rose-600/10', border: 'border-rose-600/20', icon: 'text-rose-400', badge: 'bg-rose-600/20 text-rose-300 border-rose-500/30' },
};

export default function DashboardPage() {
  return (
    <div className="px-8 py-10 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-white mb-1.5">Welcome to Huntly</h1>
        <p className="text-slate-400 text-sm">
          Your AI-powered dropshipping toolkit. Pick a tool below to get started.
        </p>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map(({ label, description, href, icon: Icon, color, ready }) => {
          const c = colorMap[color];
          const Card = (
            <div
              className={`
                relative p-5 rounded-xl border bg-[#111118] transition-all group
                ${ready
                  ? `${c.border} hover:bg-[#16161f] cursor-pointer`
                  : 'border-[#1e1e2e] opacity-60 cursor-default'}
              `}
            >
              <div className={`inline-flex p-2.5 rounded-lg ${c.bg} mb-4`}>
                <Icon size={20} className={c.icon} />
              </div>

              <div className="flex items-start justify-between mb-2">
                <h2 className="font-medium text-white text-sm">{label}</h2>
                {!ready ? (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-500 border border-slate-700/50 ml-2 shrink-0">
                    COMING SOON
                  </span>
                ) : (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ml-2 shrink-0 ${c.badge}`}>
                    READY
                  </span>
                )}
              </div>

              <p className="text-slate-500 text-xs leading-relaxed mb-4">{description}</p>

              {ready && (
                <div className={`flex items-center gap-1 text-xs font-medium ${c.icon} group-hover:gap-2 transition-all`}>
                  Open tool <ArrowRight size={12} />
                </div>
              )}
            </div>
          );

          return ready ? (
            <Link key={href} href={href}>
              {Card}
            </Link>
          ) : (
            <div key={href}>{Card}</div>
          );
        })}
      </div>

      {/* Stats bar */}
      <div className="mt-10 grid grid-cols-3 gap-4">
        {[
          { label: 'Generations used', value: '2' },
          { label: 'Plan', value: 'Free Beta' },
          { label: 'Resets in', value: '28 days' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#111118] border border-[#1e1e2e] rounded-xl px-4 py-3">
            <div className="text-lg font-semibold text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
