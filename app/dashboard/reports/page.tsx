'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BarChart3, Building2, CalendarDays, Check, ChevronLeft, ChevronRight, Download, FileChartColumn, FileSpreadsheet, GraduationCap, Layers3, MapPin, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { InsightsFilters } from '@/components/dashboard/insights/InsightsFilters';
import { AdminAccessNotice, downloadBlob, EmptyChart, InsightsError, UpdatedAt } from '@/components/dashboard/insights/InsightsShared';
import { useAnalytics } from '@/hooks/useAnalytics';
import { reportDefinitions, reportRows } from '@/lib/analytics';
import type { AnalyticsFilters, ReportType } from '@/lib/types/analytics';

const reports: { type: ReportType; icon: typeof Building2; color: string }[] = [
  { type: 'summary', icon: Layers3, color: 'bg-sky-50 text-sky-600' },
  { type: 'monthly', icon: CalendarDays, color: 'bg-indigo-50 text-indigo-600' },
  { type: 'institutions', icon: Building2, color: 'bg-violet-50 text-violet-600' },
  { type: 'departments', icon: GraduationCap, color: 'bg-amber-50 text-amber-600' },
  { type: 'locations', icon: MapPin, color: 'bg-emerald-50 text-emerald-600' },
  { type: 'cohorts', icon: BarChart3, color: 'bg-rose-50 text-rose-600' },
];

export default function ReportsPage() {
  const [filters, setFilters] = useState<AnalyticsFilters>({ range: 'all' });
  const [type, setType] = useState<ReportType>('summary');
  const [page, setPage] = useState(1);
  const { data, isPending, isFetching, error, refetch, download, isAdmin } = useAnalytics(filters);
  const definition = reportDefinitions[type];
  const rows = data ? reportRows(data, type) : [];
  const pages = Math.max(1, Math.ceil(rows.length / 10));
  const currentPage = Math.min(page, pages);
  const preview = rows.slice((currentPage - 1) * 10, currentPage * 10);
  const onFiltersChange = (next: AnalyticsFilters) => { setFilters(next); setPage(1); };
  const chooseReport = (next: ReportType) => { setType(next); setPage(1); };
  const downloadReport = async () => {
    try {
      const selected = type;
      const blob = await download.mutateAsync({ filters, report: selected });
      downloadBlob(blob, `evasue-${selected}-${new Date().toISOString().slice(0, 10)}.csv`);
      toast.success(`${reportDefinitions[selected].title} downloaded`);
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to download report.'); }
  };
  if (!isAdmin) return <AdminAccessNotice />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-700">From insights to action</p><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Reports & exports</h1><p className="mt-2 text-sm text-slate-500">Turn your alumni data into clear, shareable reports.</p></div><Link href="/dashboard/analytics" className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900">Explore analytics<ArrowUpRight className="h-4 w-4" /></Link></div>
      <div className="relative overflow-hidden rounded-2xl bg-[#0b1729] p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-28 h-80 w-80 rounded-full border border-sky-300/10" /><div className="pointer-events-none absolute -right-6 -top-16 h-60 w-60 rounded-full border border-sky-300/10" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center"><div className="flex items-start gap-4"><span className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sky-300"><FileChartColumn className="h-7 w-7" /></span><div><h2 className="text-lg font-semibold tracking-tight">Your community. A clearer picture.</h2><p className="mt-2 max-w-md text-xs leading-relaxed text-slate-400">Choose a report, refine your selection, and download a CSV ready for your next meeting or spreadsheet.</p><div className="mt-4 flex flex-wrap gap-3 text-[10px] text-sky-200"><span className="flex items-center gap-1"><Check className="h-3 w-3" />Live registration data</span><span className="flex items-center gap-1"><Check className="h-3 w-3" />6 report types</span><span className="flex items-center gap-1"><Check className="h-3 w-3" />Spreadsheet ready</span></div></div></div><div className="shrink-0 border-white/10 sm:border-l sm:pl-8"><p className="text-3xl font-semibold tabular-nums">{isPending ? '—' : data?.summary.total.toLocaleString() ?? '—'}</p><p className="mt-1 text-[10px] text-slate-400">alumni in your selection</p></div></div>
      </div>
      <InsightsFilters filters={filters} onChange={onFiltersChange} options={data?.options} isFetching={isFetching} />
      {error && <InsightsError message={error.message} onRetry={() => void refetch()} />}
      <div className="grid items-start gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Choose your report</p>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1" aria-label="Report type">
            {reports.map(({ type: report, icon: Icon, color }) => <button key={report} type="button" aria-pressed={type === report} onClick={() => chooseReport(report)} className={`flex items-start gap-3 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${type === report ? 'border-sky-200 bg-white shadow-sm ring-1 ring-sky-100' : 'border-transparent bg-white/50 hover:border-slate-200 hover:bg-white'}`}><span className={`shrink-0 rounded-lg p-2 ${color}`}><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-800">{reportDefinitions[report].title}</span><span className="mt-1 block text-[10px] leading-relaxed text-slate-500">{reportDefinitions[report].description}</span></span>{type === report && <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-sky-600" />}</button>)}
          </div>
        </div>
        <Card className="min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6"><div><span className="mb-2 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-emerald-700"><FileSpreadsheet className="h-3 w-3" />Live preview</span><h2 className="text-base font-semibold">{definition.title}</h2><p className="mt-1 text-[11px] leading-relaxed text-slate-500">{type === 'monthly' ? data?.period.trendLabel : data?.period.label ?? 'Preparing your report'}{filters.university ? ` · ${filters.university}` : ' · All institutions'}{filters.graduationYear ? ` · Class of ${filters.graduationYear}` : ''}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" aria-label="Refresh report" disabled={isFetching} onClick={() => void refetch()}><RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} /></Button><Button size="sm" onClick={downloadReport} disabled={!data || isFetching || !rows.length} isLoading={download.isPending}>{!download.isPending && <Download className="h-3.5 w-3.5" />}Download CSV</Button></div></div>
          <Table aria-label={`${definition.title} preview`}><TableHeader><TableRow><TableHead className="w-12">#</TableHead><TableHead>{definition.column}</TableHead><TableHead className="text-right">{type === 'summary' ? 'Value' : 'Alumni'}</TableHead>{type !== 'summary' && <TableHead className="text-right">Share</TableHead>}</TableRow></TableHeader><TableBody>{isPending ? [1, 2, 3, 4].map(item => <TableRow key={item}><TableCell colSpan={type === 'summary' ? 3 : 4}><div className="h-8 animate-pulse rounded-lg bg-slate-50" /></TableCell></TableRow>) : preview.map((row, index) => <TableRow key={row.name}><TableCell className="text-[10px] tabular-nums text-slate-400">{String((currentPage - 1) * 10 + index + 1).padStart(2, '0')}</TableCell><TableCell className="min-w-32 font-medium text-slate-700">{row.name}</TableCell><TableCell className="text-right font-semibold tabular-nums text-slate-800">{row.count.toLocaleString()}</TableCell>{type !== 'summary' && <TableCell className="text-right text-[11px] tabular-nums text-slate-500">{data?.summary.total ? (row.count / data.summary.total * 100).toFixed(1) : '0.0'}%</TableCell>}</TableRow>)}</TableBody></Table>
          {!isPending && !rows.length && <EmptyChart text={error ? 'The report could not be loaded.' : 'No registrations match these filters. Try a different selection.'} />}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-4 sm:px-6"><span role="status" className="text-[10px] text-slate-500">{isFetching ? 'Preparing preview…' : `${rows.length ? (currentPage - 1) * 10 + 1 : 0}–${Math.min(currentPage * 10, rows.length)} of ${rows.length} rows · CSV includes every row`}</span><nav aria-label="Report preview pages" className="flex items-center gap-2"><Button size="sm" variant="outline" aria-label="Previous preview page" disabled={currentPage <= 1 || isFetching} onClick={() => setPage(currentPage - 1)}><ChevronLeft className="h-3 w-3" /></Button><span className="text-[10px] tabular-nums text-slate-500">{currentPage} / {pages}</span><Button size="sm" variant="outline" aria-label="Next preview page" disabled={currentPage >= pages || isFetching} onClick={() => setPage(currentPage + 1)}><ChevronRight className="h-3 w-3" /></Button></nav></div>
          <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-[10px] leading-relaxed text-slate-500 sm:px-6">Reports contain aggregate counts. Shares use all alumni matching your filters.{type === 'monthly' && filters.range === 'all' ? ' Monthly trends cover the latest 12 months; all-time totals may include earlier registrations.' : ''}</div>
        </Card>
      </div>
      <footer className="flex flex-wrap justify-between gap-2 text-[10px] text-slate-400"><span>Downloads use your selected report and filters.</span><UpdatedAt value={data?.generatedAt} /></footer>
    </div>
  );
}
