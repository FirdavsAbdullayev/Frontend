import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { authApi } from '../api/endpoints';
import { extractErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Spinner from '../components/ui/Spinner';
import { Input, PasswordInput } from '../components/ui/Field';
import { ROLE_LABELS } from '../lib/labels';

export default function InviteAccept() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { acceptInvite } = useAuth();

  const [info, setInfo] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ full_name: '', password: '', confirm: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await authApi.inviteInfo(token);
        setInfo(data.data);
        setForm((f) => ({ ...f, full_name: data.data.full_name || '' }));
      } catch (err) {
        setLoadError(extractErrorMessage(err, 'Taklif havolasi yaroqsiz.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-50">
        <Spinner />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Parollar mos kelmadi.');
      return;
    }
    setSubmitting(true);
    try {
      await acceptInvite({ token, password: form.password, full_name: form.full_name });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Taklifni qabul qilish" subtitle="Hisobingiz uchun parol o'rnating">
      {loadError ? (
        <Alert variant="error">{loadError}</Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}

          <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <p>
              <span className="text-slate-400">Email:</span> {info.email}
            </p>
            <p>
              <span className="text-slate-400">Rol:</span> {ROLE_LABELS[info.role]}
            </p>
          </div>

          <Input
            label="F.I.Sh"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />
          <PasswordInput
            label="Yangi parol"
            hint="Kamida 8 belgi"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <PasswordInput
            label="Parolni tasdiqlash"
            autoComplete="new-password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
          />

          <Button type="submit" className="w-full" loading={submitting}>
            <ShieldCheck className="h-4 w-4" />
            Parolni o'rnatish
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
