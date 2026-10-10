import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, Hourglass, TrendingUp, ArrowRight } from 'lucide-react';
import { deploymentsApi } from '../../api/endpoints';
import { useAsync } from '../../hooks/useAsync';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ProgressBar from '../../components/ui/ProgressBar';
import { DEPLOYMENT_STATUS_LABELS, DEPLOYMENT_STATUS_STYLES } from '../../lib/labels';
import { formatDate, formatHours, formatPercent, fullName } from '../../lib/format';

export default function InternDashboard() {
  const { data, loading, error } = useAsync(async () => {
    const { data: listData } = await deploymentsApi.list();
    const deployment = listData.data.items[0];
    if (!deployment) return null;
    const { data: detail } = await deploymentsApi.get(deployment.id);
    return detail.data;
  }, []);

  if (loading) return <Spinner />;
  if (error) return <EmptyState title="Xatolik" description={error} />;
  if (!data) {
    return (
      <EmptyState
        title="Amaliyot topilmadi"
        description="Sizga hali amaliyot biriktirilmagan. Koordinator bilan bog'laning."
      />
    );
  }

  const { deployment, progress } = data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Mening amaliyotim"
          subtitle={`${deployment.company?.name || '—'} · Mentor: ${fullName(deployment.mentor)}`}
          actions={
            <Badge className={DEPLOYMENT_STATUS_STYLES[deployment.status]}>
              {DEPLOYMENT_STATUS_LABELS[deployment.status]}
            </Badge>
          }
        />
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Davr</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {formatDate(deployment.start_date)} — {formatDate(deployment.end_date)}
            </span>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Umumiy progress</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{formatPercent(progress.progress_percent)}</span>
            </div>
            <ProgressBar value={progress.progress_percent} />
          </div>
          <Link
            to="/my-practice"
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            Batafsil <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Reja (soat)" value={formatHours(progress.planned_hours)} icon={Clock} />
        <StatCard label="Tasdiqlangan" value={formatHours(progress.approved_hours)} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Qolgan" value={formatHours(progress.remaining_hours)} icon={Hourglass} tone="amber" />
        <StatCard label="Kutilmoqda" value={formatHours(progress.pending_hours)} icon={TrendingUp} tone="sky" />
      </div>

      {progress.approved_is_over_plan && (
        <Card>
          <CardBody className="text-sm text-emerald-700 dark:text-emerald-400">
            Reja to'liq bajarildi. Ortiqcha ishlangan: <strong>{formatHours(progress.overtime_hours)}</strong> soat.
          </CardBody>
        </Card>
      )}
    </div>
  );
}
