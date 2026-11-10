'use client';

import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Eye, EyeOff, LockKeyhole, type LucideIcon } from 'lucide-react';

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  hint?: string;
  trailing?: ReactNode;
}

export function AuthField({ label, icon: Icon, error, hint, trailing, id, className = '', ...props }: AuthFieldProps) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  return (
    <div className="min-w-0">
      <label htmlFor={fieldId} className="mb-2 block text-xs font-semibold text-slate-700">{label}</label>
      <div className="relative">
        {Icon && <Icon aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
        <input
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          className={`min-h-12 w-full min-w-0 rounded-xl border bg-white py-3 text-sm text-slate-800 shadow-sm shadow-slate-200/10 transition placeholder:text-slate-400 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${Icon ? 'pl-10' : 'pl-3.5'} ${trailing ? 'pr-12' : 'pr-3.5'} ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-50' : 'border-slate-200 focus:border-sky-400 focus:ring-sky-50'} ${className}`}
          {...props}
        />
        {trailing}
      </div>
      {error ? <p id={`${fieldId}-error`} className="mt-1.5 text-xs text-red-600">{error}</p> : hint && <p id={`${fieldId}-hint`} className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{hint}</p>}
    </div>
  );
}

export function PasswordField({ label = 'Password', ...props }: Omit<AuthFieldProps, 'type' | 'trailing' | 'icon' | 'label'> & { label?: string }) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  return <div><AuthField {...props} label={label} icon={LockKeyhole} type={visible ? 'text' : 'password'} onKeyUp={event => setCapsLock(event.getModifierState('CapsLock'))} onBlur={() => setCapsLock(false)} trailing={<button type="button" disabled={props.disabled} aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={visible} onClick={() => setVisible(previous => !previous)} className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:opacity-40">{visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>} />{capsLock && <p role="status" className="mt-1.5 text-[11px] text-amber-700">Caps Lock is on.</p>}</div>;
}
