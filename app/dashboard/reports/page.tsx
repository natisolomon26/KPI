// app/dashboard/reports/page.tsx
'use client';

import { motion } from 'framer-motion';
import { FileText, Clock, BarChart3 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export default function ReportsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reports</h1>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                <FileText className="w-3 h-3" />
                Admin
              </span>
            )}
          </div>
          <p className="text-slate-600 mt-1">Generate and download reports for alumni data</p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-xl border border-orange-200 p-6"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl" />
        
        <div className="relative flex items-center gap-6">
          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900">Reports Coming Soon!</h2>
            <p className="text-sm text-slate-600">
              We're building a comprehensive reporting system with analytics, alumni directory, and export options.
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3 text-orange-500" />
                Analytics
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-sky-500" />
                Directory
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-500" />
                Q1 2027
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className="text-xs px-3 py-1 bg-white/80 text-slate-600 rounded-full border border-orange-200">
              Coming Soon
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}