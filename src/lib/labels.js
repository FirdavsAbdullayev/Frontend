export const ROLE_LABELS = {
  coordinator: 'Koordinator',
  intern: 'Amaliyotchi',
  mentor: 'Mentor',
};

export const DEPLOYMENT_STATUS_LABELS = {
  placed: 'Joylashtirilgan',
  in_progress: 'Davom etmoqda',
  paused: "To'xtatilgan",
  completed: 'Yakunlangan',
  terminated_early: 'Muddatidan oldin tugatilgan',
};

export const DEPLOYMENT_STATUS_STYLES = {
  placed: 'bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20',
  in_progress:
    'bg-brand-100 text-brand-700 ring-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-500/20',
  paused: 'bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20',
  completed:
    'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
  terminated_early:
    'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20',
};

export const LOG_STATUS_LABELS = {
  draft: 'Qoralama',
  submitted: 'Tekshiruvda',
  approved: 'Tasdiqlangan',
  rejected: 'Rad etilgan',
};

export const LOG_STATUS_STYLES = {
  draft: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
  submitted: 'bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20',
  approved:
    'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
  rejected: 'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20',
};

export const ATTENDANCE_LABELS = {
  present: 'Kelgan',
  excused: 'Sababli kelmagan',
  unexcused: 'Sababsiz kelmagan',
  day_off: 'Dam kuni',
};

export const SCORE_FIELDS = [
  { key: 'score_discipline', label: 'Intizom' },
  { key: 'score_quality', label: 'Sifat' },
  { key: 'score_deadline', label: 'Muddat' },
  { key: 'score_independence', label: 'Mustaqillik' },
  { key: 'score_teamwork', label: 'Jamoada ishlash' },
];
