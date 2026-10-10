import PageHeader from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import DailyLogsPanel from '../../components/logs/DailyLogsPanel';

export default function ReviewPage() {
  return (
    <div>
      <PageHeader
        title="Qaydlarni tekshirish"
        description="Kunlik qaydlarni tasdiqlang yoki izoh bilan qaytaring"
      />
      <Card className="p-4">
        <DailyLogsPanel role="mentor" title="Amaliyotchilar kunlik qaydlari" defaultStatus="submitted" />
      </Card>
    </div>
  );
}
