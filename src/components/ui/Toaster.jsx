import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useToastStore } from '../../context/ToastContext';
import { cn } from '../../lib/cn';

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    ring: 'ring-emerald-200 dark:ring-emerald-500/30',
    iconTone: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    icon: XCircle,
    ring: 'ring-rose-200 dark:ring-rose-500/30',
    iconTone: 'text-rose-600 dark:text-rose-400',
  },
  warning: {
    icon: AlertTriangle,
    ring: 'ring-amber-200 dark:ring-amber-500/30',
    iconTone: 'text-amber-600 dark:text-amber-400',
  },
  info: {
    icon: Info,
    ring: 'ring-sky-200 dark:ring-sky-500/30',
    iconTone: 'text-sky-600 dark:text-sky-400',
  },
};

export default function Toaster() {
  const { toasts, dismiss } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2.5">
      {toasts.map((t) => {
        const v = VARIANTS[t.type] || VARIANTS.info;
        const Icon = v.icon;
        return (
          <div
            key={t.id}
            role="alert"
            className={cn(
              'animate-toast-in pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-lift ring-1 ring-inset dark:border-slate-800 dark:bg-slate-900',
              v.ring
            )}
          >
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', v.iconTone)} />
            <div className="min-w-0 flex-1">
              {t.title && (
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.title}</p>
              )}
              {t.message && (
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{t.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="-mr-1 -mt-1 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Yopish"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
