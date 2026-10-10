import { Link } from 'react-router-dom';
import { ClipboardList, PlayCircle, CheckCircle2, CalendarClock, ArrowRight } from 'lucide-react';
import { deploymentsApi, remindersApi } from '../../api/endpoints';
import { useAsync } from '../../hooks/useAsync';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import {
  DEPLOYMENT_STATUS_LABELS,
  DEPLOYMENT_STATUS_STYLES,
} from '../../lib/labels';
import { fullName, formatDate } from '../../lib/format';

export default function CoordinatorDashboard() {
  const deployments = useAsync(() => deploymentsApi.list().then((r) => r.data.data.items), []);
  const reminders = useAsync(() => remindersApi.list().then((r) => r.data.data.items), []);

  const items = deployments.data || [];
  const active = items.filter((d) => d.status === 'in_progress' || d.status === 'placed').length;
  const completed = items.filter((d) => d.status === 'completed').length;
  const reminded = (reminders.data || []).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Jami amaliyotlar" value={deployments.loading ? '—' : items.length} icon={ClipboardList} />
        <StatCard label="Faol amaliyotlar" value={deployments.loading ? '—' : active} icon={PlayCircle} tone="sky" />
        <StatCard label="Yakunlangan" value={deployments.loading ? '—' : completed} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Eslatma talab" value={reminders.loading ? '—' : reminded} icon={CalendarClock} tone="amber" hint="Qayd qilinmagan kunlari bor" />
      </div>

      <Card>
        <CardHeader
          title="So'nggi amaliyotlar"
          actions={
            <Link to="/deployments" className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
              Barchasi <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        {deployments.loading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <EmptyState title="Amaliyotlar yo'q" description="Hali amaliyot yaratilmagan." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 text-[11px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Amaliyotchi</th>
                  <th className="px-5 py-3 font-medium">Kompaniya</th>
                  <th className="px-5 py-3 font-medium">Muddat</th>
                  <th className="px-5 py-3 font-medium">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.slice(0, 6).map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-3">
                      <Link to={`/deployments/${d.id}`} className="font-medium text-brand-600 hover:underline">
                        {fullName(d.student)}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{d.company?.name || '—'}</td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                      {formatDate(d.start_date)} — {formatDate(d.end_date)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge className={DEPLOYMENT_STATUS_STYLES[d.status]}>
                        {DEPLOYMENT_STATUS_LABELS[d.status]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
