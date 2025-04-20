
import { useParams } from 'react-router-dom';
import PatientDetail from '@/components/patients/PatientDetail';
import BreadcrumbNav from '@/components/layout/Breadcrumb';

const PatientDetailPage = () => {
  const { patientCode } = useParams<{ patientCode: string }>();

  return (
    <div className="space-y-4">
      <BreadcrumbNav 
        items={[
          { label: 'Patients', href: '/patients' },
          { label: patientCode || '' }
        ]}
      />
      <PatientDetail />
    </div>
  );
};

export default PatientDetailPage;
