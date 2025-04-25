
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
        console.log("Fetching transactions for patient:", patientCode);
        
        if (!patientCode) {
          setTransactions([]);
          return;
        }
        
        // Fetch transactions from Supabase instead of sample data
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('patient_code', patientCode);
          
        if (error) {
          throw error;
        }
        
        // Transform Supabase data to match our Transaction type
        const patientTransactions = data.map(transaction => ({
          id: transaction.id,
          code: transaction.transaction_code,
          patientCode: patientCode,
          date: transaction.transaction_date,
          type: transaction.transaction_type || 'Regular',
          status: transaction.claimed ? 'Claimed' : 'Pending',
          amount: transaction.gross_amount || 0,
          balance: transaction.balance || 0
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
