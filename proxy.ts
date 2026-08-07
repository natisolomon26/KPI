// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, getAuthCookie } from './lib/auth';

export async function proxy(request: NextRequest) {
  const token = await getAuthCookie();
  const path = request.nextUrl.pathname;
  
  // Public routes that don't require authentication
 const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/registrations',
];
  
  // Check if the current path is public
  const isPublicRoute = publicRoutes.includes(path) || 
                        publicRoutes.some(route => path.startsWith(route + '/'));

  // Public API routes (auth endpoints)
  const isAuthApiRoute = path.startsWith('/api/auth');

  // If it's a public route or auth API, allow access
  if (isPublicRoute || isAuthApiRoute) {
    return NextResponse.next();
  }

  // Protected API routes (all /api/* except auth)
  const isApiRoute = path.startsWith('/api');
  const isProtectedApi = isApiRoute && !isAuthApiRoute;

  // Check authentication for protected routes
  if (isProtectedApi) {
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    return NextResponse.next();
  }

  // Check authentication for protected pages (dashboard, admin, etc.)
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check admin routes
  if (path.startsWith('/dashboard/admin') && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|logo|images|books).*)',
  ],
};