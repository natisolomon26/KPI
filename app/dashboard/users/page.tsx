// app/dashboard/users/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Users, Shield, Clock, UserCog } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export default function UserManagementPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                <Shield className="w-3 h-3" />
                Admin
              </span>
            )}
          </div>
          <p className="text-slate-600 mt-1">Manage system users and permissions</p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-200 p-6"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl" />
        
        <div className="relative flex items-center gap-6">
          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900">User Management Coming Soon!</h2>
            <p className="text-sm text-slate-600">
              We're building a complete user management system with roles, permissions, and user administration tools.
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <UserCog className="w-3 h-3 text-indigo-500" />
                Role Management
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-purple-500" />
                Permissions
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-500" />
                Q1 2027
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className="text-xs px-3 py-1 bg-white/80 text-slate-600 rounded-full border border-indigo-200">
              Coming Soon
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}