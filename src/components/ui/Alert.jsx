import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '../../lib/cn';

const STYLES = {
  error: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20',
  success:
    'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
  info: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20',
};

const ICONS = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

export default function Alert({ variant = 'info', children, className }) {
  const Icon = ICONS[variant];
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium ring-1 ring-inset',
        STYLES[variant],
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
