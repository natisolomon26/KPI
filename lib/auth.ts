// lib/auth.ts
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';
const COOKIE_NAME = 'token';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResult {
  isAuthenticated: boolean;
  user?: JWTPayload;
  error?: string;
}

// Token functions
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Cookie functions
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

// Response helper - FIXED: This is the missing export
export function createAuthResponse(
  data: any,
  status: number = 200,
  token?: string
): NextResponse {
  const response = NextResponse.json(data, { status });
  
  if (token) {
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  }
  
  return response;
}

// Auth verification functions
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const token = await getAuthCookie();

    if (!token) {
      return {
        isAuthenticated: false,
        error: 'No token provided',
      };
    }

    const payload = verifyToken(token);
    if (!payload) {
      return {
        isAuthenticated: false,
        error: 'Invalid or expired token',
      };
    }

    return {
      isAuthenticated: true,
      user: payload,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      error: 'Authentication failed',
    };
  }
}

export async function verifyAdmin(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request);
  
  if (!authResult.isAuthenticated) {
    return authResult;
  }

  if (authResult.user?.role !== 'admin') {
    return {
      isAuthenticated: false,
      error: 'Admin access required',
    };
  }

  return authResult;
}