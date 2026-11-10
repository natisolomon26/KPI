import type { RegisterCredentials, RegistrationErrors } from '@/types/auth.types';

export function validateRegistration(input: unknown):
  | { success: true; data: RegisterCredentials }
  | { success: false; fieldErrors: RegistrationErrors } {
  const body = input && typeof input === 'object' ? input as Record<string, unknown> : {};
  const data: RegisterCredentials = {
    firstName: typeof body.firstName === 'string' ? body.firstName.trim() : '',
    lastName: typeof body.lastName === 'string' ? body.lastName.trim() : '',
    email: typeof body.email === 'string' ? body.email.trim().toLowerCase() : '',
    password: typeof body.password === 'string' ? body.password : '',
  };
  const fieldErrors: RegistrationErrors = {};
  for (const key of ['firstName', 'lastName'] as const) {
    if (!data[key]) fieldErrors[key] = `${key === 'firstName' ? 'First' : 'Last'} name is required.`;
    else if (data[key].length > 50) fieldErrors[key] = 'Use 50 characters or fewer.';
  }
  if (!data.email) fieldErrors.email = 'Email address is required.';
  else if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) fieldErrors.email = 'Enter a valid email address.';
  if (!data.password) fieldErrors.password = 'Choose a password.';
  else if (Array.from(data.password).length < 8 || !data.password.trim()) fieldErrors.password = 'Use at least 8 characters.';
  else if (new TextEncoder().encode(data.password).length > 72) fieldErrors.password = 'Choose a shorter password.';
  return Object.keys(fieldErrors).length ? { success: false, fieldErrors } : { success: true, data };
}
