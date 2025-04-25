
import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { sampleTransactions } from '@/data';

export function usePatientFirstTransaction() {
  const [patientFirstDates, setPatientFirstDates] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const firstDatesMap: Record<string, string> = {};
    
    // When real data is available, this logic will be reused
    // For now, with empty array, this will just return an empty object
    sampleTransactions.forEach(transaction => {
      const patientCode = transaction.patientCode;
      
      if (!firstDatesMap[patientCode] || 
          new Date(transaction.date) < new Date(firstDatesMap[patientCode])) {
        firstDatesMap[patientCode] = transaction.date;
      }
    });
    
    setPatientFirstDates(firstDatesMap);
  }, []);
  
  return patientFirstDates;
}
