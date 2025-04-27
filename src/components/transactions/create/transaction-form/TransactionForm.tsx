
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Patient, Transaction } from "@/types";
import PatientInfo from "@/components/transactions/create/PatientInfo";
import OrderDetails from "@/components/transactions/create/OrderDetails";
import RefractionDetails from "@/components/transactions/create/RefractionDetails";
import DoctorRemarks from "@/components/transactions/create/DoctorRemarks";
import FinancialDetails from "@/components/transactions/create/FinancialDetails";
import { useTransactionSave } from "@/hooks/useTransactionSave";

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
  const { isLoading, handleSave } = useTransactionSave({
    patient,
    mockTransaction,
    isEditMode
  });

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
      />

      <DoctorRemarks />

      <OrderDetails
        initialType={mockTransaction.type}
        onTypeChange={(type) => {
          setMockTransaction(prev => ({ 
            ...prev, 
            type
          }));
        }}
        onDateChange={(date) => {
          setMockTransaction(prev => ({
            ...prev,
            date: date.toISOString().split('T')[0]
          }));
        }}
        onPricesChange={prices => {
          setMockTransaction(prev => ({
            ...prev,
            lensCapital: prices.lensCapital,
            edgingPrice: prices.edgingPrice,
            otherExpenses: prices.otherExpenses
          }));
        }}
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
      />

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          className="w-full md:w-auto"
          disabled={isLoading}
        >
          <Save className="mr-2" />
          {isLoading ? 'Saving...' : 'Save Transaction'}
        </Button>
      </div>
    </div>
  );
};

export default TransactionForm;
