import { useState } from 'react';
import { Download, FileSpreadsheet, CalendarRange } from 'lucide-react';
import { exportApi } from '../../api/endpoints';
import { extractErrorMessage } from '../../api/client';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Field';
import { DEPLOYMENT_STATUS_LABELS } from '../../lib/labels';

export default function ExportPage() {
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  const download = async (type) => {
    setLoading(type);
    setError('');
    try {
      if (type === 'deployments') {
        await exportApi.deployments({ status: status || undefined });
      } else {
        await exportApi.attendance({ from: from || undefined, to: to || undefined });
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading('');
    }
  };

  return (
    <div>
      <PageHeader title="Hisobot eksporti" description="CSV formatida yuklab olish (UTF-8, Excel uchun mos)" />

      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Amaliyot natijalari" subtitle="Barcha amaliyotlar va progress ko'rsatkichlari" />
          <CardBody className="space-y-4">
            <Select label="Holat bo'yicha" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Barchasi</option>
              {Object.entries(DEPLOYMENT_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
            <Button loading={loading === 'deployments'} onClick={() => download('deployments')}>
              <FileSpreadsheet className="h-4 w-4" /> deployments.csv
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Davomat jurnali" subtitle="Kunlik qaydlar bo'yicha davomat va soatlar" />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Sanadan" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              <Input label="Sanagacha" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <Button loading={loading === 'attendance'} onClick={() => download('attendance')}>
              <CalendarRange className="h-4 w-4" /> attendance.csv
            </Button>
          </CardBody>
        </Card>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
        <Download className="h-3.5 w-3.5" /> Fayllar BOM bilan UTF-8 kodirovkada, nuqtali vergul bilan ajratilgan holda yuklanadi.
      </p>
    </div>
  );
}
