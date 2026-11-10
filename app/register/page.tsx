'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, CheckCircle2, Mail, UserPlus, UserRound } from 'lucide-react';
import { AuthShell, AuthPending } from '@/components/auth/AuthShell';
import { AuthField, PasswordField } from '@/components/auth/AuthField';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { validateRegistration } from '@/lib/auth-validation';
import type { RegistrationErrors } from '@/types/auth.types';

export default function RegisterPage() {
  const { register, hasInitialized, isAuthenticated, isLoading } = useAuth({ redirectIfAuthenticated: true });
  const [values, setValues] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [serverError, setServerError] = useState('');
  const passwordsMatch = !!values.confirmPassword && values.password === values.confirmPassword;

  const change = (field: keyof typeof values, value: string) => {
    setValues(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined, ...(field === 'password' ? { confirmPassword: undefined } : {}) }));
    setServerError('');
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    const form = event.currentTarget;
    const validation = validateRegistration(values);
    const nextErrors: RegistrationErrors = validation.success ? {} : { ...validation.fieldErrors };
    if (!values.confirmPassword) nextErrors.confirmPassword = 'Confirm your password.';
    else if (values.password !== values.confirmPassword) nextErrors.confirmPassword = 'Your passwords do not match.';
    setErrors(nextErrors);
    setServerError('');
    if (Object.keys(nextErrors).length || !validation.success) {
      const field = form.elements.namedItem(Object.keys(nextErrors)[0]);
      if (field instanceof HTMLElement) field.focus();
      return;
    }
    try {
      const result = await register(validation.data);
      if (!result.success) {
        setErrors(result.fieldErrors || {});
        setServerError(result.message || 'Unable to create your account. Please try again.');
      }
    } catch { setServerError('Unable to create your account. Please try again.'); }
  };

  return (
    <AuthShell mode="register">
      {!hasInitialized || isAuthenticated ? <AuthPending authenticated={isAuthenticated} /> : <>
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-600"><UserPlus className="h-6 w-6" /></span>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-700">Make yourself at home</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-[34px]">Create your account.</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">A few details to get started in your EvaSUE workspace.</p>
        <form onSubmit={submit} noValidate aria-label="Create account" className="mt-7 space-y-4">
          {serverError && <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs leading-relaxed text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{serverError}</div>}
          <fieldset disabled={isLoading} className="min-w-0 space-y-4">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <AuthField label="First name" name="firstName" icon={UserRound} autoComplete="given-name" required maxLength={50} placeholder="First name" value={values.firstName} onChange={event => change('firstName', event.target.value)} error={errors.firstName} />
              <AuthField label="Last name" name="lastName" icon={UserRound} autoComplete="family-name" required maxLength={50} placeholder="Last name" value={values.lastName} onChange={event => change('lastName', event.target.value)} error={errors.lastName} />
            </div>
            <AuthField label="Email address" name="email" type="email" icon={Mail} autoComplete="email" autoCapitalize="none" spellCheck={false} required maxLength={254} placeholder="you@example.com" value={values.email} onChange={event => change('email', event.target.value)} error={errors.email} />
            <PasswordField name="password" autoComplete="new-password" required placeholder="Choose a password" hint="Use at least 8 characters." value={values.password} onChange={event => change('password', event.target.value)} error={errors.password} disabled={isLoading} />
            <PasswordField label="Confirm password" name="confirmPassword" autoComplete="new-password" required placeholder="Re-enter your password" value={values.confirmPassword} onChange={event => change('confirmPassword', event.target.value)} error={errors.confirmPassword} disabled={isLoading} />
            {passwordsMatch && !errors.confirmPassword && <p role="status" className="flex items-center gap-1.5 text-[11px] text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />Passwords match</p>}
          </fieldset>
          <Button type="submit" fullWidth size="lg" isLoading={isLoading} className="mt-1">{isLoading ? 'Creating your account…' : <>Create account<ArrowRight className="h-4 w-4" /></>}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">Already have an account?{' '}<Link href="/login" className="font-semibold text-sky-700 transition hover:text-sky-900 hover:underline">Sign in</Link></p>
      </>}
    </AuthShell>
  );
}
