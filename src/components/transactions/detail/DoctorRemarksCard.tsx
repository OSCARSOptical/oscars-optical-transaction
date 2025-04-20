
import { Transaction } from '@/types';
import { Card } from "@/components/ui/card";

interface DoctorRemarksCardProps {
  transaction: Transaction;
}

export function DoctorRemarksCard({ transaction }: DoctorRemarksCardProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Doctor ID</h3>
        <p className="text-lg">{transaction.doctorId || "—"}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">Remarks</h3>
        <p className="text-lg whitespace-pre-line">{transaction.doctorRemarks || "No remarks provided."}</p>
      </div>
    </div>
  );
}
