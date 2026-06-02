// components/dashboard/RadialProgressGraph.tsx
'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { MapPin, Users, GraduationCap, TrendingUp } from 'lucide-react';

interface RadialProgressGraphProps {
  data: Array<{
    location: string;
    count: number;
    percentage: number;
  }>;
  totalAlumni: number;
}

export function RadialProgressGraph({ data, totalAlumni }: RadialProgressGraphProps) {
  const topLocations = data.slice(0, 6);
  const radius = 120;
  const circumference = 2 * Math.PI * radius;

  return (
    <Card className="p-6 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-slate-50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Global Alumni Distribution</h3>
          <p className="text-sm text-slate-600 mt-1">Concentration by region</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500/10 to-amber-500/10 rounded-full">
          <TrendingUp className="w-4 h-4 text-sky-600" />
          <span className="text-sm font-semibold text-slate-700">{totalAlumni} Total Alumni</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radial Progress Circles */}
        <div className="relative flex flex-wrap justify-center gap-6">
          {topLocations.map((item, index) => {
            const percentage = item.percentage;
            const strokeDashoffset = circumference - (percentage / 100) * circumference;
            const colors = [
              { start: '#0c4a6e', end: '#0284c7' },
              { start: '#f59e0b', end: '#fbbf24' },
              { start: '#0891b2', end: '#06b6d4' },
              { start: '#d97706', end: '#f97316' },
              { start: '#1e40af', end: '#3b82f6' },
              { start: '#b45309', end: '#d97706' },
            ];
            const color = colors[index % colors.length];

            return (
              <motion.div
                key={item.location}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative group cursor-pointer"
              >
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r={radius - 40}
                      stroke="#e2e8f0"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r={radius - 40}
                      stroke={`url(#gradient-${index})`}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: strokeDashoffset }}
                      transition={{ duration: 1.5, delay: index * 0.1 }}
                    />
                  </svg>
                  <defs>
                    <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={color.start} />
                      <stop offset="100%" stopColor={color.end} />
                    </linearGradient>
                  </defs>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900">{item.count}</span>
                    <span className="text-xs text-slate-500">{item.percentage}%</span>
                  </div>
                </div>
                <p className="text-center mt-3 text-sm font-medium text-slate-700 group-hover:text-sky-600 transition-colors">
                  {item.location}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Statistics Cards */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-sky-50 to-sky-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-sky-800">Top Region</span>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-sky-900">{topLocations[0]?.location}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-sky-700">{topLocations[0]?.count} alumni</span>
              <span className="text-sm font-semibold text-amber-600">{topLocations[0]?.percentage}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4">
              <MapPin className="w-5 h-5 text-amber-600 mb-2" />
              <p className="text-2xl font-bold text-amber-900">{data.length}</p>
              <p className="text-xs text-amber-700 mt-1">Unique Locations</p>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4">
              <Users className="w-5 h-5 text-emerald-600 mb-2" />
              <p className="text-2xl font-bold text-emerald-900">{totalAlumni}</p>
              <p className="text-xs text-emerald-700 mt-1">Total Alumni</p>
            </div>
          </div>

          {/* Progress Bar List */}
          <div className="space-y-3">
            {topLocations.slice(0, 4).map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700 group-hover:text-sky-600 transition-colors">
                    {item.location}
                  </span>
                  <span className="text-slate-500">{item.count} alumni</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-sky-600 to-amber-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                  />
                </div>
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-amber-600 font-medium">{item.percentage}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Import Award icon
import { Award } from 'lucide-react';