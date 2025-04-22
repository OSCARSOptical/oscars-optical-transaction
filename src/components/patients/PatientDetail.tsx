import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient } from '@/types';
import { PatientDetailHeader } from './PatientDetailHeader';
import { PatientInformationForm } from './PatientInformationForm';
import { PatientTransactionsTable } from './PatientTransactionsTable';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { samplePatients } from '@/data';

export function PatientDetail() {
  const { patientCode } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const foundPatient = samplePatients.find(p => p.code === patientCode);
    
    if (foundPatient) {
      const updatedPatient = {
        ...foundPatient,
        firstName: localStorage.getItem(`patient_${foundPatient.id}_firstName`) || foundPatient.firstName,
        lastName: localStorage.getItem(`patient_${foundPatient.id}_lastName`) || foundPatient.lastName,
        age: localStorage.getItem(`patient_${foundPatient.id}_age`) ? parseInt(localStorage.getItem(`patient_${foundPatient.id}_age`)!) : foundPatient.age,
        email: localStorage.getItem(`patient_${foundPatient.id}_email`) || foundPatient.email,
        phone: localStorage.getItem(`patient_${foundPatient.id}_phone`) || foundPatient.phone,
        address: localStorage.getItem(`patient_${foundPatient.id}_address`) || foundPatient.address,
        sex: (localStorage.getItem(`patient_${foundPatient.id}_sex`) as 'Male' | 'Female') || foundPatient.sex
      };
      
      setPatient(updatedPatient);
    }
  }, [patientCode]);

  const handlePatientChange = (updatedPatient: Patient) => {
    setPatient(updatedPatient);
  };

  const handleSaveChanges = () => {
    if (!patient) return;
    
    localStorage.setItem(`patient_${patient.id}_firstName`, patient.firstName);
    localStorage.setItem(`patient_${patient.id}_lastName`, patient.lastName);
    localStorage.setItem(`patient_${patient.id}_age`, patient.age.toString());
    localStorage.setItem(`patient_${patient.id}_email`, patient.email);
    localStorage.setItem(`patient_${patient.id}_phone`, patient.phone);
    localStorage.setItem(`patient_${patient.id}_address`, patient.address);
    if (patient.sex) {
      localStorage.setItem(`patient_${patient.id}_sex`, patient.sex);
    }
    
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
