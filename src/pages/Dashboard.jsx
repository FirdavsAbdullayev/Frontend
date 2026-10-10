import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import CoordinatorDashboard from './dashboard/CoordinatorDashboard';
import InternDashboard from './dashboard/InternDashboard';
import MentorDashboard from './dashboard/MentorDashboard';
import { ROLE_LABELS } from '../lib/labels';

export default function Dashboard() {
  const { user } = useAuth();

  const dashboards = {
    coordinator: CoordinatorDashboard,
    intern: InternDashboard,
    mentor: MentorDashboard,
  };
  const Component = dashboards[user.role] || InternDashboard;

  return (
    <div>
      <PageHeader
        title={`Xush kelibsiz, ${user.full_name}`}
        description={`${ROLE_LABELS[user.role]} kabineti`}
      />
      <Component />
    </div>
  );
}
