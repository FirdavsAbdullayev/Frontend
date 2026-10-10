import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cn';

export default function ThemeToggle({ className, variant = 'ghost' }) {
  const { isDark, toggleTheme } = useTheme();

  const styles =
    variant === 'button'
      ? 'h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
      : 'h-9 w-9 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Yorug\' rejimga o\'tish' : 'Qorong\'i rejimga o\'tish'}
      aria-label="Mavzuni almashtirish"
      className={cn(
        'flex items-center justify-center transition-colors',
        styles,
        className
      )}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
