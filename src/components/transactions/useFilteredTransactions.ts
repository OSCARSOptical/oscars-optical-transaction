import { useState, useEffect, useMemo } from "react";
import { Transaction } from "@/types";
import { getTransactions } from "@/data/storageData";
import { getPatients } from "@/data/storageData";

export function useFilteredTransactions(searchQuery = "", showUnclaimed = false) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Make sure each transaction has phone information from the patients data
    const storedTransactions = getTransactions();
    const allPatients = getPatients();
    
    return storedTransactions.map(transaction => {
      // Try to find the patient by patient code
      const patientCode = transaction.patientCode;
      const matchingPatient = allPatients.find(patient => patient.code === patientCode);
      
      if (matchingPatient && matchingPatient.phone && !transaction.phone) {
        return { ...transaction, phone: matchingPatient.phone };
      }
      
      // If no phone is found, keep the existing phone or set to empty string
      return transaction;
    });
  });
  
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showUnclaimedState, setShowUnclaimedState] = useState(showUnclaimed);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setShowUnclaimedState(showUnclaimed);
  }, [showUnclaimed]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        const matchesSearch = (
          transaction.patientName?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          transaction.patientCode?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          transaction.code?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          transaction.firstName?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          transaction.lastName?.toLowerCase().includes(localSearchQuery.toLowerCase())
        );

        if (showUnclaimedState) {
          return matchesSearch && !transaction.claimed;
        }
        
        return matchesSearch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [transactions, localSearchQuery, sortOrder, showUnclaimedState]);

  return {
    transactions,
    setTransactions,
    localSearchQuery,
    setLocalSearchQuery,
    sortOrder,
    setSortOrder,
    showUnclaimedState,
    setShowUnclaimedState,
    filteredTransactions,
  }
}
