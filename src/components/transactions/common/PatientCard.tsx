
import { Patient } from '@/types';
import { Card, CardContent } from "@/components/ui/card";

interface PatientCardProps {
  patient: Patient;
  transactionCode?: string;
}

const PatientCard = ({ patient }: PatientCardProps) => {
  if (!patient) {
    return null;
  }

  return (
    <Card className="mb-2 bg-white border border-gray-200 shadow-sm">
      <CardContent className="flex items-center justify-between py-7 px-8">
        <h2 className="text-2xl font-bold text-[#1A1F2C] m-0">
          {patient.firstName} {patient.lastName}
        </h2>
        <span
          className="font-thin text-gray-400 text-base"
          style={{ letterSpacing: ".02em" }}
        >
          {patient.code}
        </span>
      </CardContent>
    </Card>
  );
};

export default PatientCard;

