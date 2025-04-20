
import { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { User } from "lucide-react";

interface PatientCardProps {
  transaction: Transaction;
}

export function PatientCard({ transaction }: PatientCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Patient Name</h3>
            <p className="text-lg font-medium">{transaction.patientName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Patient ID</h3>
            <p 
              className="text-lg font-medium text-[#9E0214] hover:underline cursor-pointer" 
              onClick={() => navigate(`/patients/${transaction.patientCode}`)}
            >
              {transaction.patientCode}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="text-md">{localStorage.getItem(`patient_${transaction.patientCode.split('-').join('_')}_email`) || "—"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
            <p className="text-md">{localStorage.getItem(`patient_${transaction.patientCode.split('-').join('_')}_phone`) || "—"}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Address</h3>
            <p className="text-md">{localStorage.getItem(`patient_${transaction.patientCode.split('-').join('_')}_address`) || "—"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
