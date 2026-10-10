import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/cn';

const baseControl =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-800';

function Wrapper({ label, hint, error, required, children, className }) {
  return (
    <label className={cn('block', className)}>
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-slate-400 dark:text-slate-500">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}
    </label>
  );
}

export function Input({ label, hint, error, required, className, ...props }) {
  return (
    <Wrapper label={label} hint={hint} error={error} required={required} className={className}>
      <input className={baseControl} required={required} {...props} />
    </Wrapper>
  );
}

export function Textarea({ label, hint, error, required, className, rows = 3, ...props }) {
  return (
    <Wrapper label={label} hint={hint} error={error} required={required} className={className}>
      <textarea className={baseControl} rows={rows} required={required} {...props} />
    </Wrapper>
  );
}

export function Select({ label, hint, error, required, className, children, ...props }) {
  return (
    <Wrapper label={label} hint={hint} error={error} required={required} className={className}>
      <select className={baseControl} required={required} {...props}>
        {children}
      </select>
    </Wrapper>
  );
}

export function PasswordInput({ label, hint, error, required, className, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <Wrapper label={label} hint={hint} error={error} required={required} className={className}>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          className={cn(baseControl, 'pr-10')}
          required={required}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label={visible ? 'Parolni yashirish' : "Parolni ko'rsatish"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </Wrapper>
  );
}
