import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, GraduationCap, HeartHandshake, Loader2, Sparkles, Users } from 'lucide-react';
import type { ReactNode } from 'react';

export function AuthShell({ mode, children }: { mode: 'login' | 'register'; children: ReactNode }) {
  const registering = mode === 'register';
  return (
    <div className="grid min-h-[100dvh] bg-[#f8fafc] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <aside className="relative hidden min-h-screen flex-col overflow-hidden bg-[#0b1729] p-10 text-white lg:flex xl:p-14">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_85%,rgba(14,165,233,0.16),transparent_55%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full border border-white/5" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-white/5" />
        <Link href="/" className="relative z-10 inline-flex w-fit items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400 text-slate-950"><GraduationCap className="h-6 w-6" /></span>
          <span><span className="block text-xl font-bold tracking-tight">EvaSUE<span className="text-sky-300">.</span></span><span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.24em] text-slate-400">Alumni workspace</span></span>
        </Link>
        <div className="relative z-10 my-auto max-w-lg py-12">
          <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-300/5 px-3 py-1.5 text-[10px] font-medium tracking-wide text-sky-200"><Sparkles className="h-3 w-3" />A connection that continues</span>
          <h2 className="text-4xl font-semibold leading-[1.16] tracking-tight xl:text-5xl">A shared past.<br />A stronger<br /><span className="text-sky-300">future together.</span></h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">{registering ? 'Start your next chapter with the EvaSUE community. Create your account and step into your alumni workspace.' : 'Your campus years are part of your story. Stay connected to the people and community that helped shape it.'}</p>
          <div aria-hidden="true" className="relative mt-10 h-48 max-w-sm">
            <div className="absolute inset-x-8 top-4 h-36 rounded-[50%] border border-dashed border-sky-200/15" />
            <div className="absolute left-7 top-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#152840] text-sky-200 shadow-lg"><GraduationCap className="h-6 w-6" /></div>
            <div className="absolute right-7 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200/10 bg-[#153137] text-emerald-200"><HeartHandshake className="h-5 w-5" /></div>
            <div className="absolute bottom-5 left-1/2 flex w-[250px] -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-[#14263c] p-4 shadow-xl shadow-black/10"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-300/10 text-sky-300"><Users className="h-5 w-5" /></span><span><span className="block text-xs font-semibold text-slate-100">Beyond the campus.</span><span className="mt-1 block text-[10px] text-slate-400">A community for your next chapter.</span></span></div>
            <span className="absolute bottom-4 right-5 h-2 w-2 rounded-full bg-sky-300/60" /><span className="absolute left-0 top-24 h-1.5 w-1.5 rounded-full bg-violet-300/60" />
          </div>
        </div>
        <div className="relative flex items-center justify-between gap-4 border-t border-white/10 pt-6 text-[10px] text-slate-400"><span>Evangelical Students Union of Ethiopia</span><span className="flex items-center gap-1 text-slate-500">People. Purpose. Community.</span></div>
      </aside>
      <div className="flex min-w-0 flex-col px-5 py-6 sm:px-10 sm:py-8 lg:px-12 xl:px-20">
        <header className="flex items-center justify-between gap-3">
          <Link href="/" aria-label="EvaSUE home" className="inline-flex items-center gap-2 text-base font-bold text-slate-900 lg:hidden"><span className="rounded-lg bg-sky-400 p-2"><GraduationCap className="h-5 w-5" /></span>EvaSUE<span className="-ml-1 text-sky-500">.</span></Link>
          <Link href="/" className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-slate-500 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"><ArrowLeft className="h-3.5 w-3.5" />Back to home</Link>
        </header>
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10 sm:py-12">{children}</div>
        <footer className="mx-auto w-full max-w-[420px] border-t border-slate-200/80 pt-5 text-center text-[11px] leading-6 text-slate-500">Looking to share your alumni details?{' '}<Link href="/" className="inline-flex items-center gap-0.5 font-medium text-sky-700 hover:text-sky-900">Use the alumni form<ArrowUpRight className="h-3 w-3" /></Link></footer>
      </div>
    </div>
  );
}

export function AuthPending({ authenticated = false }: { authenticated?: boolean }) {
  return <div role="status" className="flex flex-col items-center gap-4 py-20 text-center"><span className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sky-600"><Loader2 className="h-6 w-6 animate-spin" /></span><p className="text-sm font-medium text-slate-600">{authenticated ? 'Opening your workspace…' : 'Getting things ready…'}</p></div>;
}
