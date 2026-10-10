import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <Compass className="h-7 w-7" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Sahifa topilmadi</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Siz izlagan sahifa mavjud emas.</p>
      </div>
      <Link to="/dashboard"><Button variant="secondary">Bosh sahifaga qaytish</Button></Link>
    </div>
  );
}
