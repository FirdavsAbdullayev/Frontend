import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowUpRight } from 'lucide-react';
import { deploymentsApi, usersApi, companiesApi } from '../../api/endpoints';
import { extractErrorMessage } from '../../api/client';
import { useAsync } from '../../hooks/useAsync';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Field';
import {
  DEPLOYMENT_STATUS_LABELS,
  DEPLOYMENT_STATUS_STYLES,
} from '../../lib/labels';
import { formatDate, formatHours, fullName } from '../../lib/format';

const EMPTY = {
  student_id: '',
  company_id: '',
  mentor_id: '',
  start_date: '',
  end_date: '',
  planned_hours: 120,
  hiring_status: '',
};

export default function DeploymentsPage() {
  const [status, setStatus] = useState('');
  const { data, loading, reload } = useAsync(
    () => deploymentsApi.list({ status: status || undefined }).then((r) => r.data.data.items),
    [status]
  );
  const interns = useAsync(() => usersApi.list({ role: 'intern' }).then((r) => r.data.data.items), []);
  const mentors = useAsync(() => usersApi.list({ role: 'mentor' }).then((r) => r.data.data.items), []);
  const companies = useAsync(() => companiesApi.list({ is_active: 'true' }).then((r) => r.data.data.items), []);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const items = data || [];

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = { ...form, planned_hours: Number(form.planned_hours) };
      if (!payload.mentor_id) delete payload.mentor_id;
      if (!payload.hiring_status) delete payload.hiring_status;
      await deploymentsApi.create(payload);
      setOpen(false);
      setForm(EMPTY);
      reload();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Amaliyotlar"
        description="Amaliyot joylashuvlari va rejalar"
        actions={<Button onClick={() => { setError(''); setOpen(true); }}><Plus className="h-4 w-4" /> Yangi amaliyot</Button>}
      />

      <Card className="mb-4">
        <div className="flex items-center gap-3 p-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Holat:</span>
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Barchasi</option>
            {Object.entries(DEPLOYMENT_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card>
        {loading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <EmptyState title="Amaliyotlar yo'q" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 text-[11px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Amaliyotchi</th>
                  <th className="px-5 py-3 font-medium">Kompaniya</th>
                  <th className="px-5 py-3 font-medium">Mentor</th>
                  <th className="px-5 py-3 font-medium">Muddat</th>
                  <th className="px-5 py-3 font-medium">Reja</th>
                  <th className="px-5 py-3 font-medium">Holat</th>
                  <th className="px-5 py-3 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{fullName(d.student)}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{d.company?.name || '—'}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{fullName(d.mentor)}</td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                      {formatDate(d.start_date)} — {formatDate(d.end_date)}
                    </td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{formatHours(d.planned_hours)} soat</td>
                    <td className="px-5 py-3">
                      <Badge className={DEPLOYMENT_STATUS_STYLES[d.status]}>
                        {DEPLOYMENT_STATUS_LABELS[d.status]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link to={`/deployments/${d.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
                        Batafsil <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Yangi amaliyot"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button loading={submitting} onClick={submit}>Yaratish</Button>
          </>
        }
      >
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {error && <Alert variant="error" className="sm:col-span-2">{error}</Alert>}

          <Select label="Amaliyotchi" required value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })}>
            <option value="">Tanlang</option>
            {(interns.data || []).map((u) => <option key={u.id} value={u.id}>{u.full_name}</option>)}
          </Select>

          <Select label="Kompaniya" required value={form.company_id} onChange={(e) => setForm({ ...form, company_id: e.target.value })}>
            <option value="">Tanlang</option>
            {(companies.data || []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>

          <Select label="Mentor" value={form.mentor_id} onChange={(e) => setForm({ ...form, mentor_id: e.target.value })}>
            <option value="">Tanlanmagan</option>
            {(mentors.data || []).map((u) => <option key={u.id} value={u.id}>{u.full_name}</option>)}
          </Select>

          <Input label="Reja (soat)" type="number" min="0.5" step="0.5" required value={form.planned_hours} onChange={(e) => setForm({ ...form, planned_hours: e.target.value })} />

          <Input label="Boshlanish sanasi" type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          <Input label="Tugash sanasi" type="date" required value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />

          <Input label="Ishga olinish holati" className="sm:col-span-2" placeholder="Masalan: Kutilmoqda" value={form.hiring_status} onChange={(e) => setForm({ ...form, hiring_status: e.target.value })} />
        </form>
      </Modal>
    </div>
  );
}
