import { useState } from 'react';
import { auditApi } from '../../api/endpoints';
import { useAsync } from '../../hooks/useAsync';
import PageHeader from '../../components/ui/PageHeader';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { formatDateTime } from '../../lib/format';
import { ROLE_LABELS } from '../../lib/labels';

const ACTION_LABELS = {
  user_created: 'Foydalanuvchi yaratildi',
  user_updated: 'Foydalanuvchi yangilandi',
  user_deactivated: "Foydalanuvchi o'chirildi",
  invite_resent: 'Taklif qayta yuborildi',
  invite_accepted: 'Taklif qabul qilindi',
  password_changed: "Parol o'zgartirildi",
  company_created: 'Kompaniya yaratildi',
  company_updated: 'Kompaniya yangilandi',
  deployment_created: 'Amaliyot yaratildi',
  deployment_updated: 'Amaliyot yangilandi',
  deployment_status_changed: "Amaliyot holati o'zgardi",
  deployment_completed: 'Amaliyot yakunlandi',
  daily_log_approved: 'Kunlik qayd tasdiqlandi',
  daily_log_rejected: 'Kunlik qayd rad etildi',
  daily_log_updated: 'Kunlik qayd yangilandi',
  daily_log_deleted: "Kunlik qayd o'chirildi",
  daily_log_entered_by_coordinator: 'Koordinator nomidan kiritildi',
  daily_log_updated_by_coordinator: 'Koordinator nomidan yangilandi',
  weekly_report_saved: 'Haftalik hisobot saqlandi',
  weekly_report_evaluated: 'Haftalik hisobot baholandi',
  reminders_run: "Eslatmalar tekshirildi",
};

export default function AuditPage() {
  const [entity, setEntity] = useState('');
  const [action, setAction] = useState('');
  const { data, loading } = useAsync(
    () => auditApi.list({ entity_name: entity || undefined, action: action || undefined, limit: 200 }).then((r) => r.data.data.items),
    [entity, action]
  );

  const items = data || [];

  return (
    <div>
      <PageHeader title="Audit jurnali" description="Tizimdagi muhim amallar tarixi" />

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3 p-4">
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
          >
            <option value="">Barcha obyektlar</option>
            <option value="User">Foydalanuvchi</option>
            <option value="Company">Kompaniya</option>
            <option value="Deployment">Amaliyot</option>
            <option value="DailyLog">Kunlik qayd</option>
            <option value="WeeklyReport">Haftalik hisobot</option>
          </select>
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          >
            <option value="">Barcha amallar</option>
            {Object.entries(ACTION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </Card>

      <Card>
        {loading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <EmptyState title="Audit yozuvlari yo'q" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 text-[11px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Vaqt</th>
                  <th className="px-5 py-3 font-medium">Foydalanuvchi</th>
                  <th className="px-5 py-3 font-medium">Amal</th>
                  <th className="px-5 py-3 font-medium">Obyekt</th>
                  <th className="px-5 py-3 font-medium">Sabab / Izoh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((log) => (
                  <tr key={log.id} className="align-top hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">{formatDateTime(log.created_at)}</td>
                    <td className="px-5 py-3">
                      <div className="text-slate-700 dark:text-slate-200">{log.user?.full_name || '—'}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">{log.user ? ROLE_LABELS[log.user.role] : ''}</div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge className="bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                        {ACTION_LABELS[log.action] || log.action}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500 dark:text-slate-400">
                      {log.entity_name}
                      {log.entity_id && <div className="text-slate-300 dark:text-slate-600">{log.entity_id.slice(0, 8)}…</div>}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500 dark:text-slate-400">{log.reason || '—'}</td>
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
