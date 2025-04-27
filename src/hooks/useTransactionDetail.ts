
import { useState, useEffect } from 'react';
import { Transaction, Patient, RefractionData } from '@/types';
import { findPayment } from '@/utils/paymentsUtils';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

export function useTransactionDetail(transactionCode: string | undefined, patientCode: string | undefined) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!transactionCode || !patientCode) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        console.log(`Fetching transaction: ${transactionCode} for patient: ${patientCode}`);
        
        // First, get the patient data
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('patient_code', patientCode)
          .single();
        
        if (patientError) {
          console.error('Error fetching patient:', patientError);
          throw new Error(`Patient not found: ${patientCode}`);
        }
        
        // Format the patient data to match our Patient type
        const formattedPatient: Patient = {
          id: patientData.id,
          code: patientData.patient_code,
          firstName: patientData.first_name,
          lastName: patientData.last_name,
          age: patientData.age || 0,
          email: patientData.email || '',
          phone: patientData.contact_number || '',
          address: patientData.address || '',
          sex: (patientData.sex as 'Male' | 'Female') || undefined
        };
        
        setPatient(formattedPatient);
        
        // Now fetch the transaction data
        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .select('*')
          .eq('transaction_code', transactionCode)
          .single();
        
        if (transactionError) {
          console.error('Error fetching transaction:', transactionError);
          throw new Error(`Transaction not found: ${transactionCode}`);
        }
        
        // Helper function to validate refractive index
        const validateRefractiveIndex = (value: string | null): "1.56" | "1.61" | "1.67" | "1.74" | undefined => {
          const validValues = ["1.56", "1.61", "1.67", "1.74"];
          return validValues.includes(value || "") ? (value as "1.56" | "1.61" | "1.67" | "1.74") : undefined;
        };

        // Helper function to validate lens type
        const validateLensType = (value: string | null): "SV" | "KK" | "Prog" | "N/A" | undefined => {
          const validValues = ["SV", "KK", "Prog", "N/A"];
          return validValues.includes(value || "") ? (value as "SV" | "KK" | "Prog" | "N/A") : undefined;
        };

        // Helper function to validate lens coating
        const validateLensCoating = (value: string | null): "UC" | "MC" | "BB" | "TRG" | "BB TRG" | undefined => {
          const validValues = ["UC", "MC", "BB", "TRG", "BB TRG"];
          return validValues.includes(value || "") ? (value as "UC" | "MC" | "BB" | "TRG" | "BB TRG") : undefined;
        };

        // Helper function to validate tint
        const validateTint = (value: string | null): "N/A" | "One-Tone" | "Two-Tone" | undefined => {
          const validValues = ["N/A", "One-Tone", "Two-Tone"];
          return validValues.includes(value || "") ? (value as "N/A" | "One-Tone" | "Two-Tone") : undefined;
        };
        
        // Format the transaction data to match our Transaction type
        const formattedTransaction: Transaction = {
          id: transactionData.id,
          code: transactionData.transaction_code,
          date: transactionData.transaction_date,
          patientCode: patientCode,
          patientName: `${formattedPatient.firstName} ${formattedPatient.lastName}`,
          firstName: formattedPatient.firstName,
          lastName: formattedPatient.lastName,
          type: transactionData.transaction_type as Transaction['type'],
          grossAmount: transactionData.gross_amount || 0,
          deposit: transactionData.deposit || 0,
          balance: transactionData.balance || 0,
          lensCapital: transactionData.lens_capital || 0,
          edgingPrice: transactionData.edging_price || 0,
          otherExpenses: transactionData.other_expenses || 0,
          totalExpenses: transactionData.total_expenses || 0,
          netIncome: transactionData.net_income || 0,
          claimed: transactionData.claimed || false,
          dateClaimed: transactionData.claimed_on || null,
          interpupillaryDistance: transactionData.interpupillary_distance,
          refractiveIndex: validateRefractiveIndex(transactionData.refractive_index),
          lensType: validateLensType(transactionData.lens_type),
          lensCoating: validateLensCoating(transactionData.lens_coating),
          tint: validateTint(transactionData.tint),
          frameType: transactionData.frame_type,
          orderNotes: transactionData.notes,
          doctorRemarks: transactionData.doctor_remarks,
          phone: formattedPatient.phone
        };
        
        setTransaction(formattedTransaction);
        console.log('Transaction fetched successfully:', formattedTransaction);
      } catch (error) {
        console.error('Error in useTransactionDetail:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load transaction details",
          variant: "destructive",
        });
        
        // Navigate back to the patient page after error
        if (patientCode) {
          setTimeout(() => {
            navigate(`/patients/${patientCode}`);
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [transactionCode, patientCode, toast, navigate]);

  const handleClaimedToggle = async () => {
    if (!transaction) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const claimed = !transaction.claimed;
      
      // Update the transaction in Supabase
      const { error } = await supabase
        .from('transactions')
        .update({
          claimed: claimed,
          claimed_on: claimed ? today : null,
          balance: claimed ? 0 : transaction.grossAmount - transaction.deposit
        })
        .eq('transaction_code', transaction.code);
      
      if (error) {
        throw new Error(`Failed to update transaction: ${error.message}`);
      }

      // Update local state
      setTransaction(prevTransaction => {
        if (!prevTransaction) return null;

        return {
          ...prevTransaction,
          claimed: claimed,
          dateClaimed: claimed ? today : null,
          balance: claimed ? 0 : prevTransaction.grossAmount - prevTransaction.deposit,
          deposit: claimed ? 
            prevTransaction.deposit + prevTransaction.balance :
            prevTransaction.deposit - prevTransaction.balance
        };
      });

      toast({
        title: "✓ Saved!",
        className: "bg-[#FFC42B] text-[#241715] rounded-lg",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error toggling claimed status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update transaction status",
        variant: "destructive"
      });
    }
  };

  return { transaction, patient, loading, handleClaimedToggle };
}
