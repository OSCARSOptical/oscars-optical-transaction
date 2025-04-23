
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/types";

export function useTransactionCodeMismatchToast(transactions: Transaction[]) {
  const { toast } = useToast();

  useEffect(() => {
    const hasCodeMismatch = transactions.some(transaction => {
      const expectedPatientName = `${transaction.firstName} ${transaction.lastName}`;
      return transaction.patientName !== expectedPatientName;
    });
    
    if (hasCodeMismatch) {
      toast({
        title: "Data Error",
        description: "Mismatch between transaction and patient ID—please check the patient link.",
        variant: "destructive"
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);
}
