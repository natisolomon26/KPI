// components/dashboard/Header.tsx
'use client';

import { useState } from 'react';
import { Bell, Search, User, ChevronDown, Shield, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

export function DashboardHeader() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  // Get role display text
  const getRoleDisplay = () => {
    if (!user) return 'Guest';
    return user.role === 'admin' ? 'Administrator' : 'User';
  };

  // Get role badge color
  const getRoleBadgeColor = () => {
    if (!user) return 'bg-gray-100 text-gray-600';
    return user.role === 'admin' 
      ? 'bg-purple-100 text-purple-700' 
      : 'bg-blue-100 text-blue-700';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notifications - Show for all authenticated users */}
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getInitials()}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-slate-900">{getDisplayName()}</p>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
                      {getRoleDisplay()}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 z-40"
                    >
                      <div className="py-2">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-sm font-medium text-slate-900">{getDisplayName()}</p>
                          <p className="text-xs text-slate-500">{user?.email}</p>
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
                            {getRoleDisplay()}
                          </span>
                        </div>

                        {/* Menu Items */}
                        <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Profile
                        </button>
                        
                        {/* Admin-only settings */}
                        {user?.role === 'admin' && (
                          <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Admin Panel
                          </button>
                        )}
                        
                        <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                          <Bell className="w-4 h-4" />
                          Notifications
                        </button>
                        
                        <hr className="my-1" />
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}