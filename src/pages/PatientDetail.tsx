
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PatientDetail from '@/components/patients/PatientDetail';
import BreadcrumbNav from '@/components/layout/Breadcrumb';
import { Patient } from '@/types';
import { samplePatients } from '@/data';
import { normalizePatientCode } from '@/utils/patientUtils';

const PatientDetailPage = () => {
  const { patientCode } = useParams<{ patientCode: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!patientCode) return;
    
    // Normalize the patient code to handle legacy format
    const normalizedCode = normalizePatientCode(patientCode);
    
    // Find the patient in sample data
    const foundPatient = samplePatients.find(p => 
      p.code === normalizedCode || p.code === patientCode
    );
    
    if (foundPatient) {
      // Check for localStorage updates
      const storedFirstName = localStorage.getItem(`patient_${foundPatient.id}_firstName`);
      const storedLastName = localStorage.getItem(`patient_${foundPatient.id}_lastName`);
      const storedAge = localStorage.getItem(`patient_${foundPatient.id}_age`);
      const storedEmail = localStorage.getItem(`patient_${foundPatient.id}_email`);
      const storedPhone = localStorage.getItem(`patient_${foundPatient.id}_phone`);
      const storedAddress = localStorage.getItem(`patient_${foundPatient.id}_address`);
      const storedSex = localStorage.getItem(`patient_${foundPatient.id}_sex`);
      
      if (storedFirstName || storedLastName || storedAge || storedEmail || storedPhone || storedAddress || storedSex) {
        setPatient({
          ...foundPatient,
          firstName: storedFirstName || foundPatient.firstName,
          lastName: storedLastName || foundPatient.lastName,
          age: storedAge ? parseInt(storedAge) : foundPatient.age,
          email: storedEmail || foundPatient.email,
          phone: storedPhone || foundPatient.phone,
          address: storedAddress || foundPatient.address,
          sex: (storedSex as 'Male' | 'Female') || foundPatient.sex
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
