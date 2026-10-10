import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './ui/Spinner';
import Forbidden from '../pages/Forbidden';

function FullScreenLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner label="Yuklanmoqda..." />
    </div>
  );
}

/** Faqat tizimga kirgan foydalanuvchilar uchun. */
export function RequireAuth() {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}

/** Faqat tizimga KIRMAGAN foydalanuvchilar uchun (login, signup). */
export function RequireGuest() {
  const { user, initializing } = useAuth();
  if (initializing) return <FullScreenLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

/** Ma'lum rol(lar) uchun; ruxsat bo'lmasa 403 sahifasini ko'rsatadi. */
export function RequireRole({ roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Forbidden />;
  return <Outlet />;
}
