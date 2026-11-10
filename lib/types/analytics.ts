export type AnalyticsRange = '3m' | '6m' | '12m' | 'all';
export type ReportType = 'summary' | 'monthly' | 'institutions' | 'departments' | 'locations' | 'cohorts';

export interface AnalyticsFilters {
  range: AnalyticsRange;
  university?: string;
  graduationYear?: string;
}
export interface AnalyticsBucket { name: string; count: number }
export interface AnalyticsData {
  generatedAt: string;
  filters: AnalyticsFilters;
  period: { label: string; start: string | null; end: string; trendLabel: string };
  summary: { total: number; institutions: number; departments: number; locations: number; previousTotal: number | null; growthPercent: number | null };
  monthly: { month: string; count: number }[];
  institutions: AnalyticsBucket[];
  departments: AnalyticsBucket[];
  locations: AnalyticsBucket[];
  cohorts: AnalyticsBucket[];
  options: { institutions: string[]; graduationYears: string[] };
}
