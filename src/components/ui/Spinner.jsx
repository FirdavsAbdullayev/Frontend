import { Loader2 } from 'lucide-react';

export default function Spinner({ label = 'Yuklanmoqda...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-slate-400 dark:text-slate-500">
      <Loader2 className="h-5 w-5 animate-spin text-brand-500" />
      <span className="text-xs">{label}</span>
    </div>
  );
}
