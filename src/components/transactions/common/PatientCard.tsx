
import { Patient } from '@/types';
import { Card, CardContent } from "@/components/ui/card";

interface PatientCardProps {
  patient: Patient;
  transactionCode?: string;
}

const PatientCard = ({ patient, transactionCode }: PatientCardProps) => {
  if (!patient) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6 pb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {patient.firstName} {patient.lastName}
          </h2>
          <div className="text-md font-medium">
            Patient ID: <span className="text-[#9E0214]">{patient.code}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
