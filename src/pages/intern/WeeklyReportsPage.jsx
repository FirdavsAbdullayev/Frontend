import PageHeader from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import WeeklyReportsPanel from '../../components/logs/WeeklyReportsPanel';

export default function WeeklyReportsPage() {
  return (
    <div>
      <PageHeader
        title="Haftalik hisobotlar"
        description="Haftalik xulosa, qiyinchiliklar va keyingi hafta rejasi"
      />
      <Card className="p-4">
        <WeeklyReportsPanel role="intern" title="Mening hisobotlarim" />
      </Card>
    </div>
  );
}
