
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Patient, Transaction, RefractionData } from "@/types";
import PatientInfo from "@/components/transactions/create/PatientInfo";
import OrderDetails from "@/components/transactions/create/OrderDetails";
import RefractionDetails from "@/components/transactions/create/RefractionDetails";
import DoctorRemarks from "@/components/transactions/create/DoctorRemarks";
import FinancialDetails from "@/components/transactions/create/FinancialDetails";
import { useTransactionSave } from "@/hooks/useTransactionSave";
import { useState, useEffect } from "react";

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

  const [doctorRemarks, setDoctorRemarks] = useState<string>(mockTransaction.doctorRemarks || "");

  // Handle financial details changes
  const handleFinancialChange = (financialData: {
    grossAmount: number;
    deposit: number;
    lensCapital: number;
    edgingPrice: number;
    otherExpenses: number;
  }) => {
    setMockTransaction(prev => ({
      ...prev,
      grossAmount: financialData.grossAmount,
      deposit: financialData.deposit,
      lensCapital: financialData.lensCapital,
      edgingPrice: financialData.edgingPrice,
      otherExpenses: financialData.otherExpenses
    }));
  };

  // Handle refraction data changes
  const handleRefractionChange = (refractionData: {
    previousRx?: RefractionData;
    fullRx?: RefractionData;
    prescribedPower?: RefractionData;
    interpupillaryDistance?: number;
    previousRxLensType?: string;
    previousRxDate?: string;
    noPreviousRx?: boolean;
  }) => {
    setMockTransaction(prev => ({
      ...prev,
      previousRx: refractionData.previousRx,
      fullRx: refractionData.fullRx,
      prescribedPower: refractionData.prescribedPower,
      interpupillaryDistance: refractionData.interpupillaryDistance,
      // Convert the string to a valid literal type if it matches one of the allowed values
      previousRxLensType: (refractionData.previousRxLensType === "Single Vision" || 
                          refractionData.previousRxLensType === "Bifocal" || 
                          refractionData.previousRxLensType === "Progressive") 
                          ? refractionData.previousRxLensType 
                          : undefined,
      previousRxDate: refractionData.previousRxDate,
      noPreviousRx: refractionData.noPreviousRx
    }));
  };

  // Handle order details changes
  const handleOrderDataChange = (orderData: {
    refractiveIndex?: string;
    lensType?: string;
    lensCoating?: string;
    tint?: string;
    color?: string;
    frameType?: string;
    orderNotes?: string;
  }) => {
    setMockTransaction(prev => ({
      ...prev,
      refractiveIndex: orderData.refractiveIndex as "1.56" | "1.61" | "1.67" | "1.74" | undefined,
      lensType: orderData.lensType as "SV" | "KK" | "Prog" | "N/A" | undefined,
      lensCoating: orderData.lensCoating as "UC" | "MC" | "BB" | "TRG" | "BB TRG" | undefined,
      tint: orderData.tint as "N/A" | "One-Tone" | "Two-Tone" | undefined,
      color: orderData.color,
      frameType: orderData.frameType,
      orderNotes: orderData.orderNotes
    }));
  };

  // Handle doctor remarks changes
  useEffect(() => {
    setMockTransaction(prev => ({
      ...prev,
      doctorRemarks
    }));
  }, [doctorRemarks, setMockTransaction]);

  const handleDoctorRemarksChange = (data: { doctorId?: string; remarks?: string }) => {
    setDoctorRemarks(data.remarks || "");
    setMockTransaction(prev => ({
      ...prev,
      doctorId: data.doctorId,
      doctorRemarks: data.remarks
    }));
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
