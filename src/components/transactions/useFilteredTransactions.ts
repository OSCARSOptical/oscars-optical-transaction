import { useState, useEffect, useMemo } from "react";
import { Transaction } from "@/types";
import { sampleTransactions } from "@/data";
import { samplePatients } from "@/data/samplePatients";

export function useFilteredTransactions(searchQuery = "", showUnclaimed = false) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Make sure each transaction has phone information from the patients data
    return sampleTransactions.map(transaction => {
      // Try to find the patient by patient code in our sample patients
      const patientCode = transaction.patientCode;
      const patientId = patientCode.split('-')[2]; // Extract the ID from the PX-XX-0000001 format
      
      // First, try to find the patient in our sample data
      const matchingPatient = samplePatients.find(patient => patient.code === patientCode);
      
      if (matchingPatient && matchingPatient.phone) {
        return { ...transaction, phone: matchingPatient.phone };
      }
      
      // If not found in sample data, try localStorage
      const storedPhone = localStorage.getItem(`patient_${patientId}_phone`);
      if (storedPhone) {
        return { ...transaction, phone: storedPhone };
      }
      
      // If no phone is found, keep the existing phone or set to null
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
          transaction.patientName.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          transaction.patientCode.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          transaction.code.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          transaction.firstName.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          transaction.lastName.toLowerCase().includes(localSearchQuery.toLowerCase())
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
