// app/api/auth/register/route.ts
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken, createAuthResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json().catch(() => ({}));
    const { email, password, firstName, lastName, role } = body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return createAuthResponse(
        { message: 'All fields are required' },
        400
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return createAuthResponse(
        { message: 'User with this email already exists' },
        400
      );
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'user',
    });

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Return user data and set cookie
    return createAuthResponse(
      {
        message: 'Registration successful',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
      201,
      token
    );

  } catch (error) {
    console.error('Registration error:', error);
    return createAuthResponse(
      { message: 'Internal server error' },
      500
    );
  }
}