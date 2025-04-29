import { useEffect } from 'react';
import { Patient, Transaction } from "@/types";
import PatientInfo from "@/components/transactions/create/PatientInfo";
import OrderDetails from "@/components/transactions/create/OrderDetails";
import RefractionDetails from "@/components/transactions/create/RefractionDetails";
import DoctorRemarks from "@/components/transactions/create/DoctorRemarks";
import FinancialDetails from "@/components/transactions/create/FinancialDetails";
import SaveTransactionButton from "./components/SaveTransactionButton";
import { useTransactionForm } from "./hooks/useTransactionForm";

interface TransactionFormProps {
  patient?: Patient;
  mockTransaction: Transaction;
  setMockTransaction: React.Dispatch<React.SetStateAction<Transaction>>;
  isEditMode: boolean;
}

const TransactionForm = ({
  patient,
  mockTransaction,
  setMockTransaction,
  isEditMode
}: TransactionFormProps) => {
  const {
    transaction,
    isLoading,
    handleSave,
    handleFinancialChange,
    handleRefractionChange,
    handleOrderDataChange,
    handleDoctorRemarksChange,
    handleTransactionTypeChange,
    handleTransactionDateChange,
    handlePricesChange
  } = useTransactionForm({
    patient,
    initialTransaction: mockTransaction,
    isEditMode
  });

  useEffect(() => {
    setMockTransaction(transaction);
  }, [transaction, setMockTransaction]);

  return (
    <div className="grid gap-y-10">
      <PatientInfo
        patient={patient}
        readOnly={true}
      />

      <RefractionDetails
        initialData={{
          previousRx: mockTransaction.previousRx,
          fullRx: mockTransaction.fullRx,
          prescribedPower: mockTransaction.prescribedPower,
          interpupillaryDistance: mockTransaction.interpupillaryDistance,
          previousRxLensType: mockTransaction.previousRxLensType,
          previousRxDate: mockTransaction.previousRxDate,
          noPreviousRx: mockTransaction.noPreviousRx
        }}
        readOnly={false}
        onDataChange={handleRefractionChange}
      />

      <DoctorRemarks 
        readOnly={false}
        initialData={{
          doctorId: mockTransaction.doctorId,
          remarks: mockTransaction.doctorRemarks
        }}
        onDataChange={handleDoctorRemarksChange}
      />

      <OrderDetails
        initialType={mockTransaction.type}
        onTypeChange={handleTransactionTypeChange}
        onDateChange={handleTransactionDateChange}
        onPricesChange={handlePricesChange}
        initialData={{
          transactionType: mockTransaction.type,
          transactionDate: mockTransaction.date,
          refractiveIndex: mockTransaction.refractiveIndex,
          lensType: mockTransaction.lensType,
          lensCoating: mockTransaction.lensCoating,
          tint: mockTransaction.tint,
          color: mockTransaction.color,
          frameType: mockTransaction.frameType,
          orderNotes: mockTransaction.orderNotes
        }}
        readOnly={false}
        onOrderDataChange={handleOrderDataChange}
      />

      <FinancialDetails
        initialData={{
          grossAmount: mockTransaction.grossAmount,
          deposit: mockTransaction.deposit,
          lensCapital: mockTransaction.lensCapital,
          edgingPrice: mockTransaction.edgingPrice,
          otherExpenses: mockTransaction.otherExpenses
        }}
        autofillPrices={{
          lensCapital: mockTransaction.lensCapital,
          edgingPrice: mockTransaction.edgingPrice,
          otherExpenses: mockTransaction.otherExpenses
        }}
        onDataChange={handleFinancialChange}
      />

      <SaveTransactionButton 
        isLoading={isLoading} 
        onSave={handleSave} 
      />
    </div>
  );
};

export default TransactionForm;
