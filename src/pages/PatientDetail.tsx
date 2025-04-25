
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PatientDetail from '@/components/patients/PatientDetail';
import BreadcrumbNav from '@/components/layout/Breadcrumb';
import { Patient } from '@/types';
import { normalizePatientCode } from '@/utils/patientUtils';

const PatientDetailPage = () => {
  const { patientCode } = useParams<{ patientCode: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!patientCode) return;
    
    // Normalize the patient code to handle legacy format
    const normalizedCode = normalizePatientCode(patientCode);
    
    // Check localStorage for patient data
    const storedPatientData = localStorage.getItem(`patient_${normalizedCode}`);
    if (storedPatientData) {
      try {
        const parsedPatient = JSON.parse(storedPatientData);
        setPatient(parsedPatient);
        return;
      } catch (e) {
        console.error("Failed to parse stored patient data", e);
      }
    }
    
    // If no direct match, try to find by searching through all localStorage entries
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('_code') && 
          (localStorage.getItem(key) === normalizedCode || localStorage.getItem(key) === patientCode)) {
        const patientId = key.split('_')[1];
        
        if (patientId) {
          const storedCode = localStorage.getItem(`patient_${patientId}_code`);
          const reconstructedPatient = {
            id: patientId,
            code: storedCode || normalizedCode,
            firstName: localStorage.getItem(`patient_${patientId}_firstName`) || "",
            lastName: localStorage.getItem(`patient_${patientId}_lastName`) || "",
            age: localStorage.getItem(`patient_${patientId}_age`) ? parseInt(localStorage.getItem(`patient_${patientId}_age`)!) : 0,
            email: localStorage.getItem(`patient_${patientId}_email`) || "",
            phone: localStorage.getItem(`patient_${patientId}_phone`) || "",
            address: localStorage.getItem(`patient_${patientId}_address`) || "",
            sex: (localStorage.getItem(`patient_${patientId}_sex`) as 'Male' | 'Female') || undefined
          };
          
          setPatient(reconstructedPatient);
          return;
        }
      }
    }
    
    // If we still don't have a patient, check if there's patient data stored with the original code
    const originalCodeData = localStorage.getItem(`patient_${patientCode}`);
    if (originalCodeData) {
      try {
        const parsedPatient = JSON.parse(originalCodeData);
        setPatient(parsedPatient);
        return;
      } catch (e) {
        console.error("Failed to parse stored patient data", e);
      }
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
