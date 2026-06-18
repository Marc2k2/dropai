import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'DropAI — AI Toolkit for Dropshippers',
  description: 'Product copy, ad scripts, and market analysis powered by Claude AI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-slate-200 antialiased">
        <Sidebar />
        <main className="ml-56 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
