
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Patient } from "@/types";
import { Edit2 } from "lucide-react";

interface PatientHeaderProps {
  patient?: Patient;
}

const PatientHeader = ({ patient }: PatientHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(patient?.firstName || "");
  const [lastName, setLastName] = useState(patient?.lastName || "");

  const generateTransactionCode = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
    return `TX${year}-${month}-${random}`;
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-2xl font-bold">
          {isEditing ? (
            <div className="flex gap-4">
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
              />
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </div>
          ) : (
            <span>
              {patient ? `${patient.firstName} ${patient.lastName}` : "New Patient"}
            </span>
          )}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          {isEditing ? "Save" : "Edit"}
        </Button>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div>Patient Code: {patient?.code || "Not assigned"}</div>
        <div>Transaction Code: {generateTransactionCode()}</div>
      </CardContent>
    </Card>
  );
};

export default PatientHeader;
