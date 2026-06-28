// app/dashboard/settings/page.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  Mail,
  Lock,
  Users,
  Building2,
  Database,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth.store';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const settingsSections = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your personal information and preferences.',
      color: 'bg-sky-100 text-sky-600'
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Control your notification preferences and alerts.',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize the look and feel of your dashboard.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Globe,
      title: 'Language & Region',
      description: 'Set your preferred language and regional settings.',
      color: 'bg-emerald-100 text-emerald-600'
    },
    ...(isAdmin ? [
      {
        icon: Shield,
        title: 'Admin Controls',
        description: 'Manage user permissions and system settings.',
        color: 'bg-red-100 text-red-600'
      },
      {
        icon: Users,
        title: 'User Management',
        description: 'View and manage all registered users.',
        color: 'bg-indigo-100 text-indigo-600'
      },
      {
        icon: Database,
        title: 'Data Management',
        description: 'Manage data exports, backups, and system maintenance.',
        color: 'bg-rose-100 text-rose-600'
      }
    ] : [])
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                <Shield className="w-3 h-3" />
                Admin
              </span>
            )}
          </div>
          <p className="text-slate-600 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" disabled>
            <SettingsIcon className="w-4 h-4" />
            Coming Soon
          </Button>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 rounded-2xl border border-slate-200 p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-200/20 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <SettingsIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Settings Dashboard Coming Soon!</h2>
          <p className="text-slate-600 mt-2 max-w-2xl">
            We're building a comprehensive settings panel to give you full control over 
            your account, notifications, and application preferences.
          </p>
          <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Profile Management
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Bell className="w-4 h-4 text-amber-500" />
              Notifications
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-4 h-4 text-red-500" />
              Security
            </span>
          </div>
        </div>
      </motion.div>

      {/* Settings Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${section.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{section.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{section.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Account Info Card */}
      <Card className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200">
        <h3 className="font-semibold text-slate-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500">Full Name</p>
            <p className="font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Email Address</p>
            <p className="font-medium text-slate-900">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Role</p>
            <p className="font-medium text-slate-900">
              {isAdmin ? 'Administrator' : 'User'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Member Since</p>
            <p className="font-medium text-slate-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-sky-200">
          <p className="text-xs text-slate-500">
            Full settings management will be available soon
          </p>
        </div>
      </Card>
    </div>
  );
}