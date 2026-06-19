import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-600">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">Dropiq</span>
        </div>

        <p className="text-8xl font-bold text-violet-600 mb-4">404</p>
        <h1 className="text-xl font-semibold text-white mb-2">Page not found</h1>
        <p className="text-slate-500 text-sm mb-8">This page doesn&apos;t exist or was moved.</p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <ArrowLeft size={15} />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
