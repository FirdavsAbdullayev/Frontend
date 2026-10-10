import dayjs from 'dayjs';

export const formatDate = (value, template = 'DD.MM.YYYY') =>
  value ? dayjs(value).format(template) : '—';

export const formatDateTime = (value) =>
  value ? dayjs(value).format('DD.MM.YYYY HH:mm') : '—';

export const formatHours = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '0';
  return Number.isInteger(num) ? String(num) : num.toFixed(1);
};

export const formatPercent = (value) => `${Number(value || 0).toFixed(0)}%`;

export const fullName = (person) => person?.full_name || '—';
