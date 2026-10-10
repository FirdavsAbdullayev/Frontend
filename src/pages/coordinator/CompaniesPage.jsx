import { useState } from 'react';
import { Plus, Search, Pencil, Power } from 'lucide-react';
import { companiesApi } from '../../api/endpoints';
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
import { Input } from '../../components/ui/Field';

const EMPTY = { name: '', industry: '', address: '', contact_info: '' };

export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const { data, loading, reload } = useAsync(
    () => companiesApi.list({ search: search || undefined }).then((r) => r.data.data.items),
    [search]
  );

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);

  const companies = data || [];

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setOpen(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, industry: c.industry || '', address: c.address || '', contact_info: c.contact_info || '' });
    setError('');
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (editing) await companiesApi.update(editing.id, form);
      else await companiesApi.create(form);
      setOpen(false);
      reload();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (c) => {
    setActionId(c.id);
    try {
      await companiesApi.update(c.id, { is_active: !c.is_active });
      reload();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Kompaniyalar"
        description="Amaliyot o'tkaziladigan tashkilotlar"
        actions={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Yangi kompaniya</Button>}
      />

      <Card className="mb-4">
        <div className="p-4">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-brand-500/20"
              placeholder="Kompaniya nomi yoki soha"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      <Card>
        {loading ? (
          <Spinner />
        ) : companies.length === 0 ? (
          <EmptyState title="Kompaniyalar topilmadi" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 text-[11px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Nomi</th>
                  <th className="px-5 py-3 font-medium">Soha</th>
                  <th className="px-5 py-3 font-medium">Manzil</th>
                  <th className="px-5 py-3 font-medium">Aloqa</th>
                  <th className="px-5 py-3 font-medium">Holat</th>
                  <th className="px-5 py-3 text-right font-medium">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {companies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{c.name}</td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{c.industry || '—'}</td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{c.address || '—'}</td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{c.contact_info || '—'}</td>
                    <td className="px-5 py-3">
                      {c.is_active ? (
                        <Badge className="bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">Faol</Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-500 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">Nofaol</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openEdit(c)}>
                          <Pencil className="h-3.5 w-3.5" /> Tahrir
                        </Button>
                        <Button size="sm" variant="ghost" loading={actionId === c.id} onClick={() => toggleActive(c)}>
                          <Power className="h-3.5 w-3.5" /> {c.is_active ? 'O\'chirish' : 'Faollashtirish'}
                        </Button>
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
        title={editing ? 'Kompaniyani tahrirlash' : 'Yangi kompaniya'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button loading={submitting} onClick={submit}>{editing ? 'Saqlash' : 'Yaratish'}</Button>
          </>
        }
      >
        <form onSubmit={submit} className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}
          <Input label="Nomi" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Soha" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          <Input label="Manzil" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Input label="Aloqa ma'lumoti" value={form.contact_info} onChange={(e) => setForm({ ...form, contact_info: e.target.value })} />
        </form>
      </Modal>
    </div>
  );
}
