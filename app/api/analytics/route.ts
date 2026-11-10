import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { parseAnalyticsFilters } from '@/lib/analytics';
import { getAnalyticsData } from '@/lib/analytics-data';

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth.isAuthenticated) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  if (auth.user?.role !== 'admin') return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 });
  let filters;
  try { filters = parseAnalyticsFilters(request.nextUrl.searchParams); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid filters.' }, { status: 400 }); }
  try {
    const data = await getAnalyticsData(filters);
    return NextResponse.json({ success: true, data }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load alumni analytics:', error);
    return NextResponse.json({ error: 'Unable to load analytics. Please try again.' }, { status: 500 });
  }
}
