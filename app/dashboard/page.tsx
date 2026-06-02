// app/dashboard/page.tsx (fixed)
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import {
  Users,
  GraduationCap,
  Calendar,
  TrendingUp,
  Download,
  RefreshCw,
  Globe,
  Building2,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useRegistrationStore } from '@/store/registration.store';
import { Registration } from '@/lib/types/api';

export default function DashboardPage() {
  const { useGetRegistrations } = useRegistrations();
  const { registrations, isLoading } = useRegistrationStore();
  const [totalAlumni, setTotalAlumni] = useState(0);
  const [topUniversity, setTopUniversity] = useState('N/A');
  const [topLocation, setTopLocation] = useState('N/A');

  const { refetch } = useGetRegistrations('', 1);

  useEffect(() => {
    if (registrations && registrations.length > 0) {
      processData(registrations);
    }
  }, [registrations]);

  const processData = (data: Registration[]) => {
    // Calculate total alumni
    setTotalAlumni(data.length);

    // Find top university
    const universityCount: Record<string, number> = {};
    data.forEach((reg) => {
      const university = reg.university;
      if (university) {
        universityCount[university] = (universityCount[university] || 0) + 1;
      }
    });
    
    const topUni = Object.entries(universityCount).sort(([, a], [, b]) => b - a)[0];
    setTopUniversity(topUni?.[0] || 'N/A');

    // Find top location
    const locationCount: Record<string, number> = {};
    data.forEach((reg) => {
      const location = reg.currentLocation?.split(',')[0]?.trim() || 'Other';
      locationCount[location] = (locationCount[location] || 0) + 1;
    });
    
    const topLoc = Object.entries(locationCount).sort(([, a], [, b]) => b - a)[0];
    setTopLocation(topLoc?.[0] || 'N/A');
  };

  // Calculate stats
  const registrationsArray = registrations || [];
  const uniqueUniversities = [...new Set(registrationsArray.map(r => r?.university).filter(Boolean))].length;
  const uniqueLocations = [...new Set(registrationsArray.map(r => r?.currentLocation?.split(',')[0]?.trim()).filter(Boolean))].length;
  
  const thisMonthRegistrations = registrationsArray.filter(r => {
    if (!r?.registeredAt) return false;
    const regDate = new Date(r.registeredAt);
    const now = new Date();
    return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    {
      name: 'Total Alumni',
      value: totalAlumni.toLocaleString(),
      icon: Users,
      bgColor: 'bg-sky-50',
      iconColor: 'text-sky-600',
      description: 'Registered alumni'
    },
    {
      name: 'Partner Universities',
      value: uniqueUniversities.toLocaleString(),
      icon: GraduationCap,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      description: 'Institutions represented'
    },
    {
      name: 'New This Month',
      value: thisMonthRegistrations.toLocaleString(),
      icon: Calendar,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'New registrations'
    },
    {
      name: 'Global Locations',
      value: uniqueLocations.toLocaleString(),
      icon: Globe,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'Cities worldwide'
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your alumni network.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-sky-900 to-sky-700 rounded-lg hover:from-sky-800 hover:to-sky-600 transition-all shadow-md hover:shadow-lg">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid - 4 Cards */}
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
              <Card className="p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-3">{stat.description}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Three Footer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Top University Card */}
        <Card className="p-6 bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-600 rounded-xl">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-sky-800">Top University</p>
              <p className="text-xl font-bold text-sky-900 mt-1">
                {topUniversity}
              </p>
              <p className="text-xs text-sky-700 mt-1">Most represented institution</p>
            </div>
          </div>
        </Card>

        {/* Fastest Growing / Top Location Card */}
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-600 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">Fastest Growing</p>
              <p className="text-xl font-bold text-amber-900 mt-1">
                {topLocation}
              </p>
              <p className="text-xs text-amber-700 mt-1">Highest alumni concentration</p>
            </div>
          </div>
        </Card>

        {/* Engagement Rate Card */}
        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-800">Engagement Rate</p>
              <p className="text-xl font-bold text-emerald-900 mt-1">76%</p>
              <p className="text-xs text-emerald-700 mt-1">Active alumni participation</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}