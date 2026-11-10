'use client';

import Link from 'next/link';
import { Users, GraduationCap, CalendarDays, MapPin, Download, RefreshCw, ArrowUpRight, ArrowRight, AlertCircle, Inbox, Building2 } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import toast from 'react-hot-toast';
import { useRegistrationQuery, useRegistrations } from '@/hooks/useRegistrations';
import { useAuthStore } from '@/store/auth.store';

const number = (value: number) => value.toLocaleString();

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data, isPending, isFetching, error, refetch, dataUpdatedAt } = useRegistrationQuery('', 1, 5);
  const { exportRegistrations } = useRegistrations();
  const stats = data?.stats;
  const registrations = data?.data ?? [];
  const universities = data?.insights?.topUniversities ?? [];
  const trend = (data?.insights?.monthlyRegistrations ?? []).map(item => ({
    ...item, label: new Date(`${item.month}-01T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', timeZone: 'Africa/Addis_Ababa' }),
  }));
  const hasTrend = trend.some(item => item.count > 0);
  const metrics = [
    { title: 'Total alumni', value: stats?.total, detail: 'People in our growing community', icon: Users, color: 'bg-sky-50 text-sky-700' },
    { title: 'Institutions', value: stats?.universities, detail: 'Universities & colleges represented', icon: GraduationCap, color: 'bg-violet-50 text-violet-700' },
    { title: 'New this month', value: stats?.thisMonth, detail: 'Alumni who joined this month', icon: CalendarDays, color: 'bg-emerald-50 text-emerald-700' },
    { title: 'Locations', value: stats?.countries, detail: 'Distinct locations reported by alumni', icon: MapPin, color: 'bg-amber-50 text-amber-700' },
  ];
  const exportCsv = async () => {
    try {
      const blob = await exportRegistrations.mutateAsync();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `evasue-alumni-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success('Alumni data exported');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Export failed'); }
  };

  return <div className="space-y-7">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-700">Community at a glance</p><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Alumni overview</h1><p className="mt-2 text-sm text-slate-500">Welcome back, {user?.firstName}. Keep your community connected.</p></div>
      <div className="flex gap-2">
        <button onClick={() => void refetch()} disabled={isFetching} aria-label="Refresh dashboard" className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} /></button>
        <button onClick={exportCsv} disabled={exportRegistrations.isPending || !stats?.total} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"><Download className="h-4 w-4" />{exportRegistrations.isPending ? 'Exporting…' : 'Export alumni'}</button>
      </div>
    </div>

    {error && <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle className="h-5 w-5 shrink-0" /><span className="flex-1">Unable to load dashboard data. {error.message}</span><button onClick={() => void refetch()} className="font-semibold underline">Try again</button></div>}

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ title, value, detail, icon: Icon, color }) => <div key={title} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/20">
        <div className="flex items-center justify-between"><p className="text-xs font-medium text-slate-500">{title}</p><span className={`rounded-xl p-2.5 ${color}`}><Icon className="h-[18px] w-[18px]" /></span></div>
        <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">{isPending ? <span aria-label="Loading" className="inline-block h-9 w-20 animate-pulse rounded bg-slate-100" /> : value === undefined ? '—' : number(value)}</p>
        <p className="mt-2 text-[11px] text-slate-400">{detail}</p>
      </div>)}
    </div>

    <div className="grid gap-5 xl:grid-cols-5">
      <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 xl:col-span-3">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-sm font-semibold">Community growth</h2><p className="mt-1 text-xs text-slate-400">New registrations over the last six months</p></div><span className="flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[10px] font-medium text-sky-700"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />Registrations</span></div>
        <div className="mt-7 h-60" role="img" aria-label={`Monthly registrations: ${trend.map(item => `${item.month}: ${item.count}`).join(', ') || 'No data loaded'}`}>
          {isPending ? <div className="h-full animate-pulse rounded-xl bg-slate-50" /> : hasTrend ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{ top: 10, right: 5, bottom: 0, left: -25 }}>
            <defs><linearGradient id="registration-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.2} /><stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#eef2f6" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} /><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} /><Area type="monotone" dataKey="count" name="Registrations" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#registration-fill)" dot={{ r: 3, fill: '#fff', strokeWidth: 2 }} />
          </AreaChart></ResponsiveContainer> : <div className="flex h-full flex-col items-center justify-center gap-3 text-xs text-slate-400"><CalendarDays className="h-7 w-7 text-slate-300" />{error ? 'Growth data unavailable' : 'Your registration history will appear here.'}</div>}
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 xl:col-span-2">
        <div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold">Top institutions</h2><p className="mt-1 text-xs text-slate-400">Across the entire alumni community</p></div><Building2 className="h-4 w-4 text-slate-300" /></div>
        <div className="mt-7 space-y-5">
          {isPending ? [1, 2, 3].map(item => <div key={item} className="h-10 animate-pulse rounded bg-slate-50" />) : universities.length ? universities.map((institution, index) => <div key={institution.name}>
            <div className="mb-2 flex items-center justify-between gap-4"><span className="flex min-w-0 items-center gap-2 text-xs"><span className="text-[10px] tabular-nums text-slate-400">0{index + 1}</span><span className="truncate text-slate-600" title={institution.name}>{institution.name}</span></span><span className="text-xs font-semibold tabular-nums">{number(institution.count)}</span></div>
            <div className="ml-6 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-sky-500" style={{ width: `${stats?.total ? institution.count / stats.total * 100 : 0}%` }} /></div>
          </div>) : <div className="flex h-48 items-center justify-center text-xs text-slate-400">{error ? 'Institution data unavailable' : 'No institutions represented yet.'}</div>}
        </div>
      </section>
    </div>

    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6"><div><h2 className="text-sm font-semibold">Recent registrations</h2><p className="mt-1 text-xs text-slate-400">The newest members of the EvaSUE community</p></div><Link href="/dashboard/registrations" className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900">View all<ArrowRight className="h-3.5 w-3.5" /></Link></div>
      <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400"><tr><th scope="col" className="px-6 py-3 font-medium">Alumni</th><th scope="col" className="px-6 py-3 font-medium">Institution</th><th scope="col" className="px-6 py-3 font-medium">Location</th><th scope="col" className="px-6 py-3 font-medium">Joined</th></tr></thead><tbody className="divide-y divide-slate-100">
        {isPending ? [1, 2, 3].map(item => <tr key={item}><td colSpan={4} className="px-6 py-4"><div className="h-9 animate-pulse rounded bg-slate-50" /></td></tr>) : registrations.map(registration => <tr key={registration._id} className="hover:bg-slate-50/60">
          <td className="px-6 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500">{registration.firstName[0]}{registration.lastName[0]}</span><span><span className="block whitespace-nowrap font-medium text-slate-800">{registration.firstName} {registration.lastName}</span><span className="mt-1 block text-[10px] text-slate-400">{registration.email}</span></span></div></td>
          <td className="min-w-48 px-6 py-4"><span className="text-slate-600">{registration.university}</span><span className="mt-1 block text-[10px] text-slate-400">{registration.department}</span></td><td className="whitespace-nowrap px-6 py-4 text-slate-500">{registration.currentLocation}</td><td className="whitespace-nowrap px-6 py-4 text-slate-400">{new Date(registration.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Africa/Addis_Ababa' })}</td>
        </tr>)}
      </tbody></table></div>
      {!isPending && !registrations.length && <div className="flex flex-col items-center gap-3 px-6 py-12 text-center"><Inbox className="h-8 w-8 text-slate-300" /><p className="text-sm text-slate-500">{error ? 'Registrations could not be loaded.' : 'Your community starts with the first registration.'}</p>{!error && <Link href="/" className="flex items-center gap-1 text-xs font-semibold text-sky-700">Open registration form<ArrowUpRight className="h-3.5 w-3.5" /></Link>}</div>}
    </section>
    <footer className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400"><span>EvaSUE · Connecting graduates, building community.</span><span>{dataUpdatedAt ? `Updated ${new Date(dataUpdatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Addis_Ababa' })} EAT` : 'Waiting for data'}</span></footer>
  </div>;
}
