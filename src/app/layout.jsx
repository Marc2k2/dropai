import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata = {
  title: 'DropAI — AI Toolkit for Dropshippers',
  description: 'Product copy, ad scripts, and market analysis powered by Claude AI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-slate-200 antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
