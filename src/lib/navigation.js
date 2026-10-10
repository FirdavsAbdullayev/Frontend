import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  CalendarClock,
  ScrollText,
  BookOpenCheck,
  FileBarChart,
  PenSquare,
  ClipboardCheck,
  Download,
} from 'lucide-react';

export const NAV_GROUPS_BY_ROLE = {
  coordinator: [
    {
      title: 'Asosiy',
      items: [{ to: '/dashboard', label: 'Boshqaruv paneli', icon: LayoutDashboard }],
    },
    {
      title: 'Boshqaruv',
      items: [
        { to: '/deployments', label: 'Amaliyotlar', icon: ClipboardList },
        { to: '/users', label: 'Foydalanuvchilar', icon: Users },
        { to: '/companies', label: 'Kompaniyalar', icon: Building2 },
      ],
    },
    {
      title: 'Monitoring',
      items: [
        { to: '/reminders', label: 'Eslatmalar', icon: CalendarClock },
        { to: '/audit', label: 'Audit jurnali', icon: ScrollText },
        { to: '/export', label: 'Hisobot eksporti', icon: Download },
      ],
    },
  ],
  intern: [
    {
      title: 'Asosiy',
      items: [{ to: '/dashboard', label: 'Boshqaruv paneli', icon: LayoutDashboard }],
    },
    {
      title: 'Mening amaliyotim',
      items: [
        { to: '/my-practice', label: 'Amaliyot tafsilotlari', icon: BookOpenCheck },
        { to: '/daily-logs', label: 'Kunlik qaydlar', icon: PenSquare },
        { to: '/weekly-reports', label: 'Haftalik hisobotlar', icon: FileBarChart },
      ],
    },
  ],
  mentor: [
    {
      title: 'Asosiy',
      items: [{ to: '/dashboard', label: 'Boshqaruv paneli', icon: LayoutDashboard }],
    },
    {
      title: 'Vazifalar',
      items: [
        { to: '/advisees', label: 'Amaliyotchilarim', icon: Users },
        { to: '/review', label: 'Qaydlarni tekshirish', icon: ClipboardCheck },
        { to: '/evaluations', label: 'Baholash', icon: FileBarChart },
      ],
    },
  ],
};

export function navLabelForPath(pathname, role) {
  const groups = NAV_GROUPS_BY_ROLE[role] || [];
  for (const group of groups) {
    for (const item of group.items) {
      if (pathname === item.to || (item.to !== '/dashboard' && pathname.startsWith(item.to))) {
        return item.label;
      }
    }
  }
  return 'Boshqaruv paneli';
}
