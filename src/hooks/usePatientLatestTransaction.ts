
import { Transaction } from '@/types';

export const usePatientLatestTransaction = (transactions: Transaction[]) => {
  const getLatestTransaction = (patientCode: string) => {
    if (!transactions || transactions.length === 0 || !patientCode) return null;
    
    const patientTransactions = transactions.filter(t => t.patientCode === patientCode);
    if (patientTransactions.length === 0) return null;
    
    // Sort by date in descending order and return the first one (latest)
    return patientTransactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  };

  return { getLatestTransaction };
};
