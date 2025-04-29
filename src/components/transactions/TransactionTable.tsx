
import { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TransactionTableRow } from './TransactionTableRow';
import { addBalanceSheetEntry, removeBalanceSheetEntry } from '@/utils/balanceSheetUtils';
import { ContactCopyButton } from './ContactCopyButton';
import { TransactionUnclaimDialog } from './TransactionUnclaimDialog';

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  loading: boolean;
}

export function TransactionTable({ transactions, onDeleteTransaction, loading }: TransactionTableProps) {
  const { toast } = useToast();
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>(transactions);
  const [showUnclaimDialog, setShowUnclaimDialog] = useState(false);
  const [transactionToUnclaim, setTransactionToUnclaim] = useState<Transaction | null>(null);

  // Update localTransactions when transactions prop changes
  useState(() => {
    setLocalTransactions(transactions);
  });

  const handleClaimedToggle = (id: string, currentValue: boolean) => {
    if (currentValue) {
      const transaction = localTransactions.find(tx => tx.id === id);
      if (transaction) {
        setTransactionToUnclaim(transaction);
        setShowUnclaimDialog(true);
      }
      return;
    }

    const updatedTransactions = localTransactions.map(transaction => {
      if (transaction.id === id) {
        const today = new Date().toISOString().split('T')[0];
        const balancePaid = transaction.balance;
        addBalanceSheetEntry({
          date: today,
          transactionId: transaction.code,
          balancePaid,
          patientCode: transaction.patientCode
        });
        const updatedTransaction = {
          ...transaction,
          claimed: true,
          dateClaimed: today,
          balance: 0
        };

        toast({
          title: "✓ Payment Claimed!",
          description: `Balance of ${formatCurrency(balancePaid)} has been collected and recorded.`,
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
              <TableHead className="relative group">
                <ContactCopyButton transactions={localTransactions} />
              </TableHead>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : localTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              localTransactions.map((transaction) => (
                <TransactionTableRow
                  key={transaction.id}
                  transaction={transaction}
                  onClaimedToggle={handleClaimedToggle}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <TransactionUnclaimDialog
        open={showUnclaimDialog}
        onOpenChange={setShowUnclaimDialog}
        onConfirm={handleUnclaimConfirm}
      />
    </>
  );
}
