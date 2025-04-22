
import { useState } from "react";
import { Transaction } from "@/types";
import { removeBalanceSheetEntry } from "@/utils/balanceSheetUtils";
import { useToast } from "@/hooks/use-toast";

export function useUnclaimDialog(localTransactions: Transaction[], setLocalTransactions: (val: Transaction[]) => void) {
  const { toast } = useToast();
  const [showUnclaimDialog, setShowUnclaimDialog] = useState(false);
  const [transactionToUnclaim, setTransactionToUnclaim] = useState<Transaction | null>(null);

  const openDialog = (transaction: Transaction) => {
    setTransactionToUnclaim(transaction);
    setShowUnclaimDialog(true);
  };

  const handleUnclaimConfirm = () => {
    if (!transactionToUnclaim) return;

    const updatedTransactions = localTransactions.map(transaction => {
      if (transaction.id === transactionToUnclaim.id) {
        if (transactionToUnclaim.dateClaimed) {
          removeBalanceSheetEntry({
            date: transactionToUnclaim.dateClaimed,
            transactionId: transactionToUnclaim.code
          });
        }

        const restoredBalance = transaction.grossAmount - transaction.deposit;

        const restoredTransaction = {
          ...transaction,
          claimed: false,
          dateClaimed: null,
          balance: restoredBalance
        };

        toast({
          title: "Claim Removed",
          description: "Transaction restored to unclaimed status and balance sheet entry removed.",
          variant: "default"
        });

        return restoredTransaction;
      }
      return transaction;
    });

    setLocalTransactions(updatedTransactions);
    setShowUnclaimDialog(false);
    setTransactionToUnclaim(null);
  };

  return {
    showUnclaimDialog,
    setShowUnclaimDialog,
    transactionToUnclaim,
    openDialog,
    handleUnclaimConfirm
  };
}
