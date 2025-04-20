
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient } from '@/types';
import { PatientDetailHeader } from './PatientDetailHeader';
import { PatientInformationForm } from './PatientInformationForm';
import { PatientTransactionsTable } from './PatientTransactionsTable';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';

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
    code: 'PX-JD-0000001',
    sex: 'Male'
  }, 
  {
    id: '67890',
    firstName: 'Jane',
    lastName: 'Smith',
    age: 28,
    email: 'jane@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak St, City, State',
    code: 'PX-JS-0000001',
    sex: 'Female'
  },
  {
    id: '54321',
    firstName: 'Oscar',
    lastName: 'Santos',
    age: 40,
    email: 'oscar@example.com',
    phone: '(555) 555-1111',
    address: '789 Pine St, City, State',
    code: 'PX-OS-0000001',
    sex: 'Male'
  }
];

export function PatientDetail() {
  const { patientCode } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // First try to load from sample data
    const foundPatient = samplePatients.find(p => p.code === patientCode);
    
    if (foundPatient) {
      // Check if there are any localStorage updates
      const storedFirstName = localStorage.getItem(`patient_${foundPatient.id}_firstName`);
      const storedLastName = localStorage.getItem(`patient_${foundPatient.id}_lastName`);
      const storedAge = localStorage.getItem(`patient_${foundPatient.id}_age`);
      const storedEmail = localStorage.getItem(`patient_${foundPatient.id}_email`);
      const storedPhone = localStorage.getItem(`patient_${foundPatient.id}_phone`);
      const storedAddress = localStorage.getItem(`patient_${foundPatient.id}_address`);
      const storedSex = localStorage.getItem(`patient_${foundPatient.id}_sex`);
      
      // Create updated patient with localStorage values if they exist
      const updatedPatient = {
        ...foundPatient,
        firstName: storedFirstName || foundPatient.firstName,
        lastName: storedLastName || foundPatient.lastName,
        age: storedAge ? parseInt(storedAge) : foundPatient.age,
        email: storedEmail || foundPatient.email,
        phone: storedPhone || foundPatient.phone,
        address: storedAddress || foundPatient.address,
        sex: (storedSex as 'Male' | 'Female') || foundPatient.sex
      };
      
      setPatient(updatedPatient);
    }
  }, [patientCode]);

  const handlePatientChange = (updatedPatient: Patient) => {
    setPatient(updatedPatient);
  };

  const handleSaveChanges = () => {
    if (!patient) return;
    
    // Save to localStorage
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
