import type { PipelineStage } from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';
import { analyticsWindow, rangeLabels } from '@/lib/analytics';
import type { AnalyticsBucket, AnalyticsData, AnalyticsFilters } from '@/lib/types/analytics';

type Group = { _id: string; count: number };
interface Facets {
  total: { count: number }[];
  previous: { count: number }[];
  monthly: Group[];
  institutions: Group[];
  departments: Group[];
  locations: Group[];
  cohorts: Group[];
  institutionOptions: { _id: string }[];
  yearOptions: { _id: string }[];
}

export async function getAnalyticsData(filters: AnalyticsFilters, now = new Date()): Promise<AnalyticsData> {
  const window = analyticsWindow(filters.range, now);
  const dimensions: Record<string, unknown> = {};
  if (filters.university) dimensions.university = filters.university;
  if (filters.graduationYear) dimensions.graduationYear = filters.graduationYear;
  const match = { ...dimensions, registeredAt: { ...(window.start ? { $gte: window.start } : {}), $lt: window.end } };
  const breakdown = (field: string): PipelineStage.FacetPipelineStage[] => [
    { $match: match },
    { $group: { _id: { $let: { vars: { value: { $trim: { input: { $ifNull: [`$${field}`, ''] } } } }, in: { $cond: [{ $eq: ['$$value', ''] }, 'Not specified', '$$value'] } } }, count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
  ];
  const pipeline: PipelineStage[] = [{ $facet: {
    total: [{ $match: match }, { $count: 'count' }],
    previous: window.start ? [
      { $match: { ...dimensions, registeredAt: { $gte: window.previousStart, $lt: window.start } } }, { $count: 'count' },
    ] : [{ $match: { _id: { $exists: false } } }, { $count: 'count' }],
    monthly: [
      { $match: { ...match, registeredAt: { $gte: window.trendStart, $lt: window.end } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$registeredAt', timezone: 'Africa/Addis_Ababa' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ],
    institutions: breakdown('university'), departments: breakdown('department'),
    locations: breakdown('currentLocation'), cohorts: breakdown('graduationYear'),
    institutionOptions: [{ $group: { _id: '$university' } }, { $sort: { _id: 1 } }],
    yearOptions: [{ $group: { _id: '$graduationYear' } }, { $sort: { _id: -1 } }],
  } }];
  await dbConnect();
  const [facets] = await Registration.aggregate<Facets>(pipeline);
  const buckets = (items: Group[] = []): AnalyticsBucket[] => items.map(item => ({ name: item._id, count: item.count }));
  const institutions = buckets(facets?.institutions);
  const departments = buckets(facets?.departments);
  const locations = buckets(facets?.locations);
  const total = facets?.total[0]?.count ?? 0;
  const previousTotal = window.start ? facets?.previous[0]?.count ?? 0 : null;
  const represented = (items: AnalyticsBucket[]) => items.filter(item => item.name !== 'Not specified').length;
  return {
    generatedAt: now.toISOString(), filters,
    period: { label: rangeLabels[filters.range], start: window.start?.toISOString() ?? null, end: window.end.toISOString(), trendLabel: filters.range === 'all' ? 'Latest 12 months · all-time totals above' : `${rangeLabels[filters.range]} · includes the current month` },
    summary: { total, institutions: represented(institutions), departments: represented(departments), locations: represented(locations), previousTotal, growthPercent: previousTotal ? Math.round((total - previousTotal) / previousTotal * 1000) / 10 : null },
    monthly: window.months.map(month => ({ month, count: facets?.monthly.find(item => item._id === month)?.count ?? 0 })),
    institutions, departments, locations, cohorts: buckets(facets?.cohorts),
    options: { institutions: (facets?.institutionOptions ?? []).map(item => item._id).filter(Boolean), graduationYears: (facets?.yearOptions ?? []).map(item => item._id).filter(value => /^\d{4}$/.test(value)) },
  };
}
