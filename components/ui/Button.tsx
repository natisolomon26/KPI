import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary: 'border-transparent bg-slate-900 text-white shadow-sm hover:bg-slate-700',
  secondary: 'border-transparent bg-sky-50 text-sky-800 hover:bg-sky-100',
  outline: 'border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50',
  ghost: 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900',
  danger: 'border-transparent bg-red-600 text-white shadow-sm hover:bg-red-700',
};
const sizes = {
  sm: 'min-h-8 px-3 py-1.5 text-xs',
  md: 'min-h-10 px-4 py-2.5 text-xs',
  lg: 'min-h-12 px-5 py-3 text-sm',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  children, variant = 'primary', size = 'md', isLoading = false,
  fullWidth = false, className = '', disabled, type = 'button', ...props
}, ref) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});
