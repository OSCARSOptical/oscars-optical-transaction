
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PatientDetail from '@/components/patients/PatientDetail';
import BreadcrumbNav from '@/components/layout/Breadcrumb';
import { Patient } from '@/types';

// Sample data with the new format
const samplePatients: Patient[] = [
  {
    id: '12345',
    firstName: 'John',
    lastName: 'Doe',
    age: 35,
    email: 'john@example.com',
    phone: '555-123-4567',
    address: '123 Main St, City, State',
    code: 'PX-JD-0000001'
  }, 
  {
    id: '67890',
    firstName: 'Jane',
    lastName: 'Smith',
    age: 28,
    email: 'jane@example.com',
    phone: '555-987-6543',
    address: '456 Oak St, City, State',
    code: 'PX-JS-0000001'
  },
  {
    id: '54321',
    firstName: 'Oscar',
    lastName: 'Santos',
    age: 40,
    email: 'oscar@example.com',
    phone: '555-555-1111',
    address: '789 Pine St, City, State',
    code: 'PX-OS-0000001'
  }
];

const PatientDetailPage = () => {
  const { patientCode } = useParams<{ patientCode: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    // Find the patient in sample data
    const foundPatient = samplePatients.find(p => p.code === patientCode);
    
    if (foundPatient) {
      // Check for localStorage updates
      const storedFirstName = localStorage.getItem(`patient_${foundPatient.id}_firstName`);
      const storedLastName = localStorage.getItem(`patient_${foundPatient.id}_lastName`);
      
      if (storedFirstName || storedLastName) {
        setPatient({
          ...foundPatient,
          firstName: storedFirstName || foundPatient.firstName,
          lastName: storedLastName || foundPatient.lastName
        });
      } else {
        setPatient(foundPatient);
      }
    } else {
      setPatient(null);
    }
  }, [patientCode]);

  return (
    <div className="space-y-4">
      <BreadcrumbNav 
        items={[
          { label: 'Patients', href: '/patients' },
          { label: patient ? `${patient.firstName} ${patient.lastName}` : 'Loading...' }
        ]}
      />
      <PatientDetail />
    </div>
  );
};

export default PatientDetailPage;
