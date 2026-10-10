import { Navigate, Route, Routes } from 'react-router-dom';

import { RequireAuth, RequireGuest, RequireRole } from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import InviteAccept from './pages/InviteAccept';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

import UsersPage from './pages/coordinator/UsersPage';
import CompaniesPage from './pages/coordinator/CompaniesPage';
import DeploymentsPage from './pages/coordinator/DeploymentsPage';
import DeploymentDetailPage from './pages/coordinator/DeploymentDetailPage';
import AuditPage from './pages/coordinator/AuditPage';
import RemindersPage from './pages/coordinator/RemindersPage';
import ExportPage from './pages/coordinator/ExportPage';

import MyPracticePage from './pages/intern/MyPracticePage';
import DailyLogsPage from './pages/intern/DailyLogsPage';
import WeeklyReportsPage from './pages/intern/WeeklyReportsPage';

import AdviseesPage from './pages/mentor/AdviseesPage';
import ReviewPage from './pages/mentor/ReviewPage';
import EvaluationsPage from './pages/mentor/EvaluationsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<RequireGuest />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
      <Route path="/invite/:token" element={<InviteAccept />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route element={<RequireRole roles={['coordinator']} />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/deployments" element={<DeploymentsPage />} />
            <Route path="/deployments/:id" element={<DeploymentDetailPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/export" element={<ExportPage />} />
          </Route>

          <Route element={<RequireRole roles={['intern']} />}>
            <Route path="/my-practice" element={<MyPracticePage />} />
            <Route path="/daily-logs" element={<DailyLogsPage />} />
            <Route path="/weekly-reports" element={<WeeklyReportsPage />} />
          </Route>

          <Route element={<RequireRole roles={['mentor']} />}>
            <Route path="/advisees" element={<AdviseesPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/evaluations" element={<EvaluationsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
