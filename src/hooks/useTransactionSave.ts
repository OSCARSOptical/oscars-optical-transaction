
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Patient, Transaction } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface UseTransactionSaveProps {
  patient?: Patient;
  mockTransaction: Transaction;
  isEditMode: boolean;
}

export const useTransactionSave = ({ 
  patient, 
  mockTransaction, 
  isEditMode 
}: UseTransactionSaveProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const validateTransaction = () => {
    if (!patient?.code) {
      throw new Error("Invalid patient data");
    }
    if (!mockTransaction.type) {
      throw new Error("Please select a valid transaction type");
    }
    if (!mockTransaction.code) {
      throw new Error("Transaction code is required");
    }
  };

  const handleSave = async () => {
    try {
      validateTransaction();
      setIsLoading(true);
      console.log('Starting transaction save with patient code:', patient?.code);

      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('patient_code', patient?.code)
        .single();

      if (patientError || !patientData) {
        console.error('Error fetching patient:', patientError);
        throw new Error(`Failed to find patient with code: ${patient?.code}`);
      }

      console.log('Found patient with ID:', patientData.id);
      
      const transactionDate = mockTransaction.date ? new Date(mockTransaction.date) : new Date();
      
      const transactionData = {
        patient_id: patientData.id,
        transaction_code: mockTransaction.code,
        transaction_date: transactionDate.toISOString().split('T')[0],
        transaction_type: mockTransaction.type,
        interpupillary_distance: mockTransaction.interpupillaryDistance,
        gross_amount: mockTransaction.grossAmount || 0,
        deposit: mockTransaction.deposit || 0,
        balance: mockTransaction.balance || 0,
        lens_capital: mockTransaction.lensCapital || 0,
        edging_price: mockTransaction.edgingPrice || 0,
        other_expenses: mockTransaction.otherExpenses || 0,
        total_expenses: mockTransaction.totalExpenses || 0,
        lens_type: mockTransaction.lensType || null,
        lens_coating: mockTransaction.lensCoating || null,
        tint: mockTransaction.tint || null,
        notes: mockTransaction.orderNotes || null,
        claimed: false,
        refractive_index: mockTransaction.refractiveIndex || null
      };

      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();

      if (transactionError) {
        console.error('Supabase error details:', transactionError);
        throw new Error(`Failed to save transaction: ${transactionError.message}`);
      }

      console.log('Transaction saved successfully:', transaction);

      toast({
        title: "Success",
        description: `Transaction ${mockTransaction.code} has been ${isEditMode ? 'updated' : 'saved'}.`,
      });
      navigate("/transactions");
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save transaction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSave
  };
};
