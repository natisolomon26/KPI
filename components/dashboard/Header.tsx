'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, ChevronDown, LogOut, Settings, Search, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';

export function DashboardHeader({ onOpenMenu, mobileOpen }: { onOpenMenu: () => void; mobileOpen: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const section = pathname === '/dashboard' ? 'Overview' : pathname.split('/').pop()?.replace(/-/g, ' ');
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to sign out. Please try again.'); }
  };

  return <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-8">
    <div className="flex items-center gap-3">
      <button onClick={onOpenMenu} aria-label="Open navigation" aria-expanded={mobileOpen} aria-controls="dashboard-navigation" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"><Menu className="h-5 w-5" /></button>
      <div className="flex items-center gap-2 text-sm"><span className="hidden text-slate-400 sm:inline">Workspace</span><span className="hidden text-slate-300 sm:inline">/</span><span className="font-medium capitalize text-slate-800">{section}</span></div>
    </div>
    <div className="flex items-center gap-2 sm:gap-5">
      <Link href="/dashboard/registrations" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Find alumni"><Search className="h-[18px] w-[18px]" /></Link>
      <Link href="/" className="hidden items-center gap-2 text-xs font-medium text-slate-500 hover:text-sky-700 md:flex">Public form<ArrowUpRight className="h-3.5 w-3.5" /></Link>
      <div className="h-6 w-px bg-slate-200" />
      <details className="group relative">
        <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg p-1.5 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-100 bg-sky-50 text-xs font-bold text-sky-800">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
          <span className="hidden text-left sm:block"><span className="block text-xs font-semibold text-slate-800">{user?.firstName} {user?.lastName}</span><span className="block text-[10px] capitalize text-slate-500">{user?.role === 'admin' ? 'Administrator' : 'Member'}</span></span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform group-open:rotate-180" />
        </summary>
        <div className="absolute right-0 mt-3 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
          <div className="mb-1 break-words border-b border-slate-100 px-3 py-3 text-xs text-slate-500">{user?.email}</div>
          <Link href="/dashboard/settings" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"><Settings className="h-4 w-4" />Account settings</Link>
          <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" />Sign out</button>
        </div>
      </details>
    </div>
  </header>;
}
