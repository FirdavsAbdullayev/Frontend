import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { UserPlus, MailCheck } from 'lucide-react';
import { authApi } from '../api/endpoints';
import { extractErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { Input, PasswordInput, Select } from '../components/ui/Field';

export default function SignUp() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    role: 'intern',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Parollar mos kelmadi.');
      return;
    }
    setLoading(true);
    try {
      await authApi.register({
        full_name: form.full_name,
        email: form.email,
        role: form.role,
        password: form.password,
      });
      setDone(true);
    } catch (err) {
      setError(extractErrorMessage(err, 'Ro\'yxatdan o\'tishda xatolik.'));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout
        title="Ro'yxatdan o'tdingiz"
        subtitle="So'rovingiz qabul qilindi"
        footer={
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Kirish sahifasiga qaytish
          </Link>
        }
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <MailCheck className="h-7 w-7" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Hisobingiz yaratildi. Xavfsizlik uchun u{' '}
            <span className="font-medium text-slate-900 dark:text-slate-100">koordinator tasdiqlashini</span>{' '}
            kutmoqda. Tasdiqlangach tizimga kirishingiz mumkin.
          </p>
          <Button className="mt-5 w-full" onClick={() => navigate('/login')}>
            Kirish sahifasiga o'tish
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Ro'yxatdan o'tish"
      subtitle="Hisob yaratib, koordinator tasdiqini kuting"
      footer={
        <>
          Hisobingiz bormi?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Kirish
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="F.I.Sh"
          placeholder="Familiya Ism"
          value={form.full_name}
          onChange={set('full_name')}
          required
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="email@example.uz"
          value={form.email}
          onChange={set('email')}
          required
        />
        <Select label="Rol" value={form.role} onChange={set('role')} required>
          <option value="intern">Amaliyotchi</option>
          <option value="mentor">Mentor</option>
        </Select>
        <PasswordInput
          label="Parol"
          autoComplete="new-password"
          hint="Kamida 8 belgi"
          placeholder="••••••••"
          value={form.password}
          onChange={set('password')}
          required
        />
        <PasswordInput
          label="Parolni tasdiqlash"
          autoComplete="new-password"
          placeholder="••••••••"
          value={form.confirm}
          onChange={set('confirm')}
          required
        />

        <Button type="submit" className="w-full" loading={loading}>
          <UserPlus className="h-4 w-4" />
          Ro'yxatdan o'tish
        </Button>
      </form>
    </AuthLayout>
  );
}
