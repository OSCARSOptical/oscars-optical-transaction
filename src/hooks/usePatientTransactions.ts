
import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { supabase } from "@/integrations/supabase/client";

export function usePatientTransactions(patientCode: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        console.log("Fetching transactions for patient code:", patientCode);
        
        if (!patientCode) {
          setTransactions([]);
          return;
        }
        
        // First get the patient ID from the patient code
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('patient_code', patientCode)
          .single();
          
        if (patientError) {
          throw patientError;
        }
        
        if (!patientData) {
          console.log("No patient found with code:", patientCode);
          setTransactions([]);
          return;
        }
        
        const patientId = patientData.id;
        const patientName = `${patientData.first_name} ${patientData.last_name}`;
        
        // Fetch transactions using patient ID
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('patient_id', patientId)
          .order('transaction_date', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // Helper function to ensure transaction type is valid according to our Transaction interface
        const validateTransactionType = (type: string | null): Transaction['type'] => {
          const validTypes: Transaction['type'][] = [
            'Complete', 'Frame Replacement', 'Lens Replacement', 'Eye Exam', 
            'Medical Certificate', 'Contact Lens', 'Repair', 'Return', 
            'Balance Payment', 'Contact Lens Fitting', 'Comprehensive Eye Exam',
            'Frame Adjustment', 'Contact Lens Refill', 'Progressive Lenses',
            'Bifocal Lenses', 'Single Vision Lenses'
          ];
          
          return validTypes.includes(type as Transaction['type']) 
            ? (type as Transaction['type']) 
            : 'Complete'; // Default to 'Complete' if not valid
        };

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
        
        // Transform Supabase data to match our Transaction type
        const patientTransactions: Transaction[] = data.map(transaction => ({
          id: transaction.id,
          code: transaction.transaction_code || '',
          patientCode: patientCode,
          patientName: patientName,
          firstName: patientData.first_name,
          lastName: patientData.last_name,
          date: transaction.transaction_date || new Date().toISOString().split('T')[0],
          type: validateTransactionType(transaction.transaction_type),
          status: transaction.claimed ? 'Claimed' : 'Pending',
          grossAmount: transaction.gross_amount || 0,
          deposit: transaction.deposit || 0,
          balance: transaction.balance || 0,
          lensCapital: transaction.lens_capital || 0,
          edgingPrice: transaction.edging_price || 0,
          otherExpenses: transaction.other_expenses || 0,
          totalExpenses: transaction.total_expenses || 0,
          netIncome: transaction.net_income || 0,
          claimed: transaction.claimed || false,
          dateClaimed: transaction.claimed_on || null,
          phone: patientData.contact_number || '',
          refractiveIndex: validateRefractiveIndex(transaction.refractive_index),
          lensType: validateLensType(transaction.lens_type),
          lensCoating: validateLensCoating(transaction.lens_coating),
          tint: validateTint(transaction.tint),
          frameType: transaction.notes || undefined, // Use notes field as frameType since frame_type doesn't exist
          orderNotes: transaction.notes || undefined
        }));
        
        console.log("Found transactions:", patientTransactions.length);
        setTransactions(patientTransactions);
        setError(null);
      } catch (err) {
        setError('Failed to fetch transactions');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (patientCode) {
      fetchTransactions();
    } else {
      setTransactions([]);
      setLoading(false);
    }
  }, [patientCode]);

  return { transactions, loading, error };
}
