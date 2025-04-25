
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient } from '@/types';
import { PatientDetailHeader } from './PatientDetailHeader';
import { PatientInformationForm } from './PatientInformationForm';
import { PatientTransactionsTable } from './PatientTransactionsTable';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';

export function PatientDetail() {
  const { patientCode } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!patientCode) return;
    
    // Check localStorage for patient data
    const storedPatientData = localStorage.getItem(`patient_${patientCode}`);
    if (storedPatientData) {
      try {
        const parsedPatient = JSON.parse(storedPatientData);
        setPatient(parsedPatient);
        return;
      } catch (e) {
        console.error("Failed to parse stored patient data", e);
      }
    }
    
    // If no stored patient data found, reconstruct from individual fields
    // Try to find patient ID from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('_code') && localStorage.getItem(key) === patientCode) {
        const patientId = key.split('_')[1];
        
        if (patientId) {
          const reconstructedPatient = {
            id: patientId,
            code: patientCode,
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
  }, [patientCode]);

  const handlePatientChange = (updatedPatient: Patient) => {
    setPatient(updatedPatient);
  };

  const handleSaveChanges = () => {
    if (!patient) return;
    
    // Save all patient fields individually
    localStorage.setItem(`patient_${patient.id}_firstName`, patient.firstName);
    localStorage.setItem(`patient_${patient.id}_lastName`, patient.lastName);
    localStorage.setItem(`patient_${patient.id}_age`, patient.age.toString());
    localStorage.setItem(`patient_${patient.id}_email`, patient.email);
    localStorage.setItem(`patient_${patient.id}_phone`, patient.phone);
    localStorage.setItem(`patient_${patient.id}_address`, patient.address);
    if (patient.sex) {
      localStorage.setItem(`patient_${patient.id}_sex`, patient.sex);
    }
    localStorage.setItem(`patient_${patient.id}_code`, patient.code);
    
    // Also save the complete patient object
    localStorage.setItem(`patient_${patient.code}`, JSON.stringify(patient));
    
    toast({
      title: "Success",
      description: "Patient information has been updated.",
    });
    
    setIsEditing(false);
  };

  if (!patient) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading patient information...</div>;
  }

  return (
    <div className="space-y-6">
      <PatientDetailHeader 
        patient={patient}
        isEditing={isEditing}
        onEditToggle={() => setIsEditing(!isEditing)}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Patient Information</CardTitle>
          {isEditing && (
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          )}
        </CardHeader>
        <CardContent>
          <PatientInformationForm 
            patient={patient}
            isEditing={isEditing}
            onPatientChange={handlePatientChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientTransactionsTable patientCode={patient.code} />
        </CardContent>
      </Card>
    </div>
  );
}

export default PatientDetail;
