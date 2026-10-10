import { useState } from 'react';
import { Plus, ExternalLink, Check, X, Send, Pencil, Trash2 } from 'lucide-react';
import { dailyLogsApi } from '../../api/endpoints';
import { extractErrorMessage } from '../../api/client';
import { useAsync } from '../../hooks/useAsync';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Alert from '../ui/Alert';
import Spinner from '../ui/Spinner';
import EmptyState from '../ui/EmptyState';
import Badge from '../ui/Badge';
import { Input, Select, Textarea } from '../ui/Field';
import { LOG_STATUS_LABELS, LOG_STATUS_STYLES, ATTENDANCE_LABELS } from '../../lib/labels';
import { formatDate, formatHours, fullName } from '../../lib/format';

const EMPTY_FORM = {
  deployment_id: '',
  date: '',
  hours_worked: 8,
  attendance: 'present',
  task_description: '',
  result_link: '',
  submit: true,
  reason: '',
};

export default function DailyLogsPanel({
  deploymentId = null,
  deployments = [],
  role,
  title = 'Kunlik qaydlar',
  compact = false,
  defaultStatus = '',
}) {
  const [statusFilter, setStatusFilter] = useState(defaultStatus);
  const { data, loading, error, reload } = useAsync(
    () =>
      dailyLogsApi
        .list({ deployment_id: deploymentId || undefined, status: statusFilter || undefined })
        .then((r) => r.data.data.items),
    [deploymentId, statusFilter]
  );

  const logs = data || [];
  const canCreate = role === 'intern' || role === 'coordinator';
  const canReview = role === 'mentor' || role === 'coordinator';
  const isIntern = role === 'intern';

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [rejecting, setRejecting] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionId, setActionId] = useState(null);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, deployment_id: deploymentId || '' });
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (log) => {
    setEditing(log);
    setForm({
      deployment_id: log.deployment_id,
      date: log.date,
      hours_worked: Number(log.hours_worked),
      attendance: log.attendance,
      task_description: log.task_description || '',
      result_link: log.result_link || '',
      submit: false,
      reason: '',
    });
    setFormError('');
    setFormOpen(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      const payload = {
        hours_worked: Number(form.hours_worked),
        attendance: form.attendance,
        task_description: form.task_description || null,
        result_link: form.result_link || null,
      };
      if (editing) {
        if (role === 'coordinator' && form.reason) payload.reason = form.reason;
        await dailyLogsApi.update(editing.id, payload);
      } else {
        await dailyLogsApi.create({
          ...payload,
          date: form.date,
          submit: form.submit,
          deployment_id: form.deployment_id || undefined,
          reason: form.reason || undefined,
        });
      }
      setFormOpen(false);
      reload();
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const doAction = async (id, action) => {
    setActionId(id);
    try {
      if (action === 'approve') await dailyLogsApi.approve(id);
      if (action === 'submit') await dailyLogsApi.submit(id);
      if (action === 'delete') await dailyLogsApi.remove(id);
      reload();
    } catch (err) {
      window.alert(extractErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const submitReject = async () => {
    if (!rejectReason.trim()) return;
    setSubmitting(true);
    try {
      await dailyLogsApi.reject(rejecting.id, rejectReason);
      setRejecting(null);
      setRejectReason('');
      reload();
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{logs.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:border-brand-500 focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Barcha holatlar</option>
            {Object.entries(LOG_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          {canCreate && (
            <Button size="sm" onClick={openCreate}><Plus className="h-3.5 w-3.5" /> Qayd</Button>
          )}
        </div>
      </div>

      {error && <Alert variant="error" className="mb-3">{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : logs.length === 0 ? (
        <EmptyState title="Kunlik qaydlar yo'q" description="Hali qayd kiritilmagan." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/70 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Sana</th>
                {!deploymentId && <th className="px-4 py-2.5 font-medium">Amaliyotchi</th>}
                <th className="px-4 py-2.5 font-medium">Soat</th>
                <th className="px-4 py-2.5 font-medium">Davomat</th>
                <th className="px-4 py-2.5 font-medium">Holat</th>
                {!compact && <th className="px-4 py-2.5 font-medium">Natija</th>}
                <th className="px-4 py-2.5 text-right font-medium">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="align-top hover:bg-slate-50">
                  <td className="px-4 py-3 whitespace-nowrap text-slate-700">{formatDate(log.date)}</td>
                  {!deploymentId && (
                    <td className="px-4 py-3 text-slate-700">{fullName(log.deployment?.student)}</td>
                  )}
                  <td className="px-4 py-3 text-slate-700">{formatHours(log.hours_worked)}</td>
                  <td className="px-4 py-3 text-slate-500">{ATTENDANCE_LABELS[log.attendance]}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <Badge className={LOG_STATUS_STYLES[log.status]}>{LOG_STATUS_LABELS[log.status]}</Badge>
                      {log.entered_by_coordinator && (
                        <span className="text-[10px] font-medium text-amber-600">Koordinator kiritgan</span>
                      )}
                    </div>
                  </td>
                  {!compact && (
                    <td className="px-4 py-3">
                      {log.result_link ? (
                        <a href={log.result_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline">
                          Havola <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      {canReview && log.status === 'submitted' && (
                        <>
                          <Button size="sm" variant="success" loading={actionId === log.id} onClick={() => doAction(log.id, 'approve')}>
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => { setRejecting(log); setRejectReason(''); }}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                      {isIntern && ['draft', 'submitted', 'rejected'].includes(log.status) && (
                        <>
                          <Button size="sm" variant="secondary" onClick={() => openEdit(log)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          {['draft', 'rejected'].includes(log.status) && (
                            <Button size="sm" variant="primary" loading={actionId === log.id} onClick={() => doAction(log.id, 'submit')}>
                              <Send className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {log.status === 'draft' && (
                            <Button size="sm" variant="ghost" onClick={() => doAction(log.id, 'delete')}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </>
                      )}
                      {role === 'coordinator' && (
                        <Button size="sm" variant="secondary" onClick={() => openEdit(log)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    {log.status === 'rejected' && log.rejection_reason && (
                      <p className="mt-1.5 text-xs text-rose-500">Sabab: {log.rejection_reason}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Qaydni tahrirlash' : 'Yangi kunlik qayd'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>Bekor qilish</Button>
            <Button loading={submitting} onClick={submitForm}>{editing ? 'Saqlash' : 'Kiritish'}</Button>
          </>
        }
      >
        <form onSubmit={submitForm} className="space-y-4">
          {formError && <Alert variant="error">{formError}</Alert>}

          {role === 'coordinator' && !editing && !deploymentId && (
            <Select label="Amaliyot" required value={form.deployment_id} onChange={(e) => setForm({ ...form, deployment_id: e.target.value })}>
              <option value="">Tanlang</option>
              {deployments.map((d) => (
                <option key={d.id} value={d.id}>{fullName(d.student)} — {d.company?.name}</option>
              ))}
            </Select>
          )}

          {!editing && (
            <Input label="Sana" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Ishlangan soat" type="number" min="0" max="24" step="0.5" required value={form.hours_worked} onChange={(e) => setForm({ ...form, hours_worked: e.target.value })} />
            <Select label="Davomat" value={form.attendance} onChange={(e) => setForm({ ...form, attendance: e.target.value })}>
              {Object.entries(ATTENDANCE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </div>

          <Textarea label="Vazifa tavsifi" value={form.task_description} onChange={(e) => setForm({ ...form, task_description: e.target.value })} />

          <Input label="Natija havolasi" placeholder="https://github.com/..." hint="Faqat http yoki https havolalar" value={form.result_link} onChange={(e) => setForm({ ...form, result_link: e.target.value })} />

          {role === 'coordinator' && (
            <Input label="Izoh (koordinator kiritganligi uchun)" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          )}

          {!editing && (
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={form.submit} onChange={(e) => setForm({ ...form, submit: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-brand-600" />
              Darhol tekshiruvga yuborish
            </label>
          )}
        </form>
      </Modal>

      <Modal
        open={Boolean(rejecting)}
        onClose={() => setRejecting(null)}
        title="Qaydni qaytarish"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRejecting(null)}>Bekor qilish</Button>
            <Button variant="danger" loading={submitting} onClick={submitReject}>Qaytarish</Button>
          </>
        }
      >
        <p className="mb-3 text-sm text-slate-500">Amaliyotchi ko'rishi uchun sababni kiriting.</p>
        <Textarea label="Sabab" required value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
      </Modal>
    </div>
  );
}
