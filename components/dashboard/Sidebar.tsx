// components/dashboard/Sidebar.tsx (fixed ESLint warning)
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  GraduationCap,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth.store';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Registrations', href: '/dashboard/registrations', icon: Users },
  { name: 'Alumni Directory', href: '/dashboard/alumni', icon: GraduationCap },
  { name: 'Events', href: '/dashboard/events', icon: Calendar },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export function Sidebar({ onCollapseChange }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Initialize state directly from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      return saved === 'true';
    }
    return false;
  });
  
  const isFirstRender = useRef(true);

  // Notify parent about collapse state changes (excluding initial render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Still notify parent on initial render if needed
      if (onCollapseChange) {
        onCollapseChange(isCollapsed);
      }
      return;
    }
    
    // Save to localStorage on change
    localStorage.setItem('sidebar-collapsed', String(isCollapsed));
    
    // Dispatch custom event for other components
    window.dispatchEvent(new Event('sidebar-toggle'));
    
    // Notify parent
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside 
      className={`
        fixed left-0 top-0 h-full bg-gradient-to-b from-sky-900 via-sky-800 to-sky-900 
        shadow-2xl z-30 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-sky-700/50 relative">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-300">
                <h1 className="text-lg font-bold text-white tracking-tight">EvaSUE</h1>
                <p className="text-xs text-sky-300">Dashboard</p>
              </div>
            )}
          </Link>
          
          {/* Collapse Toggle Button */}
          <button
            onClick={handleToggleCollapse}
            className="absolute -right-3 top-1/2 -translate-y-1/2 bg-sky-700 hover:bg-sky-600 
                       rounded-full p-1.5 shadow-lg transition-all duration-200 border border-sky-500/50
                       hover:scale-110"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-white" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? 'bg-sky-700/50 text-white shadow-lg shadow-sky-900/30' 
                    : 'text-sky-100 hover:bg-sky-800/50 hover:text-white'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.name : ''}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-1 h-6 bg-sky-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sky-700/50">
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-4 py-2.5 w-full rounded-lg 
              text-red-300 hover:text-red-200 hover:bg-red-900/20 
              transition-all duration-200 group
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>

        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sky-900 to-transparent pointer-events-none" />
      </div>
    </aside>
  );
}