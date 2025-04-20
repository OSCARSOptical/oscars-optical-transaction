
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Patient } from "@/types";
import { Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PatientHeaderProps {
  patient?: Patient;
  transactionCode?: string;
}

const PatientHeader = ({ patient, transactionCode }: PatientHeaderProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(patient?.firstName || "");
  const [lastName, setLastName] = useState(patient?.lastName || "");

  if (!patient?.code) {
    return null;
  }

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
              {patient.firstName} {patient.lastName}
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
        <div>Patient Code: {patient.code}</div>
        <div>Transaction Code: {transactionCode}</div>
      </CardContent>
    </Card>
  );
};

export default PatientHeader;
