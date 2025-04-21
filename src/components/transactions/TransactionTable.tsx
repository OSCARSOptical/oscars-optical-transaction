
import { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { UnclaimConfirmDialog } from './UnclaimConfirmDialog';
import { TransactionTableRow } from './TransactionTableRow';
import { addBalanceSheetEntry, removeBalanceSheetEntry } from '@/utils/balanceSheetUtils';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionTable({ transactions, onDeleteTransaction }: TransactionTableProps) {
  const { toast } = useToast();
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>(transactions);
  const [showUnclaimDialog, setShowUnclaimDialog] = useState(false);
  const [transactionToUnclaim, setTransactionToUnclaim] = useState<Transaction | null>(null);
  // New state for sorting
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sorting transactions by date based on sortOrder
  const sortedTransactions = [...localTransactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (sortOrder === 'asc') return dateA - dateB;
    else return dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleClaimedToggle = (id: string, currentValue: boolean) => {
    if (currentValue) {
      // Unclaiming - need to show confirmation dialog
      const transaction = localTransactions.find(tx => tx.id === id);
      if (transaction) {
        setTransactionToUnclaim(transaction);
        setShowUnclaimDialog(true);
      }
      return;
    }

    // Claiming the transaction
    const updatedTransactions = localTransactions.map(transaction => {
      if (transaction.id === id) {
        const today = new Date().toISOString().split('T')[0];
        const balancePaid = transaction.balance;

        // Create a new balance sheet entry - make sure to include patientCode
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
        // Remove the balance sheet entry
        if (transactionToUnclaim.dateClaimed) {
          removeBalanceSheetEntry({
            date: transactionToUnclaim.dateClaimed,
            transactionId: transactionToUnclaim.code
          });
        }

        // Restore the original balance - use balancePaid value from context or stored value
        // For demo using a previously known value that was saved somewhere
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
              <TableHead className="cursor-pointer select-none" onClick={toggleSortOrder}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Date</span>
                  {sortOrder === 'asc' ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </div>
              </TableHead>
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
            {sortedTransactions.map((transaction) => (
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

