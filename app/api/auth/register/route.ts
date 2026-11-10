import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken, createAuthResponse } from '@/lib/auth';
import { validateRegistration } from '@/lib/auth-validation';

const duplicateEmail = () => createAuthResponse({
  message: 'An account with this email already exists. Sign in instead.',
  fieldErrors: { email: 'This email is already registered.' },
}, 409);

export async function POST(req: NextRequest) {
  const validation = validateRegistration(await req.json().catch(() => null));
  if (!validation.success) return createAuthResponse({
    message: 'Please check the highlighted fields.', fieldErrors: validation.fieldErrors,
  }, 400);

  try {
    await dbConnect();
    const { email, password, firstName, lastName } = validation.data;
    if (await User.findOne({ email })) return duplicateEmail();

    // Public signup always creates a regular account; roles are not client-controlled.
    const user = await User.create({ email, password, firstName, lastName, role: 'user' });
    const token = generateToken({ userId: user._id.toString(), email: user.email, role: user.role });
    return createAuthResponse({
      message: 'Your account is ready.',
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    }, 201, token);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) return duplicateEmail();
    console.error('Account registration failed:', error);
    return createAuthResponse({ message: 'We could not create your account. Please try again.' }, 500);
  }
}
