'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

const AUTH_PATHS = ['/login', '/auth'];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const showSidebar = !AUTH_PATHS.some((p) => pathname.startsWith(p));

  return (
    <>
      {showSidebar && <Sidebar />}
      <main className={showSidebar ? 'ml-56 min-h-screen' : 'min-h-screen'}>
        {children}
      </main>
    </>
  );
}
