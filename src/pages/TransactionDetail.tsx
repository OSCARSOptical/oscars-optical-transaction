
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Transaction } from '@/types';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TransactionView } from '@/components/transactions/detail/TransactionView';

const TransactionDetail = () => {
  const { transactionCode, patientCode } = useParams<{ transactionCode: string; patientCode: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactionData = () => {
      setLoading(true);
      
      setTimeout(() => {
        let mockTransaction: Transaction = {
          id: "1",
          code: transactionCode || "TX25-04-00001",
          date: "2025-04-10",
          patientCode: patientCode || "PX-JD-0000001",
          patientName: "John Doe",
          firstName: "John",
          lastName: "Doe",
          type: "Complete",
          grossAmount: 7500.00,
          deposit: 2500.00,
          balance: 5000.00,
          lensCapital: 1200.00,
          edgingPrice: 150.00,
          otherExpenses: 50.00,
          totalExpenses: 1400.00,
          claimed: false,
          dateClaimed: null
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
    
    fetchTransactionData();
  }, [transactionCode, patientCode]);

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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Transaction not found</AlertTitle>
          <AlertDescription>
            The transaction with code {transactionCode} could not be found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <TransactionView transaction={transaction} onClaimedToggle={handleClaimedToggle} />;
};

export default TransactionDetail;
