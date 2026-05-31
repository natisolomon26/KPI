// app/dashboard/page.tsx
'use client';

import { Card } from '@/components/ui/Card';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Download,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const stats = [
  { 
    name: 'Total Alumni', 
    value: '2,847', 
    icon: Users, 
    change: '+12%', 
    trend: 'up',
    color: 'from-sky-500 to-sky-600',
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-600'
  },
  { 
    name: 'New Registrations', 
    value: '124', 
    icon: UserCheck, 
    change: '+8%', 
    trend: 'up',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  { 
    name: 'Upcoming Events', 
    value: '8', 
    icon: Calendar, 
    change: '+2', 
    trend: 'up',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600'
  },
  { 
    name: 'Engagement Rate', 
    value: '76%', 
    icon: TrendingUp, 
    change: '-3%', 
    trend: 'down',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600'
  },
];

const recentRegistrations = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', university: 'Addis Ababa University', status: 'pending', date: '2 hours ago' },
  { id: 2, name: 'Sarah Smith', email: 'sarah.smith@example.com', university: 'Jimma University', status: 'approved', date: '5 hours ago' },
  { id: 3, name: 'Michael Brown', email: 'michael.b@example.com', university: 'Bahir Dar University', status: 'pending', date: '1 day ago' },
  { id: 4, name: 'Emily Johnson', email: 'emily.j@example.com', university: 'Hawassa University', status: 'approved', date: '2 days ago' },
  { id: 5, name: 'David Wilson', email: 'david.w@example.com', university: 'Addis Ababa University', status: 'rejected', date: '3 days ago' },
];

const upcomingEvents = [
  { id: 1, name: 'Alumni Networking Gala', date: 'Dec 15, 2024', attendees: 124, location: 'Addis Ababa' },
  { id: 2, name: 'Leadership Summit', date: 'Dec 20, 2024', attendees: 89, location: 'Virtual' },
  { id: 3, name: 'Christmas Celebration', date: 'Dec 25, 2024', attendees: 256, location: 'Nationwide' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-700';
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    case 'rejected': return 'bg-red-100 text-red-700';
    default: return 'bg-slate-100 text-slate-700';
  }
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your alumni network.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-3">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-slate-500">from last month</span>
                    </div>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Registrations - Takes 2/3 of space */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Registrations</h2>
              <p className="text-sm text-slate-600 mt-1">Latest alumni registration requests</p>
            </div>
            <Link 
              href="/dashboard/registrations"
              className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
            >
              View all →
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentRegistrations.map((registration) => (
              <div key={registration.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-100 to-sky-200 rounded-full flex items-center justify-center">
                      <span className="text-sky-700 font-semibold text-sm">
                        {registration.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{registration.name}</p>
                      <p className="text-sm text-slate-500">{registration.email}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{registration.university}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                    {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                  </span>
                  <span className="text-xs text-slate-500">{registration.date}</span>
                  <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Upcoming Events</h2>
              <p className="text-sm text-slate-600 mt-1">Next 30 days</p>
            </div>
            <Activity className="w-5 h-5 text-slate-400" />
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="group cursor-pointer">
                <div className="p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-slate-900 group-hover:text-sky-600 transition-colors">
                      {event.name}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{event.date}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{event.attendees} attending</span>
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link 
              href="/dashboard/events"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
            >
              View All Events
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <button className="group p-6 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="text-left">
            <UserCheck className="w-8 h-8 text-white mb-3" />
            <h3 className="text-white font-bold text-lg">Review Registrations</h3>
            <p className="text-sky-100 text-sm mt-1">12 pending approvals</p>
          </div>
        </button>
        
        <button className="group p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="text-left">
            <Calendar className="w-8 h-8 text-white mb-3" />
            <h3 className="text-white font-bold text-lg">Create Event</h3>
            <p className="text-indigo-100 text-sm mt-1">Plan new gathering</p>
          </div>
        </button>
        
        <button className="group p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="text-left">
            <TrendingUp className="w-8 h-8 text-white mb-3" />
            <h3 className="text-white font-bold text-lg">Generate Report</h3>
            <p className="text-emerald-100 text-sm mt-1">Monthly analytics</p>
          </div>
        </button>
      </div>
    </div>
  );
}