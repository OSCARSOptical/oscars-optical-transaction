
import { Transaction } from '@/types';

export const usePatientLatestTransaction = (transactions: Transaction[]) => {
  const getLatestTransaction = (patientCode: string) => {
    const patientTransactions = transactions.filter(t => t.patientCode === patientCode);
    if (patientTransactions.length === 0) return null;
    
    return patientTransactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  };

  return { getLatestTransaction };
};
