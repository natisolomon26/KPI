'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, Mail, Smile } from 'lucide-react';
import { AuthShell, AuthPending } from '@/components/auth/AuthShell';
import { AuthField, PasswordField } from '@/components/auth/AuthField';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import type { RegistrationErrors } from '@/types/auth.types';

export default function LoginPage() {
  const { login, hasInitialized, isAuthenticated, isLoading } = useAuth({ redirectIfAuthenticated: true });
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [serverError, setServerError] = useState('');

  const change = (field: 'email' | 'password', value: string) => {
    setValues(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
    setServerError('');
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    const form = event.currentTarget;
    const nextErrors: RegistrationErrors = {};
    if (!values.email.trim()) nextErrors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (!values.password) nextErrors.password = 'Enter your password.';
    setErrors(nextErrors);
    setServerError('');
    if (Object.keys(nextErrors).length) {
      const field = form.elements.namedItem(Object.keys(nextErrors)[0]);
      if (field instanceof HTMLElement) field.focus();
      return;
    }
    try {
      const result = await login(values.email, values.password);
      if (!result.success) {
        setErrors(result.fieldErrors || {});
        setServerError(result.message || 'Unable to sign in. Please try again.');
      }
    } catch { setServerError('Unable to sign in. Please try again.'); }
  };

  return (
    <AuthShell mode="login">
      {!hasInitialized || isAuthenticated ? <AuthPending authenticated={isAuthenticated} /> : <>
        <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-600"><Smile className="h-6 w-6" /></span>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-700">Your community is here</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-[34px]">Welcome back.</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">Good to see you again. Sign in to your EvaSUE workspace.</p>
        <form onSubmit={submit} noValidate aria-label="Sign in" className="mt-8 space-y-5">
          {serverError && <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs leading-relaxed text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{serverError}</div>}
          <fieldset disabled={isLoading} className="min-w-0 space-y-5">
            <AuthField label="Email address" name="email" type="email" icon={Mail} autoComplete="username" autoCapitalize="none" spellCheck={false} required placeholder="you@example.com" value={values.email} onChange={event => change('email', event.target.value)} error={errors.email} />
            <PasswordField name="password" autoComplete="current-password" required placeholder="Enter your password" value={values.password} onChange={event => change('password', event.target.value)} error={errors.password} disabled={isLoading} />
          </fieldset>
          <Button type="submit" fullWidth size="lg" isLoading={isLoading} className="mt-1">{isLoading ? 'Signing you in…' : <>Sign in<ArrowRight className="h-4 w-4" /></>}</Button>
        </form>
        <div className="mt-7 flex items-center gap-3" aria-hidden="true"><div className="h-px flex-1 bg-slate-200/80" /><span className="text-[10px] text-slate-400">A new chapter starts with a connection</span><div className="h-px flex-1 bg-slate-200/80" /></div>
        <p className="mt-6 text-center text-sm text-slate-500">Don&apos;t have an account?{' '}<Link href="/register" className="font-semibold text-sky-700 transition hover:text-sky-900 hover:underline">Create an account</Link></p>
      </>}
    </AuthShell>
  );
}
