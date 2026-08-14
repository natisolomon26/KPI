// middleware.ts (renamed from proxy.ts)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, getAuthCookie } from './lib/auth';

export async function middleware(request: NextRequest) {
  const token = await getAuthCookie();
  const path = request.nextUrl.pathname;
  const method = request.method || 'GET';
  
  // Public API routes that don't need authentication
  // Allow POST to /api/registrations without auth
  if (path === '/api/registrations' && method === 'POST') {
    return NextResponse.next();
  }
  
  // Allow all other API routes to pass through (let routes handle auth)
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Public page routes
  const publicPages = ['/', '/login', '/register', '/registrations'];
  const isPublicPage = publicPages.includes(path) || 
                       publicPages.some(route => path.startsWith(route + '/'));
  
  if (isPublicPage) {
    return NextResponse.next();
  }

  // Protected pages - require authentication
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin routes check
  if (path.startsWith('/dashboard/admin') && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|logo|images|books).*)',
  ],
};