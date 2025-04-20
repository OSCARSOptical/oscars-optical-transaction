
import { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DoctorRemarksCardProps {
  transaction: Transaction;
}

export function DoctorRemarksCard({ transaction }: DoctorRemarksCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Doctor & Remarks</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
