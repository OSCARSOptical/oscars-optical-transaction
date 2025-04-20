import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Patient } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { usePatientTransactions } from "@/hooks/usePatientTransactions";

interface PatientInfoProps {
  patient?: Patient;
  onPatientUpdate?: (updatedPatient: Patient) => void;
}

const PatientInfo = ({ patient, onPatientUpdate }: PatientInfoProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [patientData, setPatientData] = useState<Patient | undefined>(patient);
  const { transactions } = usePatientTransactions(patient?.code || "");

  // If no patient is provided, create a default empty patient
  const currentPatient = patientData || {
    id: "",
    code: "",
    firstName: "",
    lastName: "",
    age: 0,
    sex: 'Male' as 'Male' | 'Female',
    email: "",
    phone: "",
    address: ""
  };

  // Update local state when patient prop changes
  useEffect(() => {
    if (patient) {
      setPatientData(patient);
    }
  }, [patient]);

  // Generate patient code based on first name and last name
  const generatePatientCode = (firstName: string, lastName: string) => {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    
    // Keep the same sequence number if it exists, otherwise generate a new one
    const existingCode = currentPatient.code;
    const sequencePart = existingCode && existingCode.includes('-') ? 
                         existingCode.split('-')[2] : 
                         "0000001";
    
    return `PX-${firstInitial}${lastInitial}-${sequencePart}`;
  };

  const handleFieldChange = (field: string, value: string | number) => {
    if (!patientData) return;
    
    const updatedPatient = { ...patientData, [field]: value };
    
    // If first name or last name changes, update the patient code
    if (field === 'firstName' || field === 'lastName') {
      const newCode = generatePatientCode(
        field === 'firstName' ? value.toString() : patientData.firstName,
        field === 'lastName' ? value.toString() : patientData.lastName
      );
      updatedPatient.code = newCode;
    }
    
    setPatientData(updatedPatient);
    
    // Propagate changes to parent component for real-time updates
    if (onPatientUpdate) {
      onPatientUpdate(updatedPatient);
    }
  };

  const handleSave = () => {
    if (!patientData) return;
    
    // Get the old patient code before saving changes
    const oldPatientCode = patient?.code;
    const newPatientCode = patientData.code;
    
    // Save to localStorage
    localStorage.setItem(`patient_${patientData.id}_firstName`, patientData.firstName);
    localStorage.setItem(`patient_${patientData.id}_lastName`, patientData.lastName);
    localStorage.setItem(`patient_${patientData.id}_age`, patientData.age.toString());
    localStorage.setItem(`patient_${patientData.id}_email`, patientData.email);
    localStorage.setItem(`patient_${patientData.id}_phone`, patientData.phone);
    localStorage.setItem(`patient_${patientData.id}_address`, patientData.address);
    if (patientData.sex) {
      localStorage.setItem(`patient_${patientData.id}_sex`, patientData.sex);
    }
    localStorage.setItem(`patient_${patientData.id}_code`, patientData.code);
    
    // Update linked transactions if the patient code has changed
    if (oldPatientCode && newPatientCode && oldPatientCode !== newPatientCode) {
      // In a real app with a database, this would be a transaction/batch operation
      // Here we'll update the localStorage records for any transactions
      
      // For each transaction that was linked to the old patient code
      transactions.forEach(transaction => {
        const transactionKey = `transaction_${transaction.id}`;
        
        // Update patientCode in localStorage
        localStorage.setItem(`${transactionKey}_patientCode`, newPatientCode);
        
        // Also update the patient name fields if needed
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
    
    // Final update to parent to ensure consistency
    if (onPatientUpdate) {
      onPatientUpdate(patientData);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Patient Information</CardTitle>
        {patient && (
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
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <Input
                value={currentPatient.firstName}
                onChange={(e) => 
                  handleFieldChange('firstName', e.target.value)
                }
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <Input
                value={currentPatient.lastName}
                onChange={(e) => 
                  handleFieldChange('lastName', e.target.value)
                }
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Age</label>
              <Input
                type="number"
                value={currentPatient.age}
                onChange={(e) => 
                  handleFieldChange('age', parseInt(e.target.value) || 0)
                }
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Sex</label>
              <Select 
                value={currentPatient.sex || 'Male'} 
                onValueChange={(value) => handleFieldChange('sex', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Contact Number</label>
              <Input
                value={currentPatient.phone}
                onChange={(e) => 
                  handleFieldChange('phone', e.target.value)
                }
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={currentPatient.email}
                onChange={(e) => 
                  handleFieldChange('email', e.target.value)
                }
                readOnly={!isEditing}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={currentPatient.address}
                onChange={(e) => 
                  handleFieldChange('address', e.target.value)
                }
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>
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
