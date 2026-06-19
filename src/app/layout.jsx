import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import AppShell from '@/components/AppShell';

export const metadata = {
  title: 'Dropiq — AI Toolkit for Dropshippers',
  description: 'Replace Minea + Jasper + AdCreative with one AI tool. Product analysis, copy, ad scripts and competitor spy — starting at €19/month.',
  openGraph: {
    title: 'Dropiq — AI Toolkit for Dropshippers',
    description: 'Replace Minea + Jasper + AdCreative with one AI tool. Starting at €19/month.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-slate-200 antialiased">
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
