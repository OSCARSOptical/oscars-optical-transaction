
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient } from '@/types';
import { PatientDetailHeader } from './PatientDetailHeader';
import { PatientInformationForm } from './PatientInformationForm';
import { PatientTransactionsTable } from './PatientTransactionsTable';

// Sample data with the new format
const samplePatients: Patient[] = [
  {
    id: '12345',
    firstName: 'John',
    lastName: 'Doe',
    age: 35,
    email: 'john@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, City, State',
    code: 'PX-JD-0000001'
  }, 
  {
    id: '67890',
    firstName: 'Jane',
    lastName: 'Smith',
    age: 28,
    email: 'jane@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak St, City, State',
    code: 'PX-JS-0000001'
  },
  {
    id: '54321',
    firstName: 'Oscar',
    lastName: 'Santos',
    age: 40,
    email: 'oscar@example.com',
    phone: '(555) 555-1111',
    address: '789 Pine St, City, State',
    code: 'PX-OS-0000001'
  }
];

export function PatientDetail() {
  const { patientCode } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const foundPatient = samplePatients.find(p => p.code === patientCode);
    if (foundPatient) {
      setPatient(foundPatient);
    }
  }, [patientCode]);

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
          <PatientTransactionsTable patientCode={patient.code} />
        </CardContent>
      </Card>
    </div>
  );
}

export default PatientDetail;
