'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Building2, Download, GraduationCap, MapPin, RefreshCw, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InsightsFilters } from '@/components/dashboard/insights/InsightsFilters';
import { AdminAccessNotice, downloadBlob, EmptyChart, InsightsError, RankedList, UpdatedAt } from '@/components/dashboard/insights/InsightsShared';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { AnalyticsFilters } from '@/lib/types/analytics';

const colors = ['#0ea5e9', '#6366f1', '#14b8a6', '#f59e0b', '#a78bfa', '#cbd5e1'];
const tooltipStyle = { borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 };

export default function AnalyticsPage() {
  const [filters, setFilters] = useState<AnalyticsFilters>({ range: '12m' });
  const { data, isPending, isFetching, error, refetch, download, isAdmin } = useAnalytics(filters);
  const total = data?.summary.total ?? 0;
  const monthly = (data?.monthly ?? []).map(item => ({ ...item, label: new Date(`${item.month}-01T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'Africa/Addis_Ababa' }) }));
  const institutions = data?.institutions ?? [];
  const distribution = [...institutions.slice(0, 5)];
  if (institutions.length > 5) distribution.push({ name: 'Other institutions', count: institutions.slice(5).reduce((sum, item) => sum + item.count, 0) });
  const metrics = [
    { label: 'Registered alumni', value: data?.summary.total, icon: Users, color: 'bg-sky-50 text-sky-600', note: 'In the selected registration period' },
    { label: 'Institutions', value: data?.summary.institutions, icon: Building2, color: 'bg-violet-50 text-violet-600', note: 'Universities & colleges represented' },
    { label: 'Departments', value: data?.summary.departments, icon: GraduationCap, color: 'bg-emerald-50 text-emerald-600', note: 'Fields of study represented' },
    { label: 'Locations', value: data?.summary.locations, icon: MapPin, color: 'bg-amber-50 text-amber-600', note: 'Distinct locations reported by alumni' },
  ];
  const exportSummary = async () => {
    try {
      const blob = await download.mutateAsync({ filters, report: 'summary' });
      downloadBlob(blob, `evasue-community-summary-${new Date().toISOString().slice(0, 10)}.csv`);
      toast.success('Analytics summary downloaded');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to download summary.'); }
  };
  if (!isAdmin) return <AdminAccessNotice />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-700">Insights & growth</p><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Community analytics</h1><p className="mt-2 text-sm text-slate-500">Understand the people, places, and institutions behind your community.</p></div>
        <div className="flex gap-2"><Button variant="outline" aria-label="Refresh analytics" disabled={isFetching} onClick={() => void refetch()}><RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} /></Button><Button onClick={exportSummary} disabled={!data || isFetching} isLoading={download.isPending}>{!download.isPending && <Download className="h-4 w-4" />}Export summary</Button></div>
      </div>
      <InsightsFilters filters={filters} onChange={setFilters} options={data?.options} isFetching={isFetching} />
      {error && <InsightsError message={error.message} onRetry={() => void refetch()} />}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, color, note }, index) => <Card key={label} className="p-4 sm:p-5"><div className="flex items-center justify-between gap-2"><span className="text-[11px] font-medium text-slate-500">{label}</span><span className={`rounded-xl p-2 ${color}`}><Icon className="h-4 w-4" /></span></div><p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">{isPending ? <span className="block h-9 w-20 animate-pulse rounded bg-slate-100" aria-label="Loading" /> : value?.toLocaleString() ?? '—'}</p><p className="mt-2 text-[10px] leading-relaxed text-slate-500">{index === 0 && data?.summary.growthPercent != null ? <span className={`inline-flex items-center gap-1 ${data.summary.growthPercent < 0 ? 'text-amber-700' : 'text-emerald-700'}`}>{data.summary.growthPercent < 0 ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}{Math.abs(data.summary.growthPercent)}% vs previous period</span> : note}</p></Card>)}
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <Card className="min-w-0 p-5 sm:p-6 xl:col-span-3">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-sm font-semibold">Registration growth</h2><p className="mt-1 text-[11px] text-slate-500">{data?.period.trendLabel ?? 'Monthly registrations'}</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-medium text-sky-700"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />New alumni</span></div>
          <div className="mt-7 h-64" role="img" aria-label={`Monthly registrations: ${monthly.map(item => `${item.month}: ${item.count}`).join(', ') || 'No data'}`}>
            {isPending ? <div className="h-full animate-pulse rounded-xl bg-slate-50" /> : monthly.some(item => item.count) ? <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 320, height: 240 }}><AreaChart data={monthly} margin={{ top: 10, right: 5, left: -20, bottom: 5 }}><defs><linearGradient id="analytics-growth" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.22} /><stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#eef2f6" strokeDasharray="4 4" vertical={false} /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} minTickGap={20} dy={8} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} /><Tooltip contentStyle={tooltipStyle} /><Area isAnimationActive={false} dataKey="count" name="Alumni" type="monotone" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#analytics-growth)" activeDot={{ r: 5, strokeWidth: 0 }} /></AreaChart></ResponsiveContainer> : <EmptyChart text={error ? 'Registration trends are unavailable.' : 'No new registrations in these months.'} />}
          </div>
          <p className="mt-4 border-t border-slate-100 pt-3 text-[10px] text-slate-400">Dates use Ethiopia time. Comparisons use the preceding period of equal duration.</p>
        </Card>
        <Card className="min-w-0 p-5 sm:p-6 xl:col-span-2">
          <h2 className="text-sm font-semibold">Institution mix</h2><p className="mt-1 text-[11px] text-slate-500">Where your alumni started their journey</p>
          <div className="relative my-3 h-52" role="img" aria-label={`Institutions: ${distribution.map(item => `${item.name}: ${item.count}`).join(', ') || 'No data'}`}>
            {isPending ? <div className="mx-auto mt-6 h-40 w-40 animate-pulse rounded-full border-[22px] border-slate-100" /> : total > 0 ? <><ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 320, height: 240 }}><PieChart><Pie isAnimationActive={false} data={distribution} dataKey="count" nameKey="name" innerRadius={65} outerRadius={88} paddingAngle={3} stroke="none">{distribution.map((item, index) => <Cell key={item.name} fill={colors[index]} />)}</Pie><Tooltip contentStyle={tooltipStyle} /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-semibold tabular-nums">{total.toLocaleString()}</span><span className="mt-1 text-[10px] text-slate-500">alumni</span></div></> : <EmptyChart />}
          </div>
          <div className="space-y-2.5">{distribution.map((item, index) => <div key={item.name} className="flex items-center justify-between gap-3 text-[11px]"><span className="flex min-w-0 items-center gap-2"><span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: colors[index] }} /><span className="truncate text-slate-500" title={item.name}>{item.name}</span></span><span className="shrink-0 font-medium tabular-nums text-slate-700">{total ? (item.count / total * 100).toFixed(1) : 0}%</span></div>)}</div>
        </Card>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="p-5 sm:p-6"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-sm font-semibold">Leading fields of study</h2><p className="mt-1 text-[11px] text-slate-500">The five most represented departments</p></div><GraduationCap className="h-5 w-5 text-violet-300" /></div>{isPending ? <div className="h-56 animate-pulse rounded-xl bg-slate-50" /> : data?.departments.length ? <RankedList items={data.departments} total={total} color="bg-violet-400" /> : <EmptyChart />}</Card>
        <Card className="p-5 sm:p-6"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-sm font-semibold">A community with reach</h2><p className="mt-1 text-[11px] text-slate-500">Top five locations reported by alumni</p></div><MapPin className="h-5 w-5 text-emerald-300" /></div>{isPending ? <div className="h-56 animate-pulse rounded-xl bg-slate-50" /> : data?.locations.length ? <RankedList items={data.locations} total={total} color="bg-emerald-400" /> : <EmptyChart />}</Card>
      </div>
      <Card className="min-w-0 p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-sm font-semibold">Graduation cohorts</h2><p className="mt-1 text-[11px] text-slate-500">The eight most represented graduating classes</p></div><Link href="/dashboard/reports" className="flex items-center gap-1.5 text-xs font-semibold text-sky-700">Explore reports<ArrowRight className="h-3.5 w-3.5" /></Link></div><div className="mt-6 h-56" role="img" aria-label={`Graduation cohorts: ${data?.cohorts.slice(0, 8).map(item => `${item.name}: ${item.count}`).join(', ') || 'No data'}`}>{isPending ? <div className="h-full animate-pulse rounded-xl bg-slate-50" /> : data?.cohorts.length ? <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 320, height: 240 }}><BarChart data={data.cohorts.slice(0, 8)} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}><CartesianGrid vertical={false} stroke="#eef2f6" strokeDasharray="4 4" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f8fafc' }} /><Bar isAnimationActive={false} dataKey="count" name="Alumni" fill="#818cf8" radius={[5, 5, 0, 0]} maxBarSize={48} /></BarChart></ResponsiveContainer> : <EmptyChart />}</div></Card>
      <footer className="flex flex-wrap justify-between gap-2 text-[10px] text-slate-400"><span>Based on alumni registration records</span><UpdatedAt value={data?.generatedAt} /></footer>
    </div>
  );
}
