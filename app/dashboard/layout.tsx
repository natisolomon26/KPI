'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, hasInitialized } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeyDown); };
  }, [mobileOpen]);

  if (!hasInitialized || isLoading) return <div role="status" className="flex min-h-screen items-center justify-center gap-3 bg-slate-50 text-sm text-slate-500"><Loader2 className="h-5 w-5 animate-spin text-sky-600" />Checking your session…</div>;
  if (!isAuthenticated) return null;

  return <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
    <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onToggle={() => setCollapsed(value => !value)} onClose={() => setMobileOpen(false)} />
    <div className={`min-w-0 transition-[margin] duration-200 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
      <DashboardHeader onOpenMenu={() => setMobileOpen(true)} mobileOpen={mobileOpen} />
      <main className="mx-auto max-w-[1600px] p-4 sm:p-8 lg:p-8 xl:p-10">{children}</main>
    </div>
  </div>;
}
