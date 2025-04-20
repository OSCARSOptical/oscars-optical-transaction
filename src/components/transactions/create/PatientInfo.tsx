
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Patient } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";

interface PatientInfoProps {
  patient?: Patient;
}

const PatientInfo = ({ patient }: PatientInfoProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [patientData, setPatientData] = useState<Patient | undefined>(patient);

  // If no patient is provided, create a default empty patient
  const currentPatient = patientData || {
    id: "",
    code: "",
    firstName: "",
    lastName: "",
    age: 0,
    sex: 'Other' as 'Male' | 'Female' | 'Other',
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

  const handleSave = () => {
    if (!patientData) return;
    
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
    
    toast({
      title: "Success",
      description: "Patient information has been updated.",
    });
    
    setIsEditing(false);
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
                  setPatientData({ ...currentPatient, firstName: e.target.value })
                }
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <Input
                value={currentPatient.lastName}
                onChange={(e) => 
                  setPatientData({ ...currentPatient, lastName: e.target.value })
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
                  setPatientData({ ...currentPatient, age: parseInt(e.target.value) || 0 })
                }
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Sex</label>
              <Select 
                value={currentPatient.sex || 'Other'} 
                onValueChange={(value) => setPatientData({ 
                  ...currentPatient, 
                  sex: value as 'Male' | 'Female' | 'Other' 
                })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Contact Number</label>
              <Input
                value={currentPatient.phone}
                onChange={(e) => 
                  setPatientData({ ...currentPatient, phone: e.target.value })
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
                  setPatientData({ ...currentPatient, email: e.target.value })
                }
                readOnly={!isEditing}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={currentPatient.address}
                onChange={(e) => 
                  setPatientData({ ...currentPatient, address: e.target.value })
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
