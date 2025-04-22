
import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { samplePatients, sampleTransactions } from '@/data';

interface UseEnrichedTransactionsProps {
  searchQuery?: string;
  sortOrder: 'asc' | 'desc';
  showUnclaimed: boolean;
  onDataError?: () => void;
}

export function useEnrichedTransactions({
  searchQuery = '',
  sortOrder,
  showUnclaimed,
  onDataError,
}: UseEnrichedTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Enrich: filter transactions to only those with valid patient codes, inject patient data
  useEffect(() => {
    const validPatientCodes = samplePatients.map((p) => p.code);
    const validTransactions = sampleTransactions.filter((tx) =>
      validPatientCodes.includes(tx.patientCode)
    );
    const withPhone = validTransactions.map((tx) => {
      const matchingPatient = samplePatients.find((patient) => patient.code === tx.patientCode);
      return {
        ...tx,
        phone: matchingPatient?.phone || ''
      };
    });
    setTransactions(withPhone);
  }, []);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    // Data error detection for patient/transaction mismatch
    const hasMismatch = transactions.some(tx => {
      const expectedPatientName = `${tx.firstName} ${tx.lastName}`;
      return tx.patientName !== expectedPatientName;
    });
    if (hasMismatch && onDataError) onDataError();
  }, [transactions, onDataError]);

  const filteredTransactions = transactions
    .filter(transaction => {
      const query = localSearchQuery.toLowerCase();
      const matchesSearch =
        transaction.patientName.toLowerCase().includes(query) ||
        transaction.patientCode.toLowerCase().includes(query) ||
        transaction.code.toLowerCase().includes(query) ||
        transaction.firstName.toLowerCase().includes(query) ||
        transaction.lastName.toLowerCase().includes(query);

      if (showUnclaimed) return matchesSearch && !transaction.claimed;
      return matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
  };

  return {
    transactions: filteredTransactions,
    deleteTransaction,
  };
}
