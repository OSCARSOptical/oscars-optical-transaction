
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PatientDetail from '@/components/patients/PatientDetail';
import BreadcrumbNav from '@/components/layout/Breadcrumb';
import { Patient } from '@/types';

const PatientDetailPage = () => {
  const { patientCode } = useParams<{ patientCode: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!patientCode) return;

    // Try to find the patient in localStorage
    try {
      // First, check if any complete patient object has matching code
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('patient_') && !key.includes('_')) {
          const patientJson = localStorage.getItem(key);
          if (patientJson) {
            try {
              const storedPatient = JSON.parse(patientJson);
              if (storedPatient && storedPatient.code === patientCode) {
                console.log("Found complete patient with matching code:", storedPatient);
                setPatient(storedPatient);
                return;
              }
            } catch (e) {
              console.error("Error parsing patient JSON:", e);
            }
          }
        }
      }

      // If not found, try to reconstruct from individual fields
      // Find the patient ID from the code
      let patientId = null;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('_code')) {
          const code = localStorage.getItem(key);
          if (code === patientCode) {
            patientId = key.split('_')[1]; // Extract ID from key format: patient_ID_code
            console.log("Found patient ID from code:", patientId);
            break;
          }
        }
      }

      if (patientId) {
        // Reconstruct patient from individual fields
        const reconstructedPatient: Patient = {
          id: patientId,
          code: patientCode,
          firstName: localStorage.getItem(`patient_${patientId}_firstName`) || "",
          lastName: localStorage.getItem(`patient_${patientId}_lastName`) || "",
          age: Number(localStorage.getItem(`patient_${patientId}_age`)) || 0,
          email: localStorage.getItem(`patient_${patientId}_email`) || "",
          phone: localStorage.getItem(`patient_${patientId}_phone`) || "",
          address: localStorage.getItem(`patient_${patientId}_address`) || "",
          sex: (localStorage.getItem(`patient_${patientId}_sex`) as 'Male' | 'Female') || undefined
        };

        console.log("Reconstructed patient:", reconstructedPatient);
        
        // Store the complete patient object for future use
        localStorage.setItem(`patient_${patientId}`, JSON.stringify(reconstructedPatient));
        setPatient(reconstructedPatient);
      } else {
        console.log("No patient found with code:", patientCode);
        setPatient(null);
      }
    } catch (error) {
      console.error('Error loading patient details:', error);
      setPatient(null);
    }
  }, [patientCode]);

  return (
    <div className="space-y-4">
      <BreadcrumbNav 
        items={[
          { label: 'Patients', href: '/patients' },
          { label: patient ? `${patient.firstName} ${patient.lastName}` : 'No Patient Found' }
        ]}
      />
      {patient ? <PatientDetail patient={patient} /> : <div>No patient found. Please import patients.</div>}
    </div>
  );
};

export default PatientDetailPage;
