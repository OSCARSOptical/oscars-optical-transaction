
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PatientDetail from '@/components/patients/PatientDetail';
import BreadcrumbNav from '@/components/layout/Breadcrumb';
import { Patient } from '@/types';

const PatientDetailPage = () => {
  const { patientCode } = useParams<{ patientCode: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    // No sample data, so set patient to null by default
    setPatient(null);
  }, [patientCode]);

  return (
    <div className="space-y-4">
      <BreadcrumbNav 
        items={[
          { label: 'Patients', href: '/patients' },
          { label: patient ? `${patient.firstName} ${patient.lastName}` : 'No Patient Found' }
        ]}
      />
      {patient ? <PatientDetail /> : <div>No patient found. Please import patients.</div>}
    </div>
  );
};

export default PatientDetailPage;
