import { Link } from 'react-router-dom';
import { ClipboardCheck, FileBarChart } from 'lucide-react';
import { deploymentsApi } from '../../api/endpoints';
import { useAsync } from '../../hooks/useAsync';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { Card } from '../../components/ui/Card';
import { DEPLOYMENT_STATUS_LABELS, DEPLOYMENT_STATUS_STYLES } from '../../lib/labels';
import { formatDate, formatHours, formatPercent, fullName } from '../../lib/format';

export default function AdviseesPage() {
  const { data, loading, error } = useAsync(async () => {
    const { data: listData } = await deploymentsApi.list();
    const items = listData.data.items;
    const withProgress = await Promise.all(
      items.map(async (d) => {
        try {
          const { data: detail } = await deploymentsApi.progress(d.id);
          return { ...d, progress: detail.data.progress };
        } catch {
          return { ...d, progress: null };
        }
      })
    );
    return withProgress;
  }, []);

  if (loading) return <Spinner />;
  if (error) return <EmptyState title="Xatolik" description={error} />;

  const items = data || [];

  return (
    <div>
      <PageHeader title="Mening amaliyotchilarim" description="Sizga biriktirilgan amaliyotlar" />

      {items.length === 0 ? (
        <EmptyState title="Amaliyotchilar yo'q" description="Sizga hali amaliyotchi biriktirilmagan." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((d) => (
            <Card key={d.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{fullName(d.student)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{d.company?.name || '—'}</p>
                </div>
                <Badge className={DEPLOYMENT_STATUS_STYLES[d.status]}>{DEPLOYMENT_STATUS_LABELS[d.status]}</Badge>
              </div>

              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                {formatDate(d.start_date)} — {formatDate(d.end_date)}
              </p>

              {d.progress && (
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">
                      {formatHours(d.progress.approved_hours)} / {formatHours(d.progress.planned_hours)} soat
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{formatPercent(d.progress.progress_percent)}</span>
                  </div>
                  <ProgressBar value={d.progress.progress_percent} />
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <Link to="/review"><Button size="sm" variant="secondary"><ClipboardCheck className="h-3.5 w-3.5" /> Qaydlarni tekshirish</Button></Link>
                <Link to="/evaluations"><Button size="sm" variant="secondary"><FileBarChart className="h-3.5 w-3.5" /> Baholash</Button></Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
