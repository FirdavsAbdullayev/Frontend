import { GraduationCap, ShieldCheck, LineChart, Clock } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

const FEATURES = [
  { icon: LineChart, text: 'Amaliyot rejasi va real vaqtda progress kuzatuvi' },
  { icon: ShieldCheck, text: 'Kunlik qaydlar va mentor tasdiqlash jarayoni' },
  { icon: Clock, text: 'Avtomatik eslatmalar va audit jurnali' },
];

const STATS = [
  { value: '3', label: 'Rol' },
  { value: '5', label: 'Baholash mezoni' },
  { value: '72s', label: 'Taklif muddati' },
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-full bg-slate-50 dark:bg-slate-950">
      <ThemeToggle className="absolute right-4 top-4 z-20" />
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex">
        <div className="grid-pattern pointer-events-none absolute inset-0" />
        <div
          className="pointer-events-none absolute -left-32 top-1/4 h-[28rem] w-[28rem] rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, #4f46e5 0%, transparent 70%)' }}
        />
        <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 shadow-lg shadow-brand-900/40">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-base font-semibold">Algoritm</p>
            <p className="text-xs text-slate-400">Amaliyot monitoringi</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <p className="mb-3 inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-brand-200 ring-1 ring-inset ring-white/10">
            Amaliyot boshqaruv platformasi
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            Amaliyotni shaffof va tizimli boshqaring
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Koordinator, mentor va amaliyotchilar uchun yagona, ishonchli tizim.
          </p>

          <ul className="mt-8 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-brand-300 ring-1 ring-inset ring-white/10">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-8">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-10 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Algoritm</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Amaliyot monitoringi</p>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
            {children}
          </div>

          {footer && <div className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
