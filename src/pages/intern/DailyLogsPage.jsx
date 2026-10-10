import PageHeader from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import DailyLogsPanel from '../../components/logs/DailyLogsPanel';

export default function DailyLogsPage() {
  return (
    <div>
      <PageHeader
        title="Kunlik qaydlar"
        description="Har bir ish kuni uchun soat, vazifa va natija havolasini kiriting"
      />
      <Card className="p-4">
        <DailyLogsPanel role="intern" title="Mening kunlik qaydlarim" />
      </Card>
    </div>
  );
}
