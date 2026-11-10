'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Settings, GraduationCap, CalendarDays, PanelLeftClose, PanelLeftOpen, BarChart3, UserCog, ArrowUpRight, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function Sidebar({ collapsed, mobileOpen, onToggle, onClose }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const mainItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Registrations', href: '/dashboard/registrations', icon: Users },
    { name: 'Alumni network', href: '/dashboard/alumni', icon: GraduationCap },
    { name: 'Events', href: '/dashboard/events', icon: CalendarDays },
  ];
  const adminItems = [
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'User management', href: '/dashboard/users', icon: UserCog },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  ];
  const renderItems = (items: typeof mainItems) => items.map(({ name, href, icon: Icon }) => {
    const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href);
    return <Link key={href} href={href} onClick={onClose} title={name} aria-current={active ? 'page' : undefined}
      className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${active ? 'bg-sky-400/15 text-sky-200 ring-1 ring-sky-300/15' : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${collapsed ? 'lg:justify-center' : ''}`}>
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span className={collapsed ? 'lg:hidden' : ''}>{name}</span>
      {active && <span className={`ml-auto h-1.5 w-1.5 rounded-full bg-sky-300 ${collapsed ? 'lg:hidden' : ''}`} />}
    </Link>;
  });

  return <>
    {mobileOpen && <button aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden" />}
    <aside id="dashboard-navigation" aria-label="Main navigation" className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-[#0b1729] transition-all duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}>
      <div className="flex h-20 items-center gap-3 px-5">
        <Link href="/dashboard" onClick={onClose} aria-label="EvaSUE dashboard" className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400 text-slate-950"><GraduationCap className="h-6 w-6" /></span>
          <span className={collapsed ? 'lg:hidden' : ''}><span className="block text-lg font-bold tracking-tight text-white">EvaSUE<span className="text-sky-300">.</span></span><span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Alumni workspace</span></span>
        </Link>
        <button onClick={onClose} aria-label="Close navigation" className="ml-auto p-1 text-slate-400 lg:hidden"><X className="h-5 w-5" /></button>
      </div>
      <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
        <div><p className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 ${collapsed ? 'lg:sr-only' : ''}`}>Workspace</p><div className="space-y-1">{renderItems(mainItems)}</div></div>
        {user?.role === 'admin' && <div><p className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 ${collapsed ? 'lg:sr-only' : ''}`}>Administration</p><div className="space-y-1">{renderItems(adminItems)}</div></div>}
      </nav>
      <div className="space-y-3 border-t border-white/5 p-3">
        {renderItems([{ name: 'Settings', href: '/dashboard/settings', icon: Settings }])}
        <Link href="/" className={`flex items-center justify-between rounded-xl bg-white/5 px-3 py-3 text-xs text-slate-300 hover:bg-white/10 ${collapsed ? 'lg:hidden' : ''}`}>Open registration form<ArrowUpRight className="h-4 w-4" /></Link>
        <button onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="hidden w-full items-center gap-3 rounded-xl px-3 py-3 text-xs text-slate-500 hover:bg-white/5 hover:text-slate-200 lg:flex">
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <><PanelLeftClose className="h-4 w-4" />Collapse sidebar</>}
        </button>
      </div>
    </aside>
  </>;
}
