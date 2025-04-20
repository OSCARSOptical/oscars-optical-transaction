
import { Card, CardContent } from "@/components/ui/card";
import { Patient } from "@/types";

interface PatientHeaderProps {
  patient?: Patient;
  transactionCode?: string;
}

const PatientHeader = ({ patient, transactionCode }: PatientHeaderProps) => {
  if (!patient?.code) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-4">
          {patient.firstName} {patient.lastName}
        </h2>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div>Patient ID: {patient.code}</div>
          <div>Transaction ID: {transactionCode}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientHeader;
