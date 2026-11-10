import type { AnalyticsData, AnalyticsFilters, ReportType } from '@/lib/types/analytics';

export class AnalyticsRequestError extends Error {
  constructor(message: string, public status: number) { super(message); this.name = 'AnalyticsRequestError'; }
}

function queryString(filters: AnalyticsFilters) {
  const params = new URLSearchParams({ range: filters.range });
  if (filters.university) params.set('university', filters.university);
  if (filters.graduationYear) params.set('graduationYear', filters.graduationYear);
  return params;
}
async function checkResponse(response: Response) {
  if (response.ok) return;
  const body = await response.json().catch(() => null);
  throw new AnalyticsRequestError(body?.error || 'Unable to load this report. Please try again.', response.status);
}

export const analyticsService = {
  async get(filters: AnalyticsFilters, signal?: AbortSignal): Promise<AnalyticsData> {
    const response = await fetch(`/api/analytics?${queryString(filters)}`, { credentials: 'include', cache: 'no-store', signal });
    await checkResponse(response);
    const body = await response.json();
    return body.data;
  },
  async export(filters: AnalyticsFilters, report: ReportType): Promise<Blob> {
    const params = queryString(filters);
    params.set('report', report);
    const response = await fetch(`/api/analytics/export?${params}`, { credentials: 'include', cache: 'no-store' });
    await checkResponse(response);
    return response.blob();
  },
};
