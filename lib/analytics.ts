import type { AnalyticsData, AnalyticsFilters, AnalyticsRange, ReportType } from '@/lib/types/analytics';

const EAT_OFFSET = 3 * 60 * 60 * 1000;
export const rangeLabels: Record<AnalyticsRange, string> = {
  '3m': 'Last 3 months', '6m': 'Last 6 months', '12m': 'Last 12 months', all: 'All time',
};
export const reportDefinitions: Record<ReportType, { title: string; description: string; column: string }> = {
  summary: { title: 'Community summary', description: 'A snapshot of your alumni community and its reach.', column: 'Metric' },
  monthly: { title: 'Registration trends', description: 'Monthly registrations, including months with no new alumni.', column: 'Month' },
  institutions: { title: 'Institution breakdown', description: 'Alumni representation across universities and colleges.', column: 'Institution' },
  departments: { title: 'Department breakdown', description: 'Understand the fields of study in your community.', column: 'Department' },
  locations: { title: 'Location breakdown', description: 'See where your alumni community is based.', column: 'Location' },
  cohorts: { title: 'Graduation cohorts', description: 'Explore alumni by their year of graduation.', column: 'Graduation year' },
};

export function parseAnalyticsFilters(params: URLSearchParams): AnalyticsFilters {
  const range = params.get('range') || '12m';
  if (!Object.hasOwn(rangeLabels, range)) throw new Error('Choose a valid registration period.');
  const graduationYear = params.get('graduationYear')?.trim();
  if (graduationYear && !/^\d{4}$/.test(graduationYear)) throw new Error('Choose a valid graduation year.');
  return { range: range as AnalyticsRange, university: params.get('university')?.trim() || undefined, graduationYear: graduationYear || undefined };
}

export function analyticsWindow(range: AnalyticsRange, now = new Date()) {
  const local = new Date(now.getTime() + EAT_OFFSET);
  const year = local.getUTCFullYear();
  const month = local.getUTCMonth();
  const count = range === 'all' ? 12 : Number(range.slice(0, -1));
  const trendStart = new Date(Date.UTC(year, month - count + 1, 1) - EAT_OFFSET);
  const start = range === 'all' ? null : trendStart;
  const previousStart = start ? new Date(start.getTime() - (now.getTime() - start.getTime())) : null;
  const months = Array.from({ length: count }, (_, index) => new Date(Date.UTC(year, month - count + 1 + index, 1)).toISOString().slice(0, 7));
  return { start, end: now, trendStart, previousStart, months };
}

export function reportRows(data: AnalyticsData, type: ReportType) {
  if (type === 'summary') return [
    { name: 'Registered alumni', count: data.summary.total },
    { name: 'Institutions represented', count: data.summary.institutions },
    { name: 'Departments represented', count: data.summary.departments },
    { name: 'Locations represented', count: data.summary.locations },
  ];
  if (type === 'monthly') return data.monthly.map(item => ({ name: item.month, count: item.count }));
  return data[type];
}

// Spreadsheet programs interpret leading formula characters, even inside CSV quotes.
export function csvCell(value: string | number) {
  let text = String(value);
  if (typeof value === 'string' && /^[\s]*[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function analyticsReportCsv(data: AnalyticsData, type: ReportType) {
  const headers = [reportDefinitions[type].column, type === 'summary' ? 'Value' : 'Alumni'];
  if (type !== 'summary') headers.push('Share (%)');
  headers.push('Registration period', 'Institution filter', 'Graduation year filter', 'Generated at (EAT)');
  const generatedAt = new Date(data.generatedAt).toLocaleString('en-GB', { timeZone: 'Africa/Addis_Ababa', hour12: false });
  const rows: (string | number)[][] = reportRows(data, type).map(row => {
    const values: (string | number)[] = [row.name, row.count];
    if (type !== 'summary') values.push(data.summary.total ? Number((row.count / data.summary.total * 100).toFixed(2)) : 0);
    return [...values, type === 'monthly' ? data.period.trendLabel : data.period.label, data.filters.university || 'All institutions', data.filters.graduationYear || 'All years', generatedAt];
  });
  return '\uFEFF' + [headers, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n');
}
