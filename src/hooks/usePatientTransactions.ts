
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
          .eq('patient_id', patientId);
          
        if (error) {
          throw error;
        }
        
        // Transform Supabase data to match our Transaction type
        const patientTransactions: Transaction[] = data.map(transaction => ({
          id: transaction.id,
          code: transaction.transaction_code || '',
          patientCode: patientCode,
          patientName: patientName,
          firstName: patientData.first_name,
          lastName: patientData.last_name,
          date: transaction.transaction_date || new Date().toISOString().split('T')[0],
          type: transaction.transaction_type || 'Complete',
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
          phone: patientData.contact_number || ''
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
