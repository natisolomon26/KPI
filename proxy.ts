import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const session = token ? verifyToken(token) : null;
  if (!session) return NextResponse.redirect(new URL('/login', request.url));
  const adminRoutes = ['/dashboard/analytics', '/dashboard/users', '/dashboard/reports', '/dashboard/admin'];
  if (session.role !== 'admin' && adminRoutes.some(path => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + '/'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*'] };
