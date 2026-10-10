import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Forbidden() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 ring-1 ring-inset ring-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">403</p>
      <h1 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">Ruxsat yo'q</h1>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Bu sahifaga kirish uchun sizda yetarli huquq yo'q. Boshqa bo'limga o'ting.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button variant="secondary">
          <ArrowLeft className="h-4 w-4" />
          Boshqaruv paneliga qaytish
        </Button>
      </Link>
    </div>
  );
}
