
import BreadcrumbNav from "@/components/layout/Breadcrumb";
import { TransactionHeader as DetailTransactionHeader } from "@/components/transactions/detail/TransactionHeader";
import { Patient, Transaction } from "@/types";

interface TransactionHeaderProps {
  transaction: Transaction;
  patient?: Patient;
  isEditMode: boolean;
  breadcrumbItems: { label: string; href?: string }[];
}

const TransactionHeader = ({ 
  transaction, 
  patient, 
  isEditMode, 
  breadcrumbItems 
}: TransactionHeaderProps) => {
  
  // Dummy function - not actually used for new/edit transactions
  const handleClaimedToggle = () => {};
  
  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />

      <DetailTransactionHeader
        transaction={transaction}
        onClaimedToggle={handleClaimedToggle}
        readOnly={true}
        pageTitle={isEditMode ? `Edit Transaction ${transaction.code}` : "New Transaction"}
        patientName={patient ? `${patient.firstName} ${patient.lastName}` : ""}
        patientCode={patient ? patient.code : ""}
        isNew={true}
      />
    </>
  );
};

export default TransactionHeader;
