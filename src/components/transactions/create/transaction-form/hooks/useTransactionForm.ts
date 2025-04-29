
import { useState, useEffect } from "react";
import { Patient, Transaction, RefractionData } from "@/types";
import { useTransactionSave } from "@/hooks/useTransactionSave";

interface UseTransactionFormProps {
  patient?: Patient;
  initialTransaction: Transaction;
  isEditMode: boolean;
}

export const useTransactionForm = ({
  patient,
  initialTransaction,
  isEditMode
}: UseTransactionFormProps) => {
  const [transaction, setTransaction] = useState<Transaction>(initialTransaction);
  const [doctorRemarks, setDoctorRemarks] = useState<string>(initialTransaction.doctorRemarks || "");
  
  const { isLoading, handleSave } = useTransactionSave({
    patient,
    mockTransaction: transaction,
    isEditMode
  });

  // Handle financial details changes
  const handleFinancialChange = (financialData: {
    grossAmount: number;
    deposit: number;
    lensCapital: number;
    edgingPrice: number;
    otherExpenses: number;
  }) => {
    setTransaction(prev => ({
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
    setTransaction(prev => ({
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
    setTransaction(prev => ({
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
    setTransaction(prev => ({
      ...prev,
      doctorRemarks
    }));
  }, [doctorRemarks]);

  const handleDoctorRemarksChange = (data: { doctorId?: string; remarks?: string }) => {
    setDoctorRemarks(data.remarks || "");
    setTransaction(prev => ({
      ...prev,
      doctorId: data.doctorId,
      doctorRemarks: data.remarks
    }));
  };

  // Handle transaction type change
  const handleTransactionTypeChange = (type: Transaction['type']) => {
    setTransaction(prev => ({ 
      ...prev, 
      type 
    }));
  };

  // Handle transaction date change
  const handleTransactionDateChange = (date: Date) => {
    setTransaction(prev => ({
      ...prev,
      date: date.toISOString().split('T')[0]
    }));
  };

  // Handle pricing changes
  const handlePricesChange = (prices: { lensCapital: number; edgingPrice: number; otherExpenses: number }) => {
    setTransaction(prev => ({
      ...prev,
      lensCapital: prices.lensCapital,
      edgingPrice: prices.edgingPrice,
      otherExpenses: prices.otherExpenses
    }));
  };

  return {
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
  };
};
