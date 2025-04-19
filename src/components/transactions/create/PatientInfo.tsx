
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Patient } from "@/types";

interface PatientInfoProps {
  patient?: Patient;
}

const PatientInfo = ({ patient }: PatientInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [patientData, setPatientData] = useState<Patient | undefined>(patient);

  // If no patient is provided, create a default empty patient
  const currentPatient = patientData || {
    id: "",
    code: "",
    firstName: "",
    lastName: "",
    age: 0,
    email: "",
    phone: "",
    address: ""
  };

  const handleSave = () => {
    // Save logic would go here
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">
          Patient Information
          {patient && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
              className="ml-2"
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={currentPatient.firstName}
              onChange={(e) => 
                setPatientData({ ...currentPatient, firstName: e.target.value })
              }
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={currentPatient.lastName}
              onChange={(e) => 
                setPatientData({ ...currentPatient, lastName: e.target.value })
              }
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={currentPatient.age}
              onChange={(e) => 
                setPatientData({ ...currentPatient, age: parseInt(e.target.value) || 0 })
              }
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Contact Number</Label>
            <Input
              id="phone"
              value={currentPatient.phone}
              onChange={(e) => 
                setPatientData({ ...currentPatient, phone: e.target.value })
              }
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={currentPatient.email}
              onChange={(e) => 
                setPatientData({ ...currentPatient, email: e.target.value })
              }
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={currentPatient.address}
              onChange={(e) => 
                setPatientData({ ...currentPatient, address: e.target.value })
              }
              readOnly={!isEditing}
            />
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
