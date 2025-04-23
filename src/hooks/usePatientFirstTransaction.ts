
import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { sampleTransactions } from '@/data';

export function usePatientFirstTransaction() {
  const [patientFirstDates, setPatientFirstDates] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const firstDatesMap: Record<string, string> = {};
    
    // Group transactions by patientCode and find earliest date
    sampleTransactions.forEach(transaction => {
      const patientCode = transaction.patientCode;
      
      // If this patient isn't in our map or this transaction is earlier, update
      if (!firstDatesMap[patientCode] || 
          new Date(transaction.date) < new Date(firstDatesMap[patientCode])) {
        firstDatesMap[patientCode] = transaction.date;
      }
    });
    
    setPatientFirstDates(firstDatesMap);
  }, []);
  
  return patientFirstDates;
}
