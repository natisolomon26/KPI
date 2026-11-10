import type { HTMLAttributes, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react';

export function Table({ children, className = '', ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-left ${className}`} {...props}>{children}</table>
    </div>
  );
}

export function TableHeader({ className = '', ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={`bg-slate-50/80 ${className}`} {...props} />;
}

export function TableBody({ className = '', ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={`divide-y divide-slate-100 ${className}`} {...props} />;
}

export function TableRow({ className = '', ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={`transition-colors hover:bg-sky-50/40 ${className}`} {...props} />;
}

export function TableHead({ className = '', scope = 'col', ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th scope={scope} className={`px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 ${className}`} {...props} />;
}

export function TableCell({ className = '', ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`px-5 py-4 text-xs text-slate-600 ${className}`} {...props} />;
}
