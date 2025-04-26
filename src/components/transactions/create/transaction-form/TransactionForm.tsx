import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Patient, Transaction } from "@/types";
import PatientInfo from "@/components/transactions/create/PatientInfo";
import OrderDetails from "@/components/transactions/create/OrderDetails";
import RefractionDetails from "@/components/transactions/create/RefractionDetails";
import DoctorRemarks from "@/components/transactions/create/DoctorRemarks";
import FinancialDetails from "@/components/transactions/create/FinancialDetails";

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactionType, setTransactionType] = useState<string>(mockTransaction.type || "Complete");
  const [noPreviousRx, setNoPreviousRx] = useState<boolean>(mockTransaction.noPreviousRx || false);
  const [autofillPrices, setAutofillPrices] = useState({
    lensCapital: 0,
    edgingPrice: 0,
    otherExpenses: 0
  });

  const handleTransactionTypeChange = (type: string) => {
    setTransactionType(type);
    setMockTransaction(prev => ({
      ...prev,
      type: type as any
    }));
  };

  const handleIpdChangeForRefraction = (ipdValue: number | undefined) => {
    setMockTransaction(prev => ({
      ...prev,
      interpupillaryDistance: ipdValue
    }));
  };

  const handlePricesChange = (prices: { lensCapital: number; edgingPrice: number; otherExpenses: number }) => {
    setAutofillPrices(prices);
  };

  const handleSave = () => {
    toast({
      title: "Success",
      description: `Transaction ${mockTransaction.code} has been ${isEditMode ? 'updated' : 'saved'}.`,
    });
    navigate("/transactions");
  };

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
        initialType={transactionType}
        onTypeChange={handleTransactionTypeChange}
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
      />

      <FinancialDetails
        autofillPrices={autofillPrices}
      />

      <div className="flex justify-end">
        <Button onClick={handleSave} className="w-full md:w-auto">
          <Save className="mr-2" />
          Save Transaction
        </Button>
      </div>
    </div>
  );
};

export default TransactionForm;
