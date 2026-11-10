'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Download, RefreshCw, UserPlus, CalendarDays, Mail, Phone, MapPin, GraduationCap, ChevronLeft, ChevronRight, Users, Globe2, Trash2, Pencil, ShieldCheck, SlidersHorizontal, X, ArrowUpRight, AlertCircle, FileSpreadsheet, Inbox, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { RegistrationForm } from '@/components/dashboard/RegistrationForm';
import { useRegistrations, useRegistrationQuery } from '@/hooks/useRegistrations';
import { useAuthStore } from '@/store/auth.store';
import { allInstitutions } from '@/data/campus';
import type { Registration, RegistrationRequest } from '@/lib/types/api';
import type { RegistrationFilters } from '@/services/registration.service';

type DialogState = { type: 'add' | 'export' } | { type: 'view' | 'edit' | 'delete'; registration: Registration } | null;
interface DirectoryState {
  search: string;
  university: string;
  graduationYear: string;
  sort: NonNullable<RegistrationFilters['sort']>;
  page: number;
  limit: number;
}
const initialFilters: DirectoryState = { search: '', university: '', graduationYear: '', sort: 'newest', page: 1, limit: 10 };
const selectClass = 'min-w-0 rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-7 text-xs text-slate-600 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-50';
const formatDate = (value: string) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Africa/Addis_Ababa' });

function AlumniAvatar({ registration, large = false }: { registration: Registration; large?: boolean }) {
  const palettes = ['bg-sky-50 text-sky-700 ring-sky-100', 'bg-violet-50 text-violet-700 ring-violet-100', 'bg-emerald-50 text-emerald-700 ring-emerald-100', 'bg-amber-50 text-amber-700 ring-amber-100'];
  const color = (registration.firstName.charCodeAt(0) || 0) % palettes.length;
  return <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full font-semibold ring-1 ring-inset ${palettes[color]} ${large ? 'h-16 w-16 text-xl' : 'h-10 w-10 text-xs'}`}>{registration.firstName[0]}{registration.lastName[0]}</span>;
}

function RowActions({ registration, isAdmin, onOpen }: { registration: Registration; isAdmin: boolean; onOpen: (dialog: DialogState) => void }) {
  const name = `${registration.firstName} ${registration.lastName}`;
  return (
    <div className="flex items-center justify-end gap-1">
      <button type="button" onClick={() => onOpen({ type: 'view', registration })} aria-label={`View ${name}`} title="View details" className="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"><Eye className="h-4 w-4" /></button>
      {isAdmin && <>
        <button type="button" onClick={() => onOpen({ type: 'edit', registration })} aria-label={`Edit ${name}`} title="Edit registration" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"><Pencil className="h-3.5 w-3.5" /></button>
        <button type="button" onClick={() => onOpen({ type: 'delete', registration })} aria-label={`Delete ${name}`} title="Delete registration" className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
      </>}
    </div>
  );
}

function RegistrationDetails({ registration }: { registration: Registration }) {
  const fields = [
    { label: 'Email address', value: registration.email, href: `mailto:${registration.email}`, icon: Mail },
    { label: 'Phone number', value: registration.phoneNumber, href: `tel:${registration.phoneNumber}`, icon: Phone },
    { label: 'Institution', value: registration.university, icon: Building2 },
    { label: 'Campus', value: registration.campus, icon: GraduationCap },
    { label: 'Department', value: registration.department, icon: GraduationCap },
    { label: 'Current location', value: registration.currentLocation, icon: MapPin },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-2xl border border-sky-100/70 bg-sky-50/50 p-5">
        <AlumniAvatar registration={registration} large />
        <div className="min-w-0"><h3 className="break-words text-lg font-semibold text-slate-900">{registration.firstName} {registration.lastName}</h3><span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white bg-white/80 px-2.5 py-1 text-[10px] font-medium text-sky-700"><GraduationCap className="h-3 w-3" />Class of {registration.graduationYear}</span></div>
      </div>
      <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        {fields.map(({ label, value, href, icon: Icon }) => <div key={label} className="flex min-w-0 items-start gap-3"><span className="mt-0.5 rounded-lg bg-slate-50 p-2 text-slate-400"><Icon className="h-4 w-4" /></span><div className="min-w-0"><dt className="text-[10px] font-medium text-slate-400">{label}</dt><dd className="mt-1 break-words text-xs leading-relaxed text-slate-700">{href ? <a href={href} className="hover:text-sky-700 hover:underline">{value}</a> : value || '—'}</dd></div></div>)}
      </dl>
      <div className="flex flex-wrap justify-between gap-2 rounded-xl bg-slate-50 px-4 py-3 text-[10px] text-slate-400"><span>Registered {formatDate(registration.registeredAt)}</span><span>Updated {formatDate(registration.updatedAt || registration.registeredAt)}</span></div>
    </div>
  );
}

export default function RegistrationsPage() {
  const isAdmin = useAuthStore(state => state.user?.role === 'admin');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<DirectoryState>(initialFilters);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [deleteError, setDeleteError] = useState('');
  const { deleteRegistration, updateRegistration, submitRegistration, exportRegistrations } = useRegistrations();
  const { data, isPending, isFetching, isPlaceholderData, error, refetch, dataUpdatedAt } = useRegistrationQuery(filters.search, filters.page, filters.limit, {
    university: filters.university, graduationYear: filters.graduationYear, sort: filters.sort,
  });
  const registrations = data?.data ?? [];
  const stats = data?.stats;
  const pagination = data?.pagination;
  const totalPages = Math.max(1, pagination?.pages ?? 1);
  const hasFilters = !!(searchInput.trim() || filters.university || filters.graduationYear);
  const isSaving = submitRegistration.isPending || updateRegistration.isPending;
  const currentYear = new Date().getFullYear();
  const pageNumbers = [...new Set([1, filters.page - 1, filters.page, filters.page + 1, totalPages])].filter(page => page >= 1 && page <= totalPages).sort((a, b) => a - b);
  const showingFrom = pagination?.total ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const showingTo = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const search = searchInput.trim();
      setFilters(previous => previous.search === search ? previous : { ...previous, search, page: 1 });
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const changeFilter = <K extends keyof DirectoryState>(field: K, value: DirectoryState[K]) => {
    setFilters(previous => ({ ...previous, [field]: value, page: 1 }));
  };
  const clearFilters = () => {
    setSearchInput('');
    setFilters(previous => ({ ...initialFilters, limit: previous.limit, sort: previous.sort }));
  };
  const openDialog = (next: DialogState) => { setDeleteError(''); setDialog(next); };

  const saveRegistration = async (values: RegistrationRequest) => {
    if (!isAdmin) throw new Error('Administrator access is required.');
    if (dialog?.type === 'edit') {
      await updateRegistration.mutateAsync({ id: dialog.registration._id, data: values });
      toast.success('Registration updated');
    } else {
      await submitRegistration.mutateAsync(values);
      toast.success('Alumnus added to the community');
    }
    setDialog(null);
  };
  const confirmDelete = async () => {
    if (dialog?.type !== 'delete' || !isAdmin) return;
    setDeleteError('');
    try {
      await deleteRegistration.mutateAsync(dialog.registration._id);
      if (registrations.length === 1 && filters.page > 1) setFilters(previous => ({ ...previous, page: previous.page - 1 }));
      toast.success('Registration deleted');
      setDialog(null);
    } catch (error) { setDeleteError(error instanceof Error ? error.message : 'Unable to delete this registration.'); }
  };
  const downloadExport = async () => {
    try {
      const blob = await exportRegistrations.mutateAsync();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `evasue-alumni-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success('Alumni CSV downloaded');
      setDialog(null);
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to export registrations.'); }
  };
  const summary = [
    { label: 'Total alumni', value: stats?.total, icon: Users, colors: 'bg-sky-50 text-sky-700', note: 'Across the community' },
    { label: 'Institutions', value: stats?.universities, icon: GraduationCap, colors: 'bg-violet-50 text-violet-600', note: 'Universities & colleges' },
    { label: 'Joined this month', value: stats?.thisMonth, icon: CalendarDays, colors: 'bg-emerald-50 text-emerald-600', note: 'New connections' },
    { label: 'Locations', value: stats?.countries, icon: Globe2, colors: 'bg-amber-50 text-amber-600', note: 'Places alumni call home' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-700">Your alumni community</p>
          <div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Alumni registrations</h1><span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium ${isAdmin ? 'border-sky-100 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white text-slate-500'}`}>{isAdmin ? <ShieldCheck className="h-3 w-3" /> : <Eye className="h-3 w-3" />}{isAdmin ? 'Admin access' : 'View access'}</span></div>
          <p className="mt-2 text-sm text-slate-500">Find familiar faces, explore connections, and keep your community up to date.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled={!stats?.total || exportRegistrations.isPending} onClick={() => openDialog({ type: 'export' })}><Download className="h-4 w-4" />Export CSV</Button>
          {isAdmin && <Button onClick={() => openDialog({ type: 'add' })}><UserPlus className="h-4 w-4" />Add alumnus</Button>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {summary.map(({ label, value, icon: Icon, colors, note }) => <Card key={label} className="p-4 sm:p-5"><div className="flex items-center justify-between gap-2"><span className="text-[11px] font-medium text-slate-500">{label}</span><span className={`rounded-xl p-2 ${colors}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{isPending ? <span className="block h-8 w-16 animate-pulse rounded-lg bg-slate-100" aria-label="Loading" /> : value?.toLocaleString() ?? '—'}</p><p className="mt-1 text-[10px] text-slate-400">{note}</p></Card>)}
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5"><h2 className="text-sm font-semibold">Registration directory</h2><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium tabular-nums text-slate-500">{pagination?.total?.toLocaleString() ?? '—'}</span></div>
            <Button variant="ghost" size="sm" aria-label="Refresh registrations" title="Refresh registrations" disabled={isFetching} onClick={() => void refetch()}><RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} /><span className="hidden sm:inline">Refresh</span></Button>
          </div>
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input aria-label="Search alumni" value={searchInput} onChange={event => setSearchInput(event.target.value)} placeholder="Search by name, email, phone…" className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-50" />
              {searchInput && <button type="button" aria-label="Clear search" onClick={() => { setSearchInput(''); changeFilter('search', ''); }} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-3.5 w-3.5" /></button>}
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] xl:w-[520px]">
              <select aria-label="Filter by institution" value={filters.university} onChange={event => changeFilter('university', event.target.value)} className={`${selectClass} col-span-2 sm:col-span-1`}><option value="">All institutions</option>{allInstitutions.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}</select>
              <select aria-label="Filter by graduation year" value={filters.graduationYear} onChange={event => changeFilter('graduationYear', event.target.value)} className={selectClass}><option value="">All class years</option>{Array.from({ length: 70 }, (_, index) => currentYear - index).map(year => <option key={year} value={year}>Class of {year}</option>)}</select>
              <select aria-label="Sort registrations" value={filters.sort} onChange={event => changeFilter('sort', event.target.value as DirectoryState['sort'])} className={selectClass}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="name">Name A–Z</option></select>
            </div>
          </div>
          {hasFilters && <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px]"><SlidersHorizontal className="mr-1 h-3.5 w-3.5 text-slate-400" />{filters.university && <button onClick={() => changeFilter('university', '')} className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-sky-50 px-2.5 py-1.5 text-sky-700" aria-label="Remove institution filter"><span className="truncate">{filters.university}</span><X className="h-3 w-3 shrink-0" /></button>}{filters.graduationYear && <button onClick={() => changeFilter('graduationYear', '')} className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1.5 text-violet-700" aria-label="Remove graduation year filter">Class of {filters.graduationYear}<X className="h-3 w-3" /></button>}<button onClick={clearFilters} className="ml-auto px-1 py-1.5 font-medium text-slate-400 hover:text-slate-700">Clear all filters</button></div>}
        </div>

        {error && <div role="alert" className="m-4 flex flex-wrap items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-xs text-red-700"><AlertCircle className="h-4 w-4" /><span className="flex-1">{error.message}</span><button onClick={() => void refetch()} className="font-semibold underline">Try again</button></div>}
        <div aria-busy={isFetching} className={`transition-opacity ${isPlaceholderData ? 'opacity-50' : ''}`}>
          <div className="hidden md:block">
            <Table aria-label="Alumni registrations">
              <TableHeader><TableRow><TableHead>Alumnus</TableHead><TableHead>Institution</TableHead><TableHead>Department & class</TableHead><TableHead>Location</TableHead><TableHead>Joined</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {isPending ? Array.from({ length: 5 }, (_, index) => <TableRow key={index}><TableCell colSpan={6}><div className="flex items-center gap-4"><div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" /><div className="h-8 flex-1 animate-pulse rounded-lg bg-slate-50" /></div></TableCell></TableRow>) : registrations.map(registration => <TableRow key={registration._id}>
                  <TableCell><div className="flex items-center gap-3"><AlumniAvatar registration={registration} /><div className="min-w-0"><button onClick={() => openDialog({ type: 'view', registration })} className="whitespace-nowrap text-left text-xs font-semibold text-slate-800 hover:text-sky-700">{registration.firstName} {registration.lastName}</button><a href={`mailto:${registration.email}`} className="mt-1 block text-[10px] text-slate-400 hover:text-sky-700">{registration.email}</a></div></div></TableCell>
                  <TableCell className="min-w-44 max-w-64"><span className="block text-xs leading-relaxed text-slate-600">{registration.university}</span><span className="mt-1 block text-[10px] text-slate-400">{registration.campus}</span></TableCell>
                  <TableCell className="min-w-36"><span className="block text-xs text-slate-600">{registration.department}</span><span className="mt-1.5 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">Class of {registration.graduationYear}</span></TableCell>
                  <TableCell className="min-w-36 max-w-48"><span className="flex items-start gap-1.5 text-[11px] leading-relaxed"><MapPin className="mt-0.5 h-3 w-3 shrink-0 text-slate-300" />{registration.currentLocation}</span></TableCell>
                  <TableCell className="whitespace-nowrap text-[10px] text-slate-400">{formatDate(registration.registeredAt)}</TableCell>
                  <TableCell><RowActions registration={registration} isAdmin={isAdmin} onOpen={openDialog} /></TableCell>
                </TableRow>)}
              </TableBody>
            </Table>
          </div>
          <div className="space-y-3 bg-slate-50/50 p-4 md:hidden">
            {isPending ? [1, 2, 3].map(item => <div key={item} className="h-40 animate-pulse rounded-xl border border-slate-100 bg-white" />) : registrations.map(registration => <article key={registration._id} className="rounded-xl border border-slate-200/70 bg-white p-4">
              <div className="flex items-center gap-3"><AlumniAvatar registration={registration} /><div className="min-w-0 flex-1"><button onClick={() => openDialog({ type: 'view', registration })} className="text-left text-sm font-semibold text-slate-800">{registration.firstName} {registration.lastName}</button><p className="mt-1 truncate text-[10px] text-slate-400">{registration.email}</p></div><span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">{registration.graduationYear}</span></div>
              <div className="mt-4 space-y-2 text-[11px] text-slate-500"><p className="flex items-start gap-2"><GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300" /><span>{registration.university}<span className="mt-0.5 block text-[10px] text-slate-400">{registration.department}</span></span></p><p className="flex items-start gap-2"><MapPin className="h-3.5 w-3.5 shrink-0 text-slate-300" />{registration.currentLocation}</p></div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2"><span className="text-[10px] text-slate-400">Joined {formatDate(registration.registeredAt)}</span><RowActions registration={registration} isAdmin={isAdmin} onOpen={openDialog} /></div>
            </article>)}
          </div>
        </div>

        {!isPending && !registrations.length && !error && <div className="px-5 py-14 text-center"><span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400">{hasFilters ? <Search className="h-6 w-6" /> : <Inbox className="h-6 w-6" />}</span><h3 className="text-sm font-semibold text-slate-800">{hasFilters ? 'No matching alumni' : 'A community waiting to grow'}</h3><p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-slate-400">{hasFilters ? 'Try a different name, institution, or graduation year.' : 'Add your first alumnus or share the public registration form to get started.'}</p><div className="mt-5">{hasFilters ? <Button variant="outline" size="sm" onClick={clearFilters}>Clear filters</Button> : filters.page > 1 ? <Button variant="outline" size="sm" onClick={() => setFilters(previous => ({ ...previous, page: 1 }))}>Back to first page</Button> : <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700">Open registration form<ArrowUpRight className="h-3.5 w-3.5" /></Link>}</div></div>}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-3"><label className="flex items-center gap-2 text-[10px] text-slate-400">Rows per page<select aria-label="Rows per page" value={filters.limit} onChange={event => changeFilter('limit', Number(event.target.value))} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-400">{[10, 25, 50].map(limit => <option key={limit} value={limit}>{limit}</option>)}</select></label><p role="status" aria-live="polite" className="text-[10px] tabular-nums text-slate-400">{isFetching ? 'Updating results…' : `${showingFrom}–${showingTo} of ${(pagination?.total ?? 0).toLocaleString()} alumni`}</p></div>
          <nav aria-label="Registration pages" className="flex items-center gap-1"><Button variant="outline" size="sm" aria-label="Previous page" disabled={filters.page <= 1 || isFetching} onClick={() => setFilters(previous => ({ ...previous, page: previous.page - 1 }))}><ChevronLeft className="h-3.5 w-3.5" /></Button><span className="px-3 text-xs tabular-nums text-slate-500 sm:hidden">{filters.page} / {totalPages}</span><div className="hidden items-center gap-1 sm:flex">{pageNumbers.map((page, index) => <span key={page} className="flex items-center gap-1">{index > 0 && page - pageNumbers[index - 1] > 1 && <span className="px-1 text-xs text-slate-300">…</span>}<button aria-label={`Page ${page}`} aria-current={filters.page === page ? 'page' : undefined} disabled={isFetching} onClick={() => setFilters(previous => ({ ...previous, page }))} className={`h-8 min-w-8 rounded-lg px-2 text-xs font-medium tabular-nums transition disabled:opacity-50 ${filters.page === page ? 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-100' : 'text-slate-400 hover:bg-slate-100'}`}>{page}</button></span>)}</div><Button variant="outline" size="sm" aria-label="Next page" disabled={filters.page >= totalPages || isFetching} onClick={() => setFilters(previous => ({ ...previous, page: previous.page + 1 }))}><ChevronRight className="h-3.5 w-3.5" /></Button></nav>
        </div>
      </Card>

      <footer className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400"><span>Every registration is a new connection.</span><span>{dataUpdatedAt ? `Updated ${new Date(dataUpdatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Addis_Ababa' })} EAT` : 'Waiting for data'}</span></footer>

      <Modal isOpen={dialog?.type === 'view'} onClose={() => setDialog(null)} title="Alumni profile" description="Contact details and education at a glance." size="lg">
        {dialog?.type === 'view' && <><RegistrationDetails registration={dialog.registration} /><div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-5"><Button variant="outline" onClick={() => setDialog(null)}>Close</Button>{isAdmin && <Button onClick={() => openDialog({ type: 'edit', registration: dialog.registration })}><Pencil className="h-3.5 w-3.5" />Edit registration</Button>}</div></>}
      </Modal>
      {isAdmin && <>
        <Modal isOpen={dialog?.type === 'add' || dialog?.type === 'edit'} onClose={() => setDialog(null)} title={dialog?.type === 'edit' ? 'Edit registration' : 'Welcome a new alumnus'} description="Keep the community connected with accurate contact and education details." size="lg" dismissible={!isSaving}>
          {(dialog?.type === 'add' || dialog?.type === 'edit') && <RegistrationForm key={dialog.type === 'edit' ? dialog.registration._id : 'new'} initialData={dialog.type === 'edit' ? dialog.registration : undefined} onSave={saveRegistration} onCancel={() => setDialog(null)} isSaving={isSaving} />}
        </Modal>
        <Modal isOpen={dialog?.type === 'delete'} onClose={() => setDialog(null)} title="Delete registration" description="This will permanently remove the alumni record." size="sm" dismissible={!deleteRegistration.isPending}>
          {dialog?.type === 'delete' && <div className="space-y-5"><div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50/50 p-4"><AlumniAvatar registration={dialog.registration} /><div className="min-w-0"><p className="text-sm font-semibold text-slate-800">{dialog.registration.firstName} {dialog.registration.lastName}</p><p className="mt-1 break-all text-[11px] text-slate-500">{dialog.registration.email}</p></div></div><p className="text-xs leading-relaxed text-slate-500">Delete this registration? This action cannot be undone.</p>{deleteError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{deleteError}</p>}<div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><Button variant="outline" disabled={deleteRegistration.isPending} onClick={() => setDialog(null)}>Keep record</Button><Button variant="danger" isLoading={deleteRegistration.isPending} onClick={confirmDelete}>{deleteRegistration.isPending ? 'Deleting…' : 'Delete registration'}</Button></div></div>}
        </Modal>
      </>}
      <Modal isOpen={dialog?.type === 'export'} onClose={() => setDialog(null)} title="Export your alumni community" description="Download all registrations as a spreadsheet-ready CSV file." size="sm" dismissible={!exportRegistrations.isPending}>
        <div className="space-y-5"><div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5"><span className="rounded-xl bg-white p-3 text-emerald-600"><FileSpreadsheet className="h-6 w-6" /></span><div><p className="text-lg font-semibold tabular-nums text-slate-800">{stats?.total?.toLocaleString() ?? 0} alumni</p><p className="mt-1 text-[11px] text-slate-500">All records · CSV format</p></div></div><p className="text-xs leading-relaxed text-slate-500">Includes contact information, institution, campus, department, graduation year, and location. Current search and filters do not limit this export.</p><div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><Button variant="outline" disabled={exportRegistrations.isPending} onClick={() => setDialog(null)}>Cancel</Button><Button onClick={downloadExport} isLoading={exportRegistrations.isPending}>{!exportRegistrations.isPending && <Download className="h-4 w-4" />}{exportRegistrations.isPending ? 'Preparing CSV…' : 'Download CSV'}</Button></div></div>
      </Modal>
    </div>
  );
}
