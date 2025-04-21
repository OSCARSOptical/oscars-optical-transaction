
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
    <Card className="mb-2 bg-[#F1F1F1] border border-[#E5E7EB]">
      <CardContent className="flex items-center justify-between py-7 px-8">
        <h2 className="text-2xl font-bold text-[#1A1F2C] m-0">
          {patient.firstName} {patient.lastName}
        </h2>
        <span
          className="font-normal text-base text-[#8E9196] tracking-wide"
          style={{ letterSpacing: ".02em" }}
        >
          {patient.code}
        </span>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
