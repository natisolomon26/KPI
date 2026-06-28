// app/api/auth/login/route.ts
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken, createAuthResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return createAuthResponse(
        { message: 'Email and password are required' },
        400
      );
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return createAuthResponse(
        { message: 'Invalid email or password' },
        401
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return createAuthResponse(
        { message: 'Invalid email or password' },
        401
      );
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Return user data and set cookie
    return createAuthResponse(
      {
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
      200,
      token
    );

  } catch (error) {
    console.error('Login error:', error);
    return createAuthResponse(
      { message: 'Internal server error' },
      500
    );
  }
}