
import { useState, useMemo } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from '@/types';
import { ArrowDown, ArrowUp } from "lucide-react"; // Use allowed icons
import { UnclaimConfirmDialog } from './UnclaimConfirmDialog';
import { TransactionTableRow } from './TransactionTableRow';
import { addBalanceSheetEntry, removeBalanceSheetEntry } from '@/utils/balanceSheetUtils';

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionTable({ transactions, onDeleteTransaction }: TransactionTableProps) {
  const { toast } = useToast();
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>(transactions);
  const [showUnclaimDialog, setShowUnclaimDialog] = useState(false);
  const [transactionToUnclaim, setTransactionToUnclaim] = useState<Transaction | null>(null);
  const [sortDesc, setSortDesc] = useState(true);

  // Memoize sorted transactions for performance
  const sortedTransactions = useMemo(() => {
    return [...localTransactions].sort((a, b) => {
      if (sortDesc) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });
  }, [localTransactions, sortDesc]);
  
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
          description: `Balance of ₱${balancePaid.toLocaleString()} has been collected and recorded.`,
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

  const handleSortClick = () => setSortDesc((prev) => !prev);

  return (
    <>
      <div className="relative overflow-x-auto">
        <div className="flex items-center justify-end mb-2 pr-2">
          <button
            onClick={handleSortClick}
            className="flex items-center gap-1 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium text-gray-700 transition-colors"
            aria-label={`Sort by date ${sortDesc ? "ascending" : "descending"}`}
            type="button"
          >
            Sort by Date
            {sortDesc
              ? <ArrowDown className="w-4 h-4 ml-1" />
              : <ArrowUp className="w-4 h-4 ml-1" />}
          </button>
        </div>
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
            {sortedTransactions.map((transaction) => (
              <TransactionTableRow
                key={transaction.id}
                transaction={transaction}
                onClaimedToggle={handleClaimedToggle}
                enableNavigation
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
// END TransactionTable
