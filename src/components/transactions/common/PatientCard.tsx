
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
    <Card className="mb-2 bg-white border border-gray-200 shadow-sm rounded-xl">
      <CardContent className="py-7 px-8 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-[#1A1F2C] m-0 mb-0">
          {patient.firstName} {patient.lastName}
        </h2>
        <span
          className="font-thin text-gray-400 text-base mt-0"
          style={{ letterSpacing: ".02em" }}
        >
          {patient.code}
        </span>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
