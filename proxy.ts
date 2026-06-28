// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, getAuthCookie } from './lib/auth';

export async function proxy(request: NextRequest) {
  // Get token from cookies (async)
  const token = await getAuthCookie();
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/api/auth/login', '/api/auth/register'];
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Protected API routes
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isProtectedApi = isApiRoute && !isPublicRoute;

  // Handle authentication for protected routes
  if (isProtectedApi || !isPublicRoute) {
    if (!token) {
      if (isApiRoute) {
        return NextResponse.json(
          { message: 'Authentication required' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = verifyToken(token);
    if (!payload) {
      if (isApiRoute) {
        return NextResponse.json(
          { message: 'Invalid or expired token' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check admin routes
    if (request.nextUrl.pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};