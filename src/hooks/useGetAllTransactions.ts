
import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { sampleTransactions } from '@/data/sampleData';

export function useGetAllTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        console.log("Fetching all transactions");
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use sample transactions data from the data file
        setTransactions(sampleTransactions);
        setError(null);
        
        console.log("Found transactions:", sampleTransactions.length);
      } catch (err) {
        setError('Failed to fetch transactions');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTransactions();
  }, []);

  return { transactions, loading, error };
}
