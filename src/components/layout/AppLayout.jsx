import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, ChevronRight } from 'lucide-react';
import Sidebar from './Sidebar';
import ScrollToTop from '../ScrollToTop';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../lib/labels';
import { navLabelForPath } from '../../lib/navigation';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const current = navLabelForPath(location.pathname, user?.role);
  const initials = (user?.full_name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex h-full">
      <ScrollToTop />
      <aside className="hidden shrink-0 lg:block">
        <Sidebar />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full animate-fade-in">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <nav className="flex min-w-0 items-center gap-1.5 text-sm">
              <span className="hidden text-slate-400 sm:inline dark:text-slate-500">Algoritm</span>
              <ChevronRight className="hidden h-3.5 w-3.5 text-slate-300 sm:inline dark:text-slate-600" />
              <span className="truncate font-semibold text-slate-800 dark:text-slate-100">{current}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <div className="hidden items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 sm:flex dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-semibold text-white">
                {initials}
              </div>
              <div className="leading-none">
                <p className="text-xs font-medium text-slate-800 dark:text-slate-100">{user?.full_name}</p>
                <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">{ROLE_LABELS[user?.role]}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Chiqish"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          <div key={location.pathname} className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
