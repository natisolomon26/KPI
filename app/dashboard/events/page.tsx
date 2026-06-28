// app/dashboard/events/page.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users,
  Video,
  Building2,
  Bell,
  ArrowRight,
  CalendarDays,
  Coffee,
  Music,
  UsersRound
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth.store';

export default function EventsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const eventTypes = [
    {
      icon: UsersRound,
      title: 'Networking Events',
      description: 'Connect with fellow alumni and industry professionals.',
      color: 'bg-sky-100 text-sky-600'
    },
    {
      icon: Video,
      title: 'Webinars',
      description: 'Learn from experts and alumni through online sessions.',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: Coffee,
      title: 'Meetups',
      description: 'Local gatherings for alumni in your area.',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      icon: Music,
      title: 'Cultural Events',
      description: 'Celebrate Ethiopian culture and heritage together.',
      color: 'bg-rose-100 text-rose-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Events</h1>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                <Calendar className="w-3 h-3" />
                Admin
              </span>
            )}
          </div>
          <p className="text-slate-600 mt-1">
            Discover and participate in EvaSUE events and activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" disabled>
            <Bell className="w-4 h-4" />
            Subscribe
          </Button>
          <Button variant="outline" className="gap-2" disabled>
            <Clock className="w-4 h-4" />
            Coming Soon
          </Button>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-200 p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-200/20 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Events Platform Coming Soon!</h2>
          <p className="text-slate-600 mt-2 max-w-2xl">
            We're creating a dynamic events platform to bring the EvaSUE community together 
            through webinars, workshops, meetups, and cultural celebrations.
          </p>
          <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              Monthly Events
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Community Driven
            </span>
            <span>•</span>
            <span>Virtual & In-Person</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}