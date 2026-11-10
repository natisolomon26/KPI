import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { analyticsReportCsv, parseAnalyticsFilters, reportDefinitions } from '@/lib/analytics';
import { getAnalyticsData } from '@/lib/analytics-data';
import type { ReportType } from '@/lib/types/analytics';

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.isAuthenticated) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  if (auth.user?.role !== 'admin') return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 });
  const report = request.nextUrl.searchParams.get('report') || 'summary';
  if (!Object.hasOwn(reportDefinitions, report)) return NextResponse.json({ error: 'Choose a valid report.' }, { status: 400 });
  let filters;
  try { filters = parseAnalyticsFilters(request.nextUrl.searchParams); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid filters.' }, { status: 400 }); }
  try {
    const data = await getAnalyticsData(filters);
    return new NextResponse(analyticsReportCsv(data, report as ReportType), { headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="evasue-${report}-${data.generatedAt.slice(0, 10)}.csv"`,
      'Cache-Control': 'private, no-store',
    } });
  } catch (error) {
    console.error('Unable to export alumni report:', error);
    return NextResponse.json({ error: 'Unable to generate the report. Please try again.' }, { status: 500 });
  }
}
