
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Patient, Transaction } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useFinancialCalculations } from "@/hooks/useFinancialCalculations";

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

  // We'll use the calculations hook just for the calculation logic
  const [calculatedValues] = useFinancialCalculations({
    grossAmount: mockTransaction.grossAmount || 0,
    deposit: mockTransaction.deposit || 0,
    lensCapital: mockTransaction.lensCapital || 0,
    edgingPrice: mockTransaction.edgingPrice || 0,
    otherExpenses: mockTransaction.otherExpenses || 0
  });

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
    if (!mockTransaction.date) {
      throw new Error("Transaction date is required");
    }
  };

  const handleSave = async () => {
    try {
      validateTransaction();
      setIsLoading(true);
      console.log('Starting transaction save with patient code:', patient?.code);
      console.log('Transaction data to save:', mockTransaction);
      console.log('Is edit mode:', isEditMode);

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
      
      // Use our financial calculation hook values for consistency
      const { balance, totalExpenses } = calculatedValues;
      const grossAmount = mockTransaction.grossAmount || 0;
      const deposit = mockTransaction.deposit || 0;
      const lensCapital = mockTransaction.lensCapital || 0;
      const edgingPrice = mockTransaction.edgingPrice || 0;
      const otherExpenses = mockTransaction.otherExpenses || 0;
      
      // Calculate net income
      const netIncome = deposit - totalExpenses;
      
      // Create a validated object for refractiveIndex, lensType, lensCoating and tint
      const refractiveIndex = mockTransaction.refractiveIndex || null;
      const lensType = mockTransaction.lensType || null;
      const lensCoating = mockTransaction.lensCoating || null;
      const tint = mockTransaction.tint || null;
      
      // Store frameType in the notes field since there's no specific column for it
      const notes = mockTransaction.frameType || mockTransaction.orderNotes || null;
      
      const transactionData = {
        patient_id: patientData.id,
        transaction_code: mockTransaction.code,
        transaction_date: transactionDate.toISOString().split('T')[0],
        transaction_type: mockTransaction.type,
        interpupillary_distance: mockTransaction.interpupillaryDistance || null,
        gross_amount: grossAmount,
        deposit: deposit,
        balance: balance,
        lens_capital: lensCapital,
        edging_price: edgingPrice,
        other_expenses: otherExpenses,
        total_expenses: totalExpenses,
        net_income: netIncome,
        lens_type: lensType,
        lens_coating: lensCoating,
        tint: tint,
        notes: notes, // Store frameType in the notes field
        claimed: mockTransaction.claimed || false,
        refractive_index: refractiveIndex,
        doctor_remarks: mockTransaction.doctorRemarks || null
      };

      console.log('Data to be saved:', transactionData);

      let transaction;
      let transactionError;

      if (isEditMode) {
        console.log('Updating existing transaction with ID:', mockTransaction.id);
        
        // Use the update method for existing transactions
        const updateResult = await supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', mockTransaction.id)
          .select()
          .single();
          
        transaction = updateResult.data;
        transactionError = updateResult.error;
        
        console.log('Update result:', updateResult);
      } else {
        console.log('Inserting new transaction');
        
        // Use insert for new transactions
        const insertResult = await supabase
          .from('transactions')
          .insert(transactionData)
          .select()
          .single();
          
        transaction = insertResult.data;
        transactionError = insertResult.error;
        
        console.log('Insert result:', insertResult);
      }

      if (transactionError) {
        console.error('Supabase error details:', transactionError);
        throw new Error(`Failed to ${isEditMode ? 'update' : 'save'} transaction: ${transactionError.message}`);
      }

      console.log(`Transaction ${isEditMode ? 'updated' : 'saved'} successfully:`, transaction);
      
      // Save transaction code to localStorage for code generation purposes
      localStorage.setItem(`transaction_${transaction.id}_code`, mockTransaction.code);

      toast({
        title: "Success",
        description: `Transaction ${mockTransaction.code} has been ${isEditMode ? 'updated' : 'saved'}.`,
      });
      
      // Navigate to the transaction details page
      navigate(`/patients/${patient?.code}/transactions/${mockTransaction.code}`);
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
