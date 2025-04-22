
import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { findPayment } from '@/utils/paymentsUtils';

export const useTransactionData = (transactionCode: string | undefined, patientCode: string | undefined) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);

      // Create mock transaction data with patient info
      setTimeout(() => {
        let mockTransaction: Transaction = {
          id: "1",
          code: transactionCode || "TX25-04-00001",
          date: "2025-04-10",
          patientCode: patientCode || "PX-JD-0000001",
          patientName: "",
          firstName: "",
          lastName: "",
          type: "Complete",
          grossAmount: 7500.00,
          deposit: 2500.00,
          balance: 5000.00,
          lensCapital: 1200.00,
          edgingPrice: 150.00,
          otherExpenses: 50.00,
          totalExpenses: 1400.00,
          claimed: false,
          dateClaimed: null,
          refractiveIndex: "1.56",
          lensType: "SV",
          lensCoating: "UC",
          tint: "N/A",
          color: "",
          interpupillaryDistance: 62,
          orderNotes: "Sample order notes",
          previousRx: undefined,
          fullRx: undefined,
          prescribedPower: undefined,
          doctorId: undefined,
          doctorRemarks: undefined
        };

        const payment = findPayment(transactionCode || "", 'balance');

        if (payment) {
          mockTransaction = {
            ...mockTransaction,
            claimed: true,
            dateClaimed: payment.paymentDate,
            balance: 0,
            deposit: mockTransaction.deposit + payment.amount
          };
        }

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
  }, [transactionCode, patientCode, toast]);

  const handleClaimedToggle = () => {
    if (!transaction) return;

    setTransaction(prevTransaction => {
      if (!prevTransaction) return null;

      return {
        ...prevTransaction,
        claimed: !prevTransaction.claimed,
        dateClaimed: !prevTransaction.claimed ? new Date().toISOString().split('T')[0] : null,
        balance: !prevTransaction.claimed ? 0 : prevTransaction.grossAmount - prevTransaction.deposit,
        deposit: !prevTransaction.claimed ?
          prevTransaction.deposit + prevTransaction.balance :
          prevTransaction.deposit - prevTransaction.balance
      };
    });

    toast({
      title: "✓ Saved!",
      className: "bg-[#FFC42B] text-[#241715] rounded-lg",
      duration: 2000,
    });
  };

  return { transaction, loading, handleClaimedToggle };
};
