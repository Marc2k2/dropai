import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto mb-6">
          <CheckCircle size={32} className="text-emerald-400" />
        </div>

        <h1 className="text-xl font-semibold text-white mb-2">You&apos;re in.</h1>
        <p className="text-slate-400 text-sm mb-8">
          Payment confirmed. Your plan has been upgraded — start generating immediately.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Go to dashboard
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
