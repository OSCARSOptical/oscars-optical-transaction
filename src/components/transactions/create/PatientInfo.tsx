
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Patient } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { usePatientCode } from "@/hooks/usePatientCode";
import { usePatientTransactions } from "@/hooks/usePatientTransactions";
import { savePatientToStorage } from "@/utils/patientStorage";
import PatientInfoFields from "./patient-info/PatientInfoFields";

interface PatientInfoProps {
  patient?: Patient;
  onPatientUpdate?: (updatedPatient: Patient) => void;
}

const PatientInfo = ({ patient: initialPatient, onPatientUpdate }: PatientInfoProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [patientData, setPatientData] = useState<Patient | undefined>(initialPatient);
  const { transactions } = usePatientTransactions(initialPatient?.code || "");
  const { generatePatientCode } = usePatientCode();

  useEffect(() => {
    if (initialPatient) {
      setPatientData(initialPatient);
    }
  }, [initialPatient]);

  if (!patientData) {
    return null;
  }

  const handleFieldChange = (field: string, value: string | number) => {
    const updatedPatient = { ...patientData, [field]: value };
    
    if (field === 'firstName' || field === 'lastName') {
      updatedPatient.code = generatePatientCode(
        field === 'firstName' ? value.toString() : patientData.firstName,
        field === 'lastName' ? value.toString() : patientData.lastName,
        patientData.code
      );
    }
    
    setPatientData(updatedPatient);
    
    if (onPatientUpdate) {
      onPatientUpdate(updatedPatient);
    }
  };

  const handleSave = () => {
    if (!patientData) return;
    
    const oldPatientCode = initialPatient?.code;
    const newPatientCode = patientData.code;
    
    // Save patient data
    savePatientToStorage(patientData);
    
    // Update linked transactions if the patient code has changed
    if (oldPatientCode && newPatientCode && oldPatientCode !== newPatientCode) {
      transactions.forEach(transaction => {
        const transactionKey = `transaction_${transaction.id}`;
        localStorage.setItem(`${transactionKey}_patientCode`, newPatientCode);
        localStorage.setItem(`${transactionKey}_firstName`, patientData.firstName);
        localStorage.setItem(`${transactionKey}_lastName`, patientData.lastName);
        localStorage.setItem(`${transactionKey}_patientName`, `${patientData.firstName} ${patientData.lastName}`);
      });
    }
    
    toast({
      title: "Success",
      description: "Patient information has been updated.",
    });
    
    setIsEditing(false);
    
    if (onPatientUpdate) {
      onPatientUpdate(patientData);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Patient Information</CardTitle>
        {initialPatient && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <PatientInfoFields 
          patient={patientData}
          isEditing={isEditing}
          onFieldChange={handleFieldChange}
        />
        {isEditing && (
          <div className="flex justify-end mt-4">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientInfo;
