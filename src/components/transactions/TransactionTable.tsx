
import { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { UnclaimConfirmDialog } from './UnclaimConfirmDialog';
import { TransactionTableRow } from './TransactionTableRow';

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionTable({ transactions, onDeleteTransaction }: TransactionTableProps) {
  const { toast } = useToast();
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>(transactions);
  const [showUnclaimDialog, setShowUnclaimDialog] = useState(false);
  const [transactionToUnclaim, setTransactionToUnclaim] = useState<string | null>(null);

  const handleClaimedToggle = (id: string, currentValue: boolean) => {
    if (currentValue) {
      setTransactionToUnclaim(id);
      setShowUnclaimDialog(true);
      return;
    }
    
    const updatedTransactions = localTransactions.map(transaction => {
      if (transaction.id === id) {
        const today = new Date().toISOString().split('T')[0];
        const updatedTransaction = {
          ...transaction,
          claimed: true,
          dateClaimed: today,
          balance: 0
        };
        
        toast({
          title: "✓ Payment Claimed!",
          description: `Balance of ${formatCurrency(transaction.balance)} has been collected and recorded.`,
          className: "bg-[#FFC42B] text-[#241715] rounded-lg",
          duration: 3000,
        });
        
        return updatedTransaction;
      }
      return transaction;
    });
    
    setLocalTransactions(updatedTransactions);
  };

  const handleUnclaimConfirm = () => {
    if (!transactionToUnclaim) return;
    
    const updatedTransactions = localTransactions.map(transaction => {
      if (transaction.id === transactionToUnclaim) {
        const restoredTransaction = {
          ...transaction,
          claimed: false,
          dateClaimed: null,
          balance: 5000.00 // For demo purposes using a hard-coded value
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

  return (
    <>
      <div className="relative overflow-x-auto">
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-gray-50 pointer-events-none z-10"></div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Patient ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Gross Amount</TableHead>
              <TableHead className="text-right">Deposit</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Claimed</TableHead>
              <TableHead>Claimed on</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localTransactions.map((transaction) => (
              <TransactionTableRow
                key={transaction.id}
                transaction={transaction}
                onClaimedToggle={handleClaimedToggle}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <UnclaimConfirmDialog
        open={showUnclaimDialog}
        onOpenChange={setShowUnclaimDialog}
        onConfirm={handleUnclaimConfirm}
      />
    </>
  );
}
