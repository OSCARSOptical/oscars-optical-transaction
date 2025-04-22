
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
        // Create the mock transaction - passing both params, even if patientCode is undefined
        let mockTransaction = createMockTransaction(transactionCode, patientCode);
        
        // Only try to update with payment data if we have a valid transaction
        if (mockTransaction) {
          mockTransaction = updateTransactionWithPayment(mockTransaction, transactionCode || "");
          setTransaction(mockTransaction);
        } else {
          setTransaction(null);
        }
        
        setLoading(false);
      }, 500);
    };

    if (transactionCode) {
      fetchData();
    } else {
      setLoading(false);
      setTransaction(null);
    }
  }, [transactionCode, patientCode]);

  const handleClaimedToggle = () => {
    if (!transaction) return;

    // Apply the transaction claim logic
    const updatedTransaction = handleTransactionClaim(transaction);
    setTransaction(updatedTransaction);
    
    toast({
      title: updatedTransaction.claimed ? "✓ Saved!" : "Claim Removed",
      description: updatedTransaction.claimed 
        ? `Balance of ${transaction.balance.toLocaleString('en-US', { style: 'currency', currency: 'PHP' })} has been collected.`
        : "Transaction restored to unclaimed status.",
      className: updatedTransaction.claimed ? "bg-[#FFC42B] text-[#241715] rounded-lg" : undefined,
      duration: 2000,
    });
  };

  return { transaction, loading, handleClaimedToggle };
};
