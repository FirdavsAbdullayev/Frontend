import { Building2, UserCog, CalendarDays, Clock, CheckCircle2, Hourglass } from 'lucide-react';
import { deploymentsApi } from '../../api/endpoints';
import { useAsync } from '../../hooks/useAsync';
import PageHeader from '../../components/ui/PageHeader';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import ProgressBar from '../../components/ui/ProgressBar';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { DEPLOYMENT_STATUS_LABELS, DEPLOYMENT_STATUS_STYLES } from '../../lib/labels';
import { formatDate, formatHours, formatPercent, fullName } from '../../lib/format';

export default function MyPracticePage() {
  const { data, loading, error } = useAsync(async () => {
    const { data: listData } = await deploymentsApi.list();
    const deployment = listData.data.items[0];
    if (!deployment) return null;
    const { data: detail } = await deploymentsApi.get(deployment.id);
    return detail.data;
  }, []);

  if (loading) return <Spinner />;
  if (error) return <EmptyState title="Xatolik" description={error} />;
  if (!data) return <EmptyState title="Amaliyot topilmadi" description="Sizga hali amaliyot biriktirilmagan." />;

  const { deployment, progress } = data;

  return (
    <div>
      <PageHeader
        title="Mening amaliyotim"
        actions={
          <Badge className={DEPLOYMENT_STATUS_STYLES[deployment.status]}>
            {DEPLOYMENT_STATUS_LABELS[deployment.status]}
          </Badge>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Reja (soat)" value={formatHours(progress.planned_hours)} icon={Clock} />
        <StatCard label="Tasdiqlangan" value={formatHours(progress.approved_hours)} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Qolgan" value={formatHours(progress.remaining_hours)} icon={Hourglass} tone="amber" />
        <StatCard label="Progress" value={formatPercent(progress.progress_percent)} tone="sky" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Umumiy progress" />
          <CardBody className="space-y-4">
            <ProgressBar value={progress.progress_percent} />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-slate-400 dark:text-slate-500">Tasdiqlanishi kutilmoqda</p><p className="text-slate-700 dark:text-slate-200">{formatHours(progress.pending_hours)} soat</p></div>
              <div><p className="text-xs text-slate-400 dark:text-slate-500">Ortiqcha ishlangan</p><p className="text-slate-700 dark:text-slate-200">{formatHours(progress.overtime_hours)} soat</p></div>
            </div>
            {progress.approved_is_over_plan && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">Reja to'liq bajarildi!</p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Ma'lumotlar" />
          <CardBody className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Building2 className="h-4 w-4 text-slate-400 dark:text-slate-500" /> {deployment.company?.name || '—'}
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <UserCog className="h-4 w-4 text-slate-400 dark:text-slate-500" /> Mentor: {fullName(deployment.mentor)}
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <CalendarDays className="h-4 w-4 text-slate-400 dark:text-slate-500" /> {formatDate(deployment.start_date)} — {formatDate(deployment.end_date)}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
