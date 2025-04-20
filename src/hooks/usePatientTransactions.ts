
import { useState, useEffect } from 'react';
import { Transaction } from '@/types';

// Mock database data - replace with real DB later
const allTransactions: Transaction[] = [
  {
    id: "1",
    code: "TX25-04-00001",
    date: "2025-04-10",
    patientCode: "PX-JD-0000001",
    patientName: "John Doe",
    firstName: "John",
    lastName: "Doe",
    type: "Complete",
    grossAmount: 7500.00,
    deposit: 2500.00,
    balance: 5000.00,
    lensCapital: 1200.00,
    edgingPrice: 150.00,
    otherExpenses: 50.00,
    totalExpenses: 1400.00,
    claimed: false,
    dateClaimed: null
  },
  {
    id: "2",
    code: "TX25-04-00002",
    date: "2025-04-08",
    patientCode: "PX-JS-0000001",
    patientName: "Jane Smith",
    firstName: "Jane",
    lastName: "Smith",
    type: "Frame Replacement",
    grossAmount: 300.00,
    deposit: 150.00,
    balance: 150.00,
    lensCapital: 100,
    edgingPrice: 50,
    otherExpenses: 25,
    totalExpenses: 175,
    claimed: true,
    dateClaimed: "2025-04-10"
  }
];

export function usePatientTransactions(patientCode: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter transactions for this patient
        const patientTransactions = allTransactions.filter(
          transaction => transaction.patientCode === patientCode
        );
        
        setTransactions(patientTransactions);
        setError(null);
      } catch (err) {
        setError('Failed to fetch transactions');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [patientCode]);

  return { transactions, loading, error };
}

