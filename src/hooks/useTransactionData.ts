
import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { createMockTransaction } from '@/services/mockTransactionService';
import { updateTransactionWithPayment, handleTransactionClaim } from '@/utils/transactionUtils';

export const useTransactionData = (transactionCode: string | undefined, patientCode: string | undefined) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);

      setTimeout(() => {
        let mockTransaction = createMockTransaction(transactionCode, patientCode);
        mockTransaction = updateTransactionWithPayment(mockTransaction, transactionCode || "");
        
        setTransaction(mockTransaction);
        setLoading(false);
      }, 500);
    };

    if (transactionCode || patientCode) {
      fetchData();
    } else {
      setLoading(false);
      setTransaction(null);
    }
  }, [transactionCode, patientCode]);

  const handleClaimedToggle = () => {
    if (!transaction) return;

    setTransaction(prevTransaction => {
      if (!prevTransaction) return null;
      return handleTransactionClaim(prevTransaction);
    });

    toast({
      title: "✓ Saved!",
      className: "bg-[#FFC42B] text-[#241715] rounded-lg",
      duration: 2000,
    });
  };

  return { transaction, loading, handleClaimedToggle };
};

