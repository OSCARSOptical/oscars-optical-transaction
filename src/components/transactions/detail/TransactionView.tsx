
import { Transaction, Patient } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import BreadcrumbNav from '@/components/layout/Breadcrumb';
import { TransactionHeader } from './TransactionHeader';
import PatientInfo from '@/components/transactions/create/PatientInfo';
import OrderDetails from '@/components/transactions/create/OrderDetails';
import RefractionDetails from '@/components/transactions/create/RefractionDetails';
import DoctorRemarks from '@/components/transactions/create/DoctorRemarks';
import FinancialDetails from '@/components/transactions/create/FinancialDetails';

interface TransactionViewProps {
  transaction: Transaction;
  patientData?: Patient | null;
  onClaimedToggle: () => void;
  pageTitle?: string; // Allow custom page titles for TransactionHeader
  breadcrumbItems?: { label: string; href?: string; }[]; // New optional prop to override breadcrumb items
}

export const TransactionView = ({ transaction, patientData, onClaimedToggle, pageTitle, breadcrumbItems }: TransactionViewProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Default breadcrumb items if not provided
  const defaultBreadcrumbItems = [
    { label: 'Transactions', href: '/transactions' },
    { label: `${transaction.firstName} ${transaction.lastName}`, href: `/patients/${transaction.patientCode}` },
    { label: transaction.code }
  ];

  const itemsToRender = breadcrumbItems ?? defaultBreadcrumbItems;

  const handleEdit = () => {
    navigate(`/transactions/edit/${transaction.code}`,
      { state: { transaction } });
  };

  // Use the complete patient data if available, otherwise create a basic patient object from transaction data
  const patient = patientData || {
    id: transaction.patientCode,
    code: transaction.patientCode,
    firstName: transaction.firstName,
    lastName: transaction.lastName,
    age: 0,
    email: "",
    phone: "",
    address: "",
    sex: "Male" as "Male" | "Female"
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex justify-between items-start">
        <BreadcrumbNav items={itemsToRender} />
      </div>

      <TransactionHeader
        transaction={transaction}
        onClaimedToggle={onClaimedToggle}
        pageTitle={pageTitle ?? "Transaction Details"}
        patientName={`${patient.firstName} ${patient.lastName}`}
        patientCode={patient.code}
      />

      <div className="grid gap-y-10">
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

