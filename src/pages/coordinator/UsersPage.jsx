import { useState } from 'react';
import { Plus, Search, UserX, UserCheck, RefreshCw, CopyCheck, Link as LinkIcon } from 'lucide-react';
import { usersApi } from '../../api/endpoints';
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
import { ROLE_LABELS } from '../../lib/labels';
import { formatDate } from '../../lib/format';

const ROLE_STYLES = {
  coordinator: 'bg-brand-100 text-brand-700 ring-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-500/20',
  intern: 'bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20',
  mentor:
    'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
};

export default function UsersPage() {
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const { data, loading, reload } = useAsync(
    () => usersApi.list({ role: role || undefined, search: search || undefined }).then((r) => r.data.data.items),
    [role, search]
  );

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', role: 'intern', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [actionId, setActionId] = useState(null);

  const users = data || [];

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      const { data: res } = await usersApi.create(payload);
      const invite = res.data.invite;
      setOpen(false);
      setForm({ full_name: '', email: '', role: 'intern', password: '' });
      if (invite?.link) {
        setInviteLink(invite.link);
      }
      reload();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async (user) => {
    setActionId(user.id);
    try {
      const { data: res } = await usersApi.resendInvite(user.id);
      setInviteLink(res.data.invite.link);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const deactivate = async (user) => {
    setActionId(user.id);
    try {
      await usersApi.deactivate(user.id);
      reload();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const activate = async (user) => {
    setActionId(user.id);
    try {
      await usersApi.activate(user.id);
      reload();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <PageHeader
        title="Foydalanuvchilar"
        description="O'quvchi, mentor va koordinatorlarni boshqarish"
        actions={
          <Button onClick={() => { setError(''); setOpen(true); }}>
            <Plus className="h-4 w-4" /> Yangi foydalanuvchi
          </Button>
        }
      />

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3 p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-brand-500/20"
              placeholder="Ism yoki email bo'yicha qidirish"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Barcha rollar</option>
            <option value="coordinator">Koordinator</option>
            <option value="intern">Amaliyotchi</option>
            <option value="mentor">Mentor</option>
          </select>
        </div>
      </Card>

      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      <Card>
        {loading ? (
          <Spinner />
        ) : users.length === 0 ? (
          <EmptyState title="Foydalanuvchilar topilmadi" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 text-[11px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">F.I.Sh</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Rol</th>
                  <th className="px-5 py-3 font-medium">Holat</th>
                  <th className="px-5 py-3 font-medium">Qo'shilgan</th>
                  <th className="px-5 py-3 text-right font-medium">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{u.full_name}</td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{u.email}</td>
                    <td className="px-5 py-3">
                      <Badge className={ROLE_STYLES[u.role]}>{ROLE_LABELS[u.role]}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      {u.is_active ? (
                        <Badge className="bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">Faol</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20">Tasdiq kutilmoqda</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{formatDate(u.created_at)}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        {!u.has_password && (
                          <Button size="sm" variant="secondary" loading={actionId === u.id} onClick={() => resend(u)}>
                            <RefreshCw className="h-3.5 w-3.5" /> Taklif
                          </Button>
                        )}
                        {!u.is_active && (
                          <Button size="sm" loading={actionId === u.id} onClick={() => activate(u)}>
                            <UserCheck className="h-3.5 w-3.5" /> Faollashtirish
                          </Button>
                        )}
                        {u.is_active && (
                          <Button size="sm" variant="ghost" loading={actionId === u.id} onClick={() => deactivate(u)}>
                            <UserX className="h-3.5 w-3.5" /> O'chirish
                          </Button>
                        )}
                      </div>
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
        title="Yangi foydalanuvchi"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button loading={submitting} onClick={submit}>Yaratish</Button>
          </>
        }
      >
        <form onSubmit={submit} className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}
          <Input label="F.I.Sh" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Select label="Rol" required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="intern">Amaliyotchi</option>
            <option value="mentor">Mentor</option>
            <option value="coordinator">Koordinator</option>
          </Select>
          <Input
            label="Parol (ixtiyoriy)"
            type="password"
            hint="Bo'sh qoldirsangiz, 72 soatlik taklif havolasi yaratiladi"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </form>
      </Modal>

      <Modal
        open={Boolean(inviteLink)}
        onClose={() => setInviteLink('')}
        title="Taklif havolasi yaratildi"
        footer={<Button variant="secondary" onClick={() => setInviteLink('')}>Yopish</Button>}
      >
        <Alert variant="info" className="mb-3">
          Ushbu havola <strong>72 soat</strong> amal qiladi va faqat bir marta ishlatiladi. Uni foydalanuvchiga xavfsiz kanal orqali yuboring.
        </Alert>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-950">
          <LinkIcon className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
          <span className="flex-1 truncate text-xs text-slate-600 dark:text-slate-300">{inviteLink}</span>
          <Button size="sm" variant="secondary" onClick={copyLink}>
            {copied ? <CopyCheck className="h-3.5 w-3.5" /> : null}
            {copied ? 'Nusxa olindi' : 'Nusxa'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
