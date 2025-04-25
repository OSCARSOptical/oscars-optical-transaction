
import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { sampleTransactions } from '@/data';

export function usePatientTransactions(patientCode: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        console.log("Fetching transactions for patient:", patientCode);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter transactions for this patient from our sample data
        // When real data is available, this will be replaced with a database call
        const patientTransactions = sampleTransactions.filter(
          transaction => transaction.patientCode === patientCode
        );
        
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
