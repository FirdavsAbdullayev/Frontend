import { Link } from 'react-router-dom';
import { Users, ClipboardCheck, FileBarChart, ArrowRight } from 'lucide-react';
import { deploymentsApi, dailyLogsApi, weeklyReportsApi } from '../../api/endpoints';
import { useAsync } from '../../hooks/useAsync';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { fullName } from '../../lib/format';

export default function MentorDashboard() {
  const { data, loading } = useAsync(async () => {
    const [deployments, logs, reports] = await Promise.all([
      deploymentsApi.list(),
      dailyLogsApi.list({ status: 'submitted' }),
      weeklyReportsApi.list(),
    ]);
    return {
      deployments: deployments.data.data.items,
      pendingLogs: logs.data.data.items,
      reports: reports.data.data.items.filter((r) => !r.evaluated_at),
    };
  }, []);

  if (loading) return <Spinner />;
  const { deployments = [], pendingLogs = [], reports = [] } = data || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Mening amaliyotchilarim" value={deployments.length} icon={Users} />
        <StatCard label="Tekshirilishi kerak" value={pendingLogs.length} icon={ClipboardCheck} tone="amber" hint="Yuborilgan kunlik qaydlar" />
        <StatCard label="Baholanishi kerak" value={reports.length} icon={FileBarChart} tone="sky" hint="Haftalik hisobotlar" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Kutayotgan qaydlar"
            actions={
              <Link to="/review" className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
                Ko'rish <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          {pendingLogs.length === 0 ? (
            <EmptyState title="Kutayotgan qaydlar yo'q" />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {pendingLogs.slice(0, 5).map((log) => (
                <li key={log.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-slate-700 dark:text-slate-200">{fullName(log.deployment?.student)}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{log.date}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Baholashni kutayotgan hisobotlar"
            actions={
              <Link to="/evaluations" className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
                Ko'rish <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          {reports.length === 0 ? (
            <EmptyState title="Hisobotlar yo'q" />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {reports.slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-slate-700 dark:text-slate-200">{fullName(r.deployment?.student)}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">Hafta: {r.week_start_date}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
