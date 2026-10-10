import { useState } from 'react';
import { RefreshCw, CalendarX2 } from 'lucide-react';
import { remindersApi } from '../../api/endpoints';
import { extractErrorMessage } from '../../api/client';
import { useAsync } from '../../hooks/useAsync';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { Card } from '../../components/ui/Card';
import { formatDate, fullName } from '../../lib/format';

export default function RemindersPage() {
  const { data, loading, reload } = useAsync(
    () => remindersApi.list().then((r) => r.data.data.items),
    []
  );
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  const items = data || [];

  const runNow = async () => {
    setRunning(true);
    setError('');
    try {
      await remindersApi.run();
      reload();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Eslatmalar"
        description="Qayd qilinmagan ish kunlari (dam olish kunlari hisobga olinmaydi)"
        actions={<Button onClick={runNow} loading={running}><RefreshCw className="h-4 w-4" /> Tekshirish</Button>}
      />

      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <EmptyState title="Eslatmalar yo'q" description="Barcha faol amaliyotlarda kunlik qaydlar to'liq." icon={CalendarX2} />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.deployment_id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{fullName(item.student)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.company?.name || '—'} · {formatDate(item.start_date)} — {formatDate(item.end_date)}
                  </p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                  {item.missing_days_count} kun qayd qilinmagan
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.missing_days.map((d) => (
                  <span key={d} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {formatDate(d)}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
