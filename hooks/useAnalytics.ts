import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { analyticsService, AnalyticsRequestError } from '@/services/analytics.service';
import type { AnalyticsFilters, ReportType } from '@/lib/types/analytics';

export function useAnalytics(filters: AnalyticsFilters) {
  const user = useAuthStore(state => state.user);
  const reset = useAuthStore(state => state.reset);
  const query = useQuery({
    queryKey: ['registrations', user?.id, 'analytics', filters],
    queryFn: ({ signal }) => analyticsService.get(filters, signal),
    enabled: user?.role === 'admin',
    staleTime: 60_000,
    retry: (count, error) => !(error instanceof AnalyticsRequestError && [401, 403, 400].includes(error.status)) && count < 1,
  });
  const download = useMutation({
    mutationFn: ({ filters, report }: { filters: AnalyticsFilters; report: ReportType }) => analyticsService.export(filters, report),
    onError: error => { if (error instanceof AnalyticsRequestError && error.status === 401) reset(); },
  });
  useEffect(() => {
    if (query.error instanceof AnalyticsRequestError && query.error.status === 401) reset();
  }, [query.error, reset]);
  return { ...query, download, isAdmin: user?.role === 'admin' };
}
