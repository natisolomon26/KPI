// app/dashboard/alumni/page.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  GraduationCap, 
  MapPin, 
  Calendar,
  Building2,
  Award,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth.store';

export default function AlumniPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const features = [
    {
      icon: Users,
      title: 'Alumni Directory',
      description: 'Connect with fellow alumni from your university and beyond.',
      color: 'bg-sky-100 text-sky-600'
    },
    {
      icon: Building2,
      title: 'Professional Network',
      description: 'Build your professional network and discover career opportunities.',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      icon: MapPin,
      title: 'Global Community',
      description: 'Find alumni in your city or country and organize meetups.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Award,
      title: 'Achievements',
      description: 'Celebrate alumni achievements and share success stories.',
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Alumni Network</h1>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                <Users className="w-3 h-3" />
                Admin
              </span>
            )}
          </div>
          <p className="text-slate-600 mt-1">
            Connect, network, and grow with the EvaSUE alumni community
          </p>
        </div>
        <Button variant="outline" className="gap-2" disabled>
          <Clock className="w-4 h-4" />
          Coming Soon
        </Button>
      </div>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 rounded-2xl border border-sky-200 p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Alumni Network Coming Soon!</h2>
          <p className="text-slate-600 mt-2 max-w-2xl">
            We're building a powerful platform to connect alumni, share opportunities, 
            and strengthen the EvaSUE community worldwide.
          </p>
          <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Expected: Q3 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              184+ Alumni
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}