// components/dashboard/BubbleMapGraph.tsx
'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { MapPin, TrendingUp, Globe } from 'lucide-react';

interface BubbleMapGraphProps {
  data: Array<{
    location: string;
    count: number;
    percentage: number;
  }>;
  totalAlumni: number;
}

export function BubbleMapGraph({ data, totalAlumni }: BubbleMapGraphProps) {
  const topLocations = data.slice(0, 8);
  const maxCount = Math.max(...topLocations.map(l => l.count));

  return (
    <Card className="p-6 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-slate-50 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Alumni Hotspots</h3>
          <p className="text-sm text-slate-600 mt-1">Geographic concentration map</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500/10 to-amber-500/10 rounded-full">
          <Globe className="w-4 h-4 text-sky-600" />
          <span className="text-sm font-semibold text-slate-700">Global Network</span>
        </div>
      </div>

      <div className="relative min-h-[500px] bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl p-6">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sky-600 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500 rounded-full blur-3xl" />
        </div>

        {/* Bubble Grid */}
        <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {topLocations.map((item, index) => {
            const size = 60 + (item.count / maxCount) * 60;
            const colors = [
              'from-sky-600 to-sky-400',
              'from-amber-500 to-amber-400',
              'from-cyan-600 to-cyan-400',
              'from-orange-500 to-orange-400',
              'from-blue-600 to-blue-400',
              'from-yellow-500 to-yellow-400',
              'from-indigo-600 to-indigo-400',
              'from-red-500 to-red-400',
            ];
            
            return (
              <motion.div
                key={item.location}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
                className="flex flex-col items-center group cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative flex items-center justify-center rounded-full bg-gradient-to-br shadow-lg transition-all duration-300"
                  style={{
                    width: size,
                    height: size,
                    backgroundImage: `linear-gradient(135deg, ${colors[index % colors.length].split(' ')[1]} 0%, ${colors[index % colors.length].split(' ')[3]} 100%)`,
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <span className="text-white font-bold text-lg">{item.count}</span>
                </motion.div>
                <p className="mt-3 text-sm font-semibold text-slate-700 text-center group-hover:text-sky-600 transition-colors">
                  {item.location}
                </p>
                <p className="text-xs text-slate-500 mt-1">{item.percentage}% of alumni</p>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-sky-500 rounded-full" />
                <span>Larger bubble = More alumni</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <span>Darker color = Higher concentration</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3" />
              <span>Hover for details</span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-2xl font-bold text-sky-600">{topLocations.length}</p>
            <p className="text-xs text-slate-600 mt-1">Active Locations</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-2xl font-bold text-amber-600">{totalAlumni}</p>
            <p className="text-xs text-slate-600 mt-1">Total Alumni</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-2xl font-bold text-emerald-600">
              {Math.round((topLocations[0]?.count / totalAlumni) * 100)}%
            </p>
            <p className="text-xs text-slate-600 mt-1">Top Location Share</p>
          </div>
        </div>
      </div>
    </Card>
  );
}