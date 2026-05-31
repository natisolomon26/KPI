// lib/auth.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthResult {
  isAuthenticated: boolean;
  user?: {
    email: string;
    role: string;
  };
  error?: string;
}

export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Get token from cookies or Authorization header
    const token = request.cookies.get('auth-token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return { isAuthenticated: false, error: 'No token provided' };
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      email: string;
      role: string;
      iat: number;
      exp: number;
    };

    return {
      isAuthenticated: true,
      user: {
        email: decoded.email,
        role: decoded.role,
      },
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return { isAuthenticated: false, error: 'Invalid or expired token' };
  }
}