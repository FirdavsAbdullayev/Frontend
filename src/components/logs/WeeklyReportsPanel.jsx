import { useState } from 'react';
import { Plus, Pencil, Star, ClipboardCheck } from 'lucide-react';
import { weeklyReportsApi } from '../../api/endpoints';
import { extractErrorMessage } from '../../api/client';
import { useAsync } from '../../hooks/useAsync';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Alert from '../ui/Alert';
import Spinner from '../ui/Spinner';
import EmptyState from '../ui/EmptyState';
import Badge from '../ui/Badge';
import { Input, Select, Textarea } from '../ui/Field';
import { SCORE_FIELDS } from '../../lib/labels';
import { formatDate, fullName } from '../../lib/format';

const EMPTY_REPORT = { deployment_id: '', week_start_date: '', student_summary: '', challenges: '', next_week_plan: '' };

export default function WeeklyReportsPanel({
  deploymentId = null,
  deployments = [],
  role,
  title = 'Haftalik hisobotlar',
}) {
  const { data, loading, error, reload } = useAsync(
    () => weeklyReportsApi.list({ deployment_id: deploymentId || undefined }).then((r) => r.data.data.items),
    [deploymentId]
  );

  const reports = data || [];
  const isIntern = role === 'intern';
  const canEvaluate = role === 'mentor' || role === 'coordinator';

  const [reportOpen, setReportOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_REPORT);
  const [evalOpen, setEvalOpen] = useState(null);
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_REPORT, deployment_id: deploymentId || '' });
    setFormError('');
    setReportOpen(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({
      deployment_id: r.deployment_id,
      week_start_date: r.week_start_date,
      student_summary: r.student_summary || '',
      challenges: r.challenges || '',
      next_week_plan: r.next_week_plan || '',
    });
    setFormError('');
    setReportOpen(true);
  };

  const submitReport = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      const payload = { ...form };
      if (!payload.deployment_id) delete payload.deployment_id;
      await weeklyReportsApi.save(payload);
      setReportOpen(false);
      reload();
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const openEval = (r) => {
    setEvalOpen(r);
    const initial = {};
    SCORE_FIELDS.forEach((f) => { initial[f.key] = r[f.key] ?? ''; });
    setScores(initial);
    setFeedback(r.mentor_feedback || '');
    setFormError('');
  };

  const submitEval = async () => {
    setSubmitting(true);
    setFormError('');
    try {
      const payload = { mentor_feedback: feedback };
      SCORE_FIELDS.forEach((f) => {
        if (scores[f.key] !== '' && scores[f.key] !== undefined) payload[f.key] = Number(scores[f.key]);
      });
      await weeklyReportsApi.evaluate(evalOpen.id, payload);
      setEvalOpen(null);
      reload();
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{reports.length}</span>
        </div>
        {isIntern && (
          <Button size="sm" onClick={openCreate}><Plus className="h-3.5 w-3.5" /> Hisobot</Button>
        )}
      </div>

      {error && <Alert variant="error" className="mb-3">{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : reports.length === 0 ? (
        <EmptyState title="Haftalik hisobotlar yo'q" />
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">Hafta: {formatDate(r.week_start_date)}</span>
                  {!deploymentId && <span className="text-xs text-slate-400">· {fullName(r.deployment?.student)}</span>}
                </div>
                <div className="flex items-center gap-2">
                  {r.average_score !== null && r.average_score !== undefined && (
                    <Badge className="bg-brand-100 text-brand-700 ring-brand-200">
                      <Star className="mr-1 h-3 w-3" /> {r.average_score} / 5
                    </Badge>
                  )}
                  {r.evaluated_at ? (
                    <Badge className="bg-emerald-100 text-emerald-700 ring-emerald-200">Baholangan</Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-700 ring-amber-200">Baholanmagan</Badge>
                  )}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium text-slate-400">Xulosa</p>
                  <p className="text-slate-600">{r.student_summary || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Qiyinchiliklar</p>
                  <p className="text-slate-600">{r.challenges || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Keyingi hafta rejasi</p>
                  <p className="text-slate-600">{r.next_week_plan || '—'}</p>
                </div>
              </div>

              {r.mentor_feedback && (
                <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <p className="text-xs font-medium text-slate-400">Mentor izohi</p>
                  <p className="text-slate-600">{r.mentor_feedback}</p>
                </div>
              )}

              <div className="mt-3 flex justify-end gap-2">
                {isIntern && !r.evaluated_at && (
                  <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>
                    <Pencil className="h-3.5 w-3.5" /> Tahrirlash
                  </Button>
                )}
                {canEvaluate && (
                  <Button size="sm" variant="primary" onClick={() => openEval(r)}>
                    <ClipboardCheck className="h-3.5 w-3.5" /> {r.evaluated_at ? 'Qayta baholash' : 'Baholash'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title={editing ? 'Hisobotni tahrirlash' : 'Yangi haftalik hisobot'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setReportOpen(false)}>Bekor qilish</Button>
            <Button loading={submitting} onClick={submitReport}>Saqlash</Button>
          </>
        }
      >
        <form onSubmit={submitReport} className="space-y-4">
          {formError && <Alert variant="error">{formError}</Alert>}
          {role === 'coordinator' && !deploymentId && !editing && (
            <Select label="Amaliyot" required value={form.deployment_id} onChange={(e) => setForm({ ...form, deployment_id: e.target.value })}>
              <option value="">Tanlang</option>
              {deployments.map((d) => <option key={d.id} value={d.id}>{fullName(d.student)} — {d.company?.name}</option>)}
            </Select>
          )}
          <Input label="Hafta boshlanish sanasi (dushanba)" type="date" required disabled={Boolean(editing)} value={form.week_start_date} onChange={(e) => setForm({ ...form, week_start_date: e.target.value })} />
          <Textarea label="Hafta xulosasi" value={form.student_summary} onChange={(e) => setForm({ ...form, student_summary: e.target.value })} />
          <Textarea label="Qiyinchiliklar" value={form.challenges} onChange={(e) => setForm({ ...form, challenges: e.target.value })} />
          <Textarea label="Keyingi hafta rejasi" value={form.next_week_plan} onChange={(e) => setForm({ ...form, next_week_plan: e.target.value })} />
        </form>
      </Modal>

      <Modal
        open={Boolean(evalOpen)}
        onClose={() => setEvalOpen(null)}
        title="Haftalik baholash"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEvalOpen(null)}>Bekor qilish</Button>
            <Button loading={submitting} onClick={submitEval}>Saqlash</Button>
          </>
        }
      >
        {formError && <Alert variant="error" className="mb-3">{formError}</Alert>}
        <p className="mb-3 text-xs text-slate-500">Har bir mezon 0 dan 5 gacha baholanadi.</p>
        <div className="space-y-3">
          {SCORE_FIELDS.map((f) => (
            <Select
              key={f.key}
              label={f.label}
              value={scores[f.key] ?? ''}
              onChange={(e) => setScores({ ...scores, [f.key]: e.target.value })}
            >
              <option value="">—</option>
              {[0, 1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </Select>
          ))}
          <Textarea label="Mentor izohi" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
