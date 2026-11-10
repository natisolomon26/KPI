import Link from 'next/link';
import { AlertCircle, ArrowLeft, BarChart3, LockKeyhole } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { AnalyticsBucket } from '@/lib/types/analytics';

export function InsightsError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700"><AlertCircle className="h-4 w-4 shrink-0" /><span className="flex-1">{message}</span><button type="button" onClick={onRetry} className="font-semibold underline">Try again</button></div>;
}
export function AdminAccessNotice() {
  return <Card className="p-10 text-center"><LockKeyhole className="mx-auto mb-4 h-8 w-8 text-slate-400" /><h1 className="text-lg font-semibold">Administrator access required</h1><p className="mt-2 text-sm text-slate-500">Analytics and reports are available to workspace administrators.</p><Link href="/dashboard" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-sky-700"><ArrowLeft className="h-3.5 w-3.5" />Back to overview</Link></Card>;
}
export function EmptyChart({ text = 'No registrations match this selection.' }: { text?: string }) {
  return <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 px-4 text-center text-xs text-slate-500"><BarChart3 className="h-7 w-7 text-slate-300" />{text}</div>;
}
export function RankedList({ items, total, color = 'bg-sky-500', limit = 5 }: { items: AnalyticsBucket[]; total: number; color?: string; limit?: number }) {
  return <div className="space-y-5">{items.slice(0, limit).map((item, index) => <div key={item.name}><div className="mb-2 flex items-start justify-between gap-3"><span className="flex min-w-0 items-start gap-2 text-xs"><span className="mt-0.5 text-[10px] tabular-nums text-slate-400">{String(index + 1).padStart(2, '0')}</span><span className="min-w-0 break-words leading-relaxed text-slate-600">{item.name}</span></span><span className="shrink-0 text-xs font-semibold tabular-nums">{item.count.toLocaleString()}<span className="ml-2 text-[10px] font-normal text-slate-400">{total ? (item.count / total * 100).toFixed(1) : 0}%</span></span></div><div className="ml-6 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${total ? item.count / total * 100 : 0}%` }} /></div></div>)}</div>;
}
export function UpdatedAt({ value }: { value?: string }) {
  return <span>{value ? `Generated ${new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Addis_Ababa' })} EAT` : 'Waiting for data'}</span>;
}
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
