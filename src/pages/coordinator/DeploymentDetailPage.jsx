import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Play, Pause, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { deploymentsApi, usersApi } from '../../api/endpoints';
import { extractErrorMessage } from '../../api/client';
import { useAsync } from '../../hooks/useAsync';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import ProgressBar from '../../components/ui/ProgressBar';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Field';
import DailyLogsPanel from '../../components/logs/DailyLogsPanel';
import WeeklyReportsPanel from '../../components/logs/WeeklyReportsPanel';
import { DEPLOYMENT_STATUS_LABELS, DEPLOYMENT_STATUS_STYLES } from '../../lib/labels';
import { formatDate, formatHours, formatPercent, fullName } from '../../lib/format';

const TABS = [
  { key: 'overview', label: 'Umumiy' },
  { key: 'logs', label: 'Kunlik qaydlar' },
  { key: 'reports', label: 'Haftalik hisobotlar' },
];

export default function DeploymentDetailPage() {
  const { id } = useParams();
  const { data, loading, error, reload } = useAsync(
    () => deploymentsApi.get(id).then((r) => r.data.data),
    [id]
  );
  const mentors = useAsync(() => usersApi.list({ role: 'mentor' }).then((r) => r.data.data.items), []);

  const [tab, setTab] = useState('overview');
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [statusAction, setStatusAction] = useState(null); // { status, needReason, title }
  const [reason, setReason] = useState('');
  const [hiring, setHiring] = useState('');

  if (loading) return <Spinner />;
  if (error) return <EmptyState title="Xatolik" description={error} />;
  if (!data) return <EmptyState title="Amaliyot topilmadi" />;

  const { deployment, progress } = data;

  const openEdit = () => {
    setForm({
      mentor_id: deployment.mentor_id || '',
      start_date: deployment.start_date,
      end_date: deployment.end_date,
      planned_hours: Number(deployment.planned_hours),
      hiring_status: deployment.hiring_status || '',
    });
    setFormError('');
    setEditOpen(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      const payload = { ...form, planned_hours: Number(form.planned_hours) };
      if (!payload.mentor_id) payload.mentor_id = null;
      await deploymentsApi.update(id, payload);
      setEditOpen(false);
      reload();
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const runStatus = async () => {
    setSubmitting(true);
    setFormError('');
    try {
      if (statusAction.status === 'completed') {
        await deploymentsApi.complete(id, hiring ? { hiring_status: hiring } : {});
      } else {
        await deploymentsApi.changeStatus(id, {
          status: statusAction.status,
          reason: statusAction.needReason ? reason : undefined,
        });
      }
      setStatusAction(null);
      setReason('');
      setHiring('');
      reload();
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const statusButtons = [];
  if (['placed', 'paused'].includes(deployment.status)) {
    statusButtons.push({ label: 'Boshlash / Davom ettirish', status: 'in_progress', icon: Play, variant: 'primary' });
  }
  if (deployment.status === 'in_progress') {
    statusButtons.push({ label: "To'xtatish", status: 'paused', icon: Pause, variant: 'secondary', needReason: true, title: "Amaliyotni to'xtatish" });
  }
  if (['placed', 'in_progress', 'paused'].includes(deployment.status)) {
    statusButtons.push({ label: 'Yakunlash', status: 'completed', icon: CheckCircle2, variant: 'success' });
    statusButtons.push({ label: 'Muddatidan oldin tugatish', status: 'terminated_early', icon: XCircle, variant: 'danger', needReason: true, title: 'Muddatidan oldin tugatish' });
  }
  if (['completed', 'terminated_early'].includes(deployment.status)) {
    statusButtons.push({ label: 'Qayta ochish', status: 'in_progress', icon: RotateCcw, variant: 'secondary' });
  }

  return (
    <div>
      <Link to="/deployments" className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
        <ArrowLeft className="h-3.5 w-3.5" /> Amaliyotlarga qaytish
      </Link>

      <PageHeader
        title={fullName(deployment.student)}
        description={`${deployment.company?.name || '—'} · Mentor: ${fullName(deployment.mentor)}`}
        actions={
          <>
            <Badge className={DEPLOYMENT_STATUS_STYLES[deployment.status]}>
              {DEPLOYMENT_STATUS_LABELS[deployment.status]}
            </Badge>
            <Button variant="secondary" size="sm" onClick={openEdit}><Pencil className="h-3.5 w-3.5" /> Reja</Button>
          </>
        }
      />

      {(formError && !editOpen && !statusAction) && <Alert variant="error" className="mb-4">{formError}</Alert>}

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Reja (soat)" value={formatHours(progress.planned_hours)} />
        <StatCard label="Tasdiqlangan" value={formatHours(progress.approved_hours)} tone="emerald" />
        <StatCard label="Qolgan" value={formatHours(progress.remaining_hours)} tone="amber" />
        <StatCard label="Ortiqcha" value={formatHours(progress.overtime_hours)} tone="sky" />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {statusButtons.map((b) => (
          <Button
            key={b.status + b.label}
            variant={b.variant}
            size="sm"
            onClick={() => {
              setFormError('');
              setStatusAction(b);
              setReason('');
              setHiring(deployment.hiring_status || '');
            }}
          >
            <b.icon className="h-3.5 w-3.5" /> {b.label}
          </Button>
        ))}
      </div>

      <div className="mb-4 flex gap-1 border-b border-slate-200 dark:border-slate-800">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={
              'border-b-2 px-4 py-2 text-sm font-medium transition-colors ' +
              (tab === t.key
                ? 'border-brand-600 text-brand-700 dark:border-brand-500 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200')
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <Card>
          <CardHeader title="Amaliyot rejasi" />
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Umumiy progress</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{formatPercent(progress.progress_percent)}</span>
            </div>
            <ProgressBar value={progress.progress_percent} />

            <dl className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
              <div><dt className="text-xs text-slate-400 dark:text-slate-500">Boshlanish</dt><dd className="text-sm text-slate-700 dark:text-slate-200">{formatDate(deployment.start_date)}</dd></div>
              <div><dt className="text-xs text-slate-400 dark:text-slate-500">Tugash</dt><dd className="text-sm text-slate-700 dark:text-slate-200">{formatDate(deployment.end_date)}</dd></div>
              <div><dt className="text-xs text-slate-400 dark:text-slate-500">Ishga olinish holati</dt><dd className="text-sm text-slate-700 dark:text-slate-200">{deployment.hiring_status || '—'}</dd></div>
              <div><dt className="text-xs text-slate-400 dark:text-slate-500">Ko'rib chiqilishi kutilmoqda</dt><dd className="text-sm text-slate-700 dark:text-slate-200">{formatHours(progress.pending_hours)} soat</dd></div>
            </dl>

            <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              Holatlar bo'yicha soatlar: qoralama {formatHours(progress.logs_by_status.draft)}, tekshiruvda {formatHours(progress.logs_by_status.submitted)}, tasdiqlangan {formatHours(progress.logs_by_status.approved)}, rad etilgan {formatHours(progress.logs_by_status.rejected)}.
            </div>
          </CardBody>
        </Card>
      )}

      {tab === 'logs' && (
        <Card className="p-4">
          <DailyLogsPanel deploymentId={id} role="coordinator" title="Kunlik qaydlar" />
        </Card>
      )}

      {tab === 'reports' && (
        <Card className="p-4">
          <WeeklyReportsPanel deploymentId={id} role="coordinator" title="Haftalik hisobotlar" />
        </Card>
      )}

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Rejani tahrirlash"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditOpen(false)}>Bekor qilish</Button>
            <Button loading={submitting} onClick={submitEdit}>Saqlash</Button>
          </>
        }
      >
        {form && (
          <form onSubmit={submitEdit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {formError && <Alert variant="error" className="sm:col-span-2">{formError}</Alert>}
            <Select label="Mentor" className="sm:col-span-2" value={form.mentor_id} onChange={(e) => setForm({ ...form, mentor_id: e.target.value })}>
              <option value="">Tanlanmagan</option>
              {(mentors.data || []).map((u) => <option key={u.id} value={u.id}>{u.full_name}</option>)}
            </Select>
            <Input label="Boshlanish sanasi" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            <Input label="Tugash sanasi" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            <Input label="Reja (soat)" type="number" step="0.5" value={form.planned_hours} onChange={(e) => setForm({ ...form, planned_hours: e.target.value })} />
            <Input label="Ishga olinish holati" value={form.hiring_status} onChange={(e) => setForm({ ...form, hiring_status: e.target.value })} />
          </form>
        )}
      </Modal>

      <Modal
        open={Boolean(statusAction)}
        onClose={() => setStatusAction(null)}
        title={statusAction?.title || "Holatni o'zgartirish"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setStatusAction(null)}>Bekor qilish</Button>
            <Button loading={submitting} onClick={runStatus}>Tasdiqlash</Button>
          </>
        }
      >
        {formError && <Alert variant="error" className="mb-3">{formError}</Alert>}
        {statusAction?.status === 'completed' ? (
          <Input label="Ishga olinish holati (ixtiyoriy)" value={hiring} onChange={(e) => setHiring(e.target.value)} />
        ) : statusAction?.needReason ? (
          <>
            <Alert variant="info" className="mb-3">Bu amal uchun sabab majburiy.</Alert>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-brand-500/20"
              rows={3}
              placeholder="Sababni kiriting..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-300">Holat <strong>{DEPLOYMENT_STATUS_LABELS[statusAction?.status]}</strong> ga o'zgartiriladi.</p>
        )}
      </Modal>
    </div>
  );
}
