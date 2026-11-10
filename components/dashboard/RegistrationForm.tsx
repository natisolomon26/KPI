'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { AlertCircle, BookOpen, UserRound } from 'lucide-react';
import { allInstitutions, getCampusesByUniversity } from '@/data/campus';
import type { RegistrationRequest } from '@/lib/types/api';
import { Button } from '@/components/ui/Button';

const emptyRegistration: RegistrationRequest = {
  firstName: '', lastName: '', email: '', phoneNumber: '', university: '',
  campus: '', department: '', graduationYear: '', currentLocation: '',
};
const controlClass = 'w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 transition placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 aria-[invalid=true]:border-red-300 aria-[invalid=true]:focus:ring-red-50';

type Errors = Partial<Record<keyof RegistrationRequest, string>>;
interface RegistrationFormProps {
  initialData?: Partial<RegistrationRequest>;
  onSave: (data: RegistrationRequest) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-xs font-medium text-slate-600">{label} <span className="text-sky-600" aria-hidden="true">*</span></label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function RegistrationForm({ initialData, onSave, onCancel, isSaving }: RegistrationFormProps) {
  const prefix = useId();
  const [values, setValues] = useState<RegistrationRequest>(() => {
    const fields = { ...emptyRegistration };
    for (const key of Object.keys(fields) as (keyof RegistrationRequest)[]) fields[key] = initialData?.[key] ?? '';
    return fields;
  });
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState('');
  const institution = allInstitutions.find(item => item.name === values.university);
  const campuses = institution?.type === 'university'
    ? getCampusesByUniversity(institution.id)
    : [{ id: 'main-campus', name: 'Main Campus' }];
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Set([
    ...(values.graduationYear ? [values.graduationYear] : []),
    ...Array.from({ length: 70 }, (_, index) => String(currentYear - index)),
  ])).sort((a, b) => Number(b) - Number(a));

  const change = (field: keyof RegistrationRequest, value: string) => {
    setValues(previous => {
      if (field !== 'university') return { ...previous, [field]: value };
      const selected = allInstitutions.find(item => item.name === value);
      const available = selected?.type === 'university' ? getCampusesByUniversity(selected.id) : [{ name: 'Main Campus' }];
      return { ...previous, university: value, campus: value && available.length === 1 ? available[0].name : '' };
    });
    setErrors(previous => ({ ...previous, [field]: undefined, ...(field === 'university' ? { campus: undefined } : {}) }));
    setServerError('');
  };

  const inputProps = (field: keyof RegistrationRequest) => ({
    id: `${prefix}-${field}`,
    name: field,
    value: values[field],
    required: true,
    'aria-invalid': !!errors[field],
    'aria-describedby': errors[field] ? `${prefix}-${field}-error` : undefined,
    className: controlClass,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => change(field, event.target.value),
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const cleaned = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()])) as unknown as RegistrationRequest;
    cleaned.email = cleaned.email.toLowerCase();
    const nextErrors: Errors = {};
    for (const [key, value] of Object.entries(cleaned)) {
      if (!value) nextErrors[key as keyof RegistrationRequest] = 'This field is required.';
    }
    for (const field of ['firstName', 'lastName'] as const) {
      if (cleaned[field] && (cleaned[field].length < 2 || cleaned[field].length > 50)) nextErrors[field] = 'Use between 2 and 50 characters.';
    }
    if (cleaned.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) nextErrors.email = 'Enter a valid email address.';
    if (cleaned.phoneNumber && !/^\+?[\d\s()-]{7,20}$/.test(cleaned.phoneNumber)) nextErrors.phoneNumber = 'Enter a valid phone number.';
    if (cleaned.graduationYear && !/^\d{4}$/.test(cleaned.graduationYear)) nextErrors.graduationYear = 'Choose a valid graduation year.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstInvalid = form.elements.namedItem(Object.keys(nextErrors)[0]);
      if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
      return;
    }
    setServerError('');
    try { await onSave(cleaned); }
    catch (error) { setServerError(error instanceof Error ? error.message : 'Unable to save this registration. Please try again.'); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {serverError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{serverError}</div>}
      <fieldset disabled={isSaving} className="min-w-0 space-y-6">
        <section>
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-800"><span className="rounded-lg bg-sky-50 p-2 text-sky-600"><UserRound className="h-4 w-4" /></span>Personal information</div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" id={`${prefix}-firstName`} error={errors.firstName}><input {...inputProps('firstName')} autoComplete="given-name" placeholder="e.g. Hana" maxLength={50} /></Field>
            <Field label="Last name" id={`${prefix}-lastName`} error={errors.lastName}><input {...inputProps('lastName')} autoComplete="family-name" placeholder="e.g. Tesfaye" maxLength={50} /></Field>
            <Field label="Email address" id={`${prefix}-email`} error={errors.email}><input {...inputProps('email')} type="email" autoComplete="email" placeholder="name@example.com" /></Field>
            <Field label="Phone number" id={`${prefix}-phoneNumber`} error={errors.phoneNumber}><input {...inputProps('phoneNumber')} type="tel" autoComplete="tel" placeholder="+251 9…" /></Field>
            <div className="sm:col-span-2"><Field label="Current location" id={`${prefix}-currentLocation`} error={errors.currentLocation}><input {...inputProps('currentLocation')} placeholder="City, country" /></Field></div>
          </div>
        </section>
        <section className="border-t border-slate-100 pt-5">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-800"><span className="rounded-lg bg-violet-50 p-2 text-violet-600"><BookOpen className="h-4 w-4" /></span>Education</div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field label="Institution" id={`${prefix}-university`} error={errors.university}>
              <select {...inputProps('university')}>
                <option value="">Choose a university or college</option>
                {values.university && !institution && <option value={values.university}>{values.university}</option>}
                {allInstitutions.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
              </select>
            </Field></div>
            <Field label="Campus" id={`${prefix}-campus`} error={errors.campus}>
              <select {...inputProps('campus')} disabled={!values.university || isSaving}>
                <option value="">{values.university ? 'Choose a campus' : 'Choose an institution first'}</option>
                {values.campus && !campuses.some(item => item.name === values.campus) && <option value={values.campus}>{values.campus}</option>}
                {campuses.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
              </select>
            </Field>
            <Field label="Graduation year" id={`${prefix}-graduationYear`} error={errors.graduationYear}>
              <select {...inputProps('graduationYear')}><option value="">Choose a year</option>{years.map(year => <option key={year} value={year}>{year}</option>)}</select>
            </Field>
            <div className="sm:col-span-2"><Field label="Department" id={`${prefix}-department`} error={errors.department}><input {...inputProps('department')} placeholder="e.g. Computer Science" /></Field></div>
          </div>
        </section>
      </fieldset>
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <p className="hidden text-[10px] text-slate-400 sm:block">All fields are required.</p>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>Cancel</Button>
          <Button type="submit" isLoading={isSaving}>{isSaving ? 'Saving…' : initialData ? 'Save changes' : 'Add alumnus'}</Button>
        </div>
      </div>
    </form>
  );
}
