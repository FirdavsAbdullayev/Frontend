import PageHeader from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import WeeklyReportsPanel from '../../components/logs/WeeklyReportsPanel';

export default function EvaluationsPage() {
  return (
    <div>
      <PageHeader
        title="Baholash"
        description="Haftalik hisobotlarni 5 ta mezon bo'yicha baholang"
      />
      <Card className="p-4">
        <WeeklyReportsPanel role="mentor" title="Amaliyotchilar haftalik hisobotlari" />
      </Card>
    </div>
  );
}
