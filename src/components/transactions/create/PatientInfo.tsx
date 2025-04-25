
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient } from "@/types";
import PatientInfoFields from "./patient-info/PatientInfoFields";

interface PatientInfoProps {
  patient?: Patient;
  readOnly?: boolean;
}

const PatientInfo = ({ patient: initialPatient, readOnly = false }: PatientInfoProps) => {
  if (!initialPatient) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Patient Information</CardTitle>
      </CardHeader>
      <CardContent>
        <PatientInfoFields 
          patient={initialPatient}
          isEditing={false}  
          onFieldChange={() => {}}
        />
      </CardContent>
    </Card>
  );
};

export default PatientInfo;
