import { CalendarDays, SlidersHorizontal, X } from 'lucide-react';
import type { AnalyticsData, AnalyticsFilters, AnalyticsRange } from '@/lib/types/analytics';
import { Card } from '@/components/ui/Card';

const ranges: { value: AnalyticsRange; label: string }[] = [
  { value: '3m', label: '3 months' }, { value: '6m', label: '6 months' },
  { value: '12m', label: '12 months' }, { value: 'all', label: 'All time' },
];
const selectClass = 'w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-50';

export function InsightsFilters({ filters, onChange, options, isFetching }: {
  filters: AnalyticsFilters;
  onChange: (filters: AnalyticsFilters) => void;
  options?: AnalyticsData['options'];
  isFetching: boolean;
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-medium text-slate-500"><CalendarDays className="h-3.5 w-3.5" />Registration period</p>
          <div className="inline-flex max-w-full gap-1 rounded-xl border border-slate-100 bg-slate-50 p-1" aria-label="Registration period">
            {ranges.map(range => <button key={range.value} type="button" aria-pressed={filters.range === range.value} onClick={() => onChange({ ...filters, range: range.value })} className={`rounded-lg px-3 py-2 text-[11px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:px-4 ${filters.range === range.value ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/70' : 'text-slate-500 hover:text-slate-800'}`}>{range.label}</button>)}
          </div>
        </div>
        <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_160px] xl:w-[480px]">
          <label className="min-w-0"><span className="mb-2 block text-[10px] text-slate-500">Institution</span><select aria-label="Filter by institution" value={filters.university || ''} onChange={event => onChange({ ...filters, university: event.target.value || undefined })} className={selectClass}><option value="">All institutions</option>{filters.university && !options?.institutions.includes(filters.university) && <option value={filters.university}>{filters.university}</option>}{options?.institutions.map(name => <option key={name} value={name}>{name}</option>)}</select></label>
          <label><span className="mb-2 block text-[10px] text-slate-500">Graduation year</span><select aria-label="Filter by graduation year" value={filters.graduationYear || ''} onChange={event => onChange({ ...filters, graduationYear: event.target.value || undefined })} className={selectClass}><option value="">All class years</option>{filters.graduationYear && !options?.graduationYears.includes(filters.graduationYear) && <option value={filters.graduationYear}>Class of {filters.graduationYear}</option>}{options?.graduationYears.map(year => <option key={year} value={year}>Class of {year}</option>)}</select></label>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5"><SlidersHorizontal className="h-3 w-3" />{isFetching ? 'Updating insights…' : 'Filters apply to every chart, preview, and download.'}</span>
        {(filters.university || filters.graduationYear) && <button type="button" onClick={() => onChange({ range: filters.range })} className="flex items-center gap-1 font-medium text-sky-700 hover:text-sky-900"><X className="h-3 w-3" />Clear filters</button>}
      </div>
    </Card>
  );
}
