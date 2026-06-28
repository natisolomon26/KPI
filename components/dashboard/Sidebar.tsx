// components/dashboard/Sidebar.tsx
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
  ChevronRight,
  Shield,
  BarChart3,
  UserCog
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth.store';

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export function Sidebar({ onCollapseChange }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      return saved === 'true';
    }
    return false;
  });
  
  const isFirstRender = useRef(true);

  // Define menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, show: true },
      { name: 'Registrations', href: '/dashboard/registrations', icon: Users, show: true },
      { name: 'Alumni Directory', href: '/dashboard/alumni', icon: GraduationCap, show: true },
      { name: 'Events', href: '/dashboard/events', icon: Calendar, show: true },
    ];

    // Admin-only items
    const adminItems = [
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, show: user?.role === 'admin' },
      { name: 'User Management', href: '/dashboard/users', icon: UserCog, show: user?.role === 'admin' },
      { name: 'Reports', href: '/dashboard/reports', icon: FileText, show: user?.role === 'admin' },
    ];

    // Settings - show to everyone
    const settingsItem = { name: 'Settings', href: '/dashboard/settings', icon: Settings, show: true };

    return [...baseItems, ...adminItems, settingsItem];
  };

  const menuItems = getMenuItems();

  // Notify parent about collapse state changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (onCollapseChange) {
        onCollapseChange(isCollapsed);
      }
      return;
    }
    
    localStorage.setItem('sidebar-collapsed', String(isCollapsed));
    window.dispatchEvent(new Event('sidebar-toggle'));
    
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  // Get user display name
  const getDisplayName = () => {
    if (!user) return 'User';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
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

        {/* User Profile Section (Collapsed) */}
        {isCollapsed && user && (
          <div className="flex justify-center py-4 border-b border-sky-700/50">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg">
              {getInitials()}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems
            .filter(item => item.show !== false)
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              
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

        {/* User Info (Expanded) */}
        {!isCollapsed && user && (
          <div className="px-4 py-3 border-t border-sky-700/50">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {getInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{getDisplayName()}</p>
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

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