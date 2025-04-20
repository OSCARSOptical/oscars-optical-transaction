
import { Transaction } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import BreadcrumbNav from '@/components/layout/Breadcrumb';
import { TransactionHeader } from './TransactionHeader';
import PatientInfo from '@/components/transactions/create/PatientInfo';
import OrderDetails from '@/components/transactions/create/OrderDetails';
import RefractionDetails from '@/components/transactions/create/RefractionDetails';
import DoctorRemarks from '@/components/transactions/create/DoctorRemarks';
import FinancialDetails from '@/components/transactions/create/FinancialDetails';
import PatientCard from '@/components/transactions/common/PatientCard';

interface TransactionViewProps {
  transaction: Transaction;
  onClaimedToggle: () => void;
}

export const TransactionView = ({ transaction, onClaimedToggle }: TransactionViewProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const breadcrumbItems = [
    { label: 'Transactions', href: '/transactions' },
    { label: `${transaction.firstName} ${transaction.lastName}`, href: `/patients/${transaction.patientCode}` },
    { label: transaction.code }
  ];

  const handleEdit = () => {
    navigate(`/transactions/edit/${transaction.code}`, { 
      state: { transaction } 
    });
  };

  const patient = {
    id: transaction.patientCode,
    code: transaction.patientCode,
    firstName: transaction.firstName,
    lastName: transaction.lastName,
    age: 0,
    email: "",
    phone: "",
    address: ""
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex justify-between items-start">
        <BreadcrumbNav items={breadcrumbItems} />
      </div>
      
      <PatientCard patient={patient} />
      
      <TransactionHeader 
        transaction={transaction}
        onClaimedToggle={onClaimedToggle}
        onEdit={handleEdit}
      />
      
      <div className="grid gap-6">
        <PatientInfo 
          patient={patient}
          readOnly={true}
        />

        <OrderDetails 
          readOnly={true}
          initialData={{
            transactionType: transaction.type,
            transactionDate: transaction.date,
            refractiveIndex: transaction.refractiveIndex,
            lensType: transaction.lensType,
            lensCoating: transaction.lensCoating,
            interpupillaryDistance: transaction.interpupillaryDistance,
            orderNotes: transaction.orderNotes
          }}
        />
        
        <RefractionDetails 
          readOnly={true}
          initialData={{
            previousRx: transaction.previousRx,
            fullRx: transaction.fullRx,
            prescribedPower: transaction.prescribedPower,
            interpupillaryDistance: transaction.interpupillaryDistance
          }}
        />

        <DoctorRemarks 
          readOnly={true}
          initialData={{
            doctorId: transaction.doctorId,
            remarks: transaction.doctorRemarks
          }}
        />

        <FinancialDetails 
          readOnly={true}
          initialData={{
            grossAmount: transaction.grossAmount,
            deposit: transaction.deposit,
            lensCapital: transaction.lensCapital,
            edgingPrice: transaction.edgingPrice,
            otherExpenses: transaction.otherExpenses
          }}
        />
      </div>
    </div>
  );
};
