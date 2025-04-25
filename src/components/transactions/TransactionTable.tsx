
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
}

export function TransactionTable({ transactions, onDeleteTransaction }: TransactionTableProps) {
  const { toast } = useToast();
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>(transactions);
  const [showUnclaimDialog, setShowUnclaimDialog] = useState(false);
  const [transactionToUnclaim, setTransactionToUnclaim] = useState<Transaction | null>(null);

  const handleClaimedToggle = (id: string, currentValue: boolean) => {
    // This function is kept for compatibility but not used in the table anymore
    // The claimed toggle button is now only available in the transaction details page
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
              <TableHead>Status</TableHead>
              <TableHead>Claimed on</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localTransactions.length === 0 ? (
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
