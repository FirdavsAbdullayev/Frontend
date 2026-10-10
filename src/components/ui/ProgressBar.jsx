import { cn } from '../../lib/cn';

const TONES = {
  brand: 'from-brand-500 to-brand-600',
  success: 'from-emerald-400 to-emerald-500',
  warning: 'from-amber-400 to-amber-500',
  danger: 'from-rose-400 to-rose-500',
};

export default function ProgressBar({ value = 0, className, tone = 'brand' }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800', className)}>
      <div
        className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-500', TONES[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
