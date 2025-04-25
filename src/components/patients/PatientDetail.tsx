
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient } from '@/types';
import { PatientDetailHeader } from './PatientDetailHeader';
import { PatientInformationForm } from './PatientInformationForm';
import { PatientTransactionsTable } from './PatientTransactionsTable';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';

interface PatientDetailProps {
  patient: Patient;
}

export function PatientDetail({ patient }: PatientDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient>(patient);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePatientChange = (updatedPatient: Patient) => {
    setCurrentPatient(updatedPatient);
  };

  const handleSaveChanges = () => {
    // Save the patient data to localStorage
    try {
      // Save as a complete object
      localStorage.setItem(`patient_${currentPatient.id}`, JSON.stringify(currentPatient));
      
      // Also save individual fields for backward compatibility
      localStorage.setItem(`patient_${currentPatient.id}_firstName`, currentPatient.firstName);
      localStorage.setItem(`patient_${currentPatient.id}_lastName`, currentPatient.lastName);
      localStorage.setItem(`patient_${currentPatient.id}_age`, currentPatient.age.toString());
      localStorage.setItem(`patient_${currentPatient.id}_email`, currentPatient.email);
      localStorage.setItem(`patient_${currentPatient.id}_phone`, currentPatient.phone);
      localStorage.setItem(`patient_${currentPatient.id}_address`, currentPatient.address);
      localStorage.setItem(`patient_${currentPatient.id}_code`, currentPatient.code);
      
      if (currentPatient.sex) {
        localStorage.setItem(`patient_${currentPatient.id}_sex`, currentPatient.sex);
      }
      
      toast({
        title: "Success",
        description: "Patient information has been updated.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving patient data:', error);
      toast({
        title: "Error",
        description: "Failed to save patient information.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <PatientDetailHeader 
        patient={currentPatient}
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
            patient={currentPatient}
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
          <PatientTransactionsTable patientCode={currentPatient.code} />
        </CardContent>
      </Card>
    </div>
  );
}

export default PatientDetail;
