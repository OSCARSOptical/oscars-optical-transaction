
import { Transaction } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import BreadcrumbNav from '@/components/layout/Breadcrumb';
import { TransactionHeader } from './TransactionHeader';
// REMOVE PatientHeader import: Only show in card as per screenshot.
// import PatientInfo from '@/components/transactions/create/PatientInfo';
import OrderDetails from '@/components/transactions/create/OrderDetails';
import RefractionDetails from '@/components/transactions/create/RefractionDetails';
import DoctorRemarks from '@/components/transactions/create/DoctorRemarks';
import FinancialDetails from '@/components/transactions/create/FinancialDetails';

interface TransactionViewProps {
  transaction: Transaction;
  onClaimedToggle: () => void;
  pageTitle?: string; // Allow custom page titles for TransactionHeader
}

export const TransactionView = ({ transaction, onClaimedToggle, pageTitle }: TransactionViewProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const breadcrumbItems = [
    { label: 'Transactions', href: '/transactions' },
    { label: `${transaction.firstName} ${transaction.lastName}`, href: `/patients/${transaction.patientCode}` },
    { label: transaction.code }
  ];

  const handleEdit = () => {
    navigate(`/transactions/edit/${transaction.code}`,
      { state: { transaction } });
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
      
      {/* New two-card layout for transaction/patient info and claim status */}
      <TransactionHeader 
        transaction={transaction}
        onClaimedToggle={onClaimedToggle}
        pageTitle={pageTitle ?? "Transaction Details"}
        patientName={`${transaction.firstName} ${transaction.lastName}`}
        patientCode={transaction.patientCode}
      />
      
      <div className="grid gap-6">
        {/* Only render the patient info block (form), not the patient header */}
        {/* PatientInfo remains below, NOT as header */}
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
            tint: transaction.tint,
            color: transaction.color,
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
