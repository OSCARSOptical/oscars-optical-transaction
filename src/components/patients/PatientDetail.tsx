
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient } from '@/types';
import { PatientDetailHeader } from './PatientDetailHeader';
import { PatientInformationForm } from './PatientInformationForm';
import { PatientTransactionHistory } from './PatientTransactionHistory';

export function PatientDetail() {
  const { patientCode } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [patient, setPatient] = useState<Patient>({
    id: '12345',
    code: patientCode || '',
    firstName: 'John',
    lastName: 'Doe',
    age: 35,
    email: 'john@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, City, State'
  });

  return (
    <div className="space-y-6">
      <PatientDetailHeader 
        patient={patient}
        isEditing={isEditing}
        onEditToggle={() => setIsEditing(!isEditing)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientInformationForm 
            patient={patient}
            isEditing={isEditing}
            onPatientChange={setPatient}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientTransactionHistory patientCode={patient.code} />
        </CardContent>
      </Card>
    </div>
  );
}

export default PatientDetail;
