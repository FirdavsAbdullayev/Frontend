import { NavLink } from 'react-router-dom';
import { GraduationCap, Sparkles } from 'lucide-react';
import { NAV_GROUPS_BY_ROLE } from '../../lib/navigation';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../lib/labels';
import { cn } from '../../lib/cn';

export default function Sidebar({ onNavigate }) {
  const { user } = useAuth();
  const groups = NAV_GROUPS_BY_ROLE[user?.role] || [];

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-800/60 bg-slate-950">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-lg shadow-brand-900/40">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Algoritm</p>
          <p className="text-[11px] text-slate-500">Amaliyot monitoringi</p>
        </div>
      </div>

      <nav className="sidebar-scroll flex-1 space-y-6 overflow-y-auto px-3 py-3">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-white/[0.07] text-white'
                        : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-brand-400" />
                      )}
                      <Icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0',
                          isActive ? 'text-brand-300' : 'text-slate-500 group-hover:text-slate-300'
                        )}
                      />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-800/60 p-4">
        <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2.5 ring-1 ring-inset ring-white/5">
          <Sparkles className="h-4 w-4 text-brand-300" />
          <div className="leading-tight">
            <p className="text-xs font-medium text-slate-200">{ROLE_LABELS[user?.role] || '—'}</p>
            <p className="text-[10px] text-slate-500">Amaliyot monitoringi · v1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
