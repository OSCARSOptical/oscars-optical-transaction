
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TransactionTableHead } from './TransactionTableHead';
import { TransactionTableRow } from './TransactionTableRow';
import { TransactionListHeader } from './TransactionListHeader';
import { useEnrichedTransactions } from '@/hooks/useEnrichedTransactions';
import { useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { UnclaimConfirmDialog } from "./UnclaimConfirmDialog";
import { useUnclaimDialog } from "./useUnclaimDialog";

interface TransactionListProps {
  searchQuery?: string;
}

export function TransactionList({ searchQuery = '' }: TransactionListProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showUnclaimed, setShowUnclaimed] = useState(false);
  const { toast } = useToast();

  const { transactions, deleteTransaction } = useEnrichedTransactions({
    searchQuery,
    sortOrder,
    showUnclaimed,
    onDataError: () => {
      toast({
        title: "Data Error",
        description: "Mismatch between transaction and patient ID—please check the patient link.",
        variant: "destructive"
      });
    },
  });

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
    toast({
      title: "Transaction deleted",
      description: "The transaction has been successfully removed.",
    });
  };

  // Extract all visible phone numbers for the "Copy All" feature
  const allVisibleNumbers = transactions
    .filter(t => t.phone)
    .map(t => t.phone)
    .join('\n');

  // Get unclaim dialog functionality
  const {
    showUnclaimDialog,
    setShowUnclaimDialog,
    transactionToUnclaim,
    openDialog,
    handleUnclaimConfirm
  } = useUnclaimDialog(transactions, setTransactions => {
    // This is a workaround since we can't directly update transactions
    // We'll instead refresh the data or handle it through the hook
    // For now, this is just a placeholder function
    console.log('Transactions updated', setTransactions);
  });

  // Handle claimed toggling
  const handleClaimedToggle = (id: string, currentValue: boolean) => {
    if (currentValue) {
      // If currently claimed, open unclaim dialog
      const transactionToUnclaim = transactions.find(tx => tx.id === id);
      if (transactionToUnclaim) {
        openDialog(transactionToUnclaim);
      }
    } else {
      // If currently unclaimed, navigate to claim page or handle directly
      toast({
        title: "Feature not implemented",
        description: "Claiming functionality is under development.",
      });
    }
  };

  return (
    <Card className="w-full shadow-sm border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <CreditCard className="mr-2 h-5 w-5 text-crimson-600" />
          Transactions
        </CardTitle>
        <TransactionListHeader 
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          showUnclaimed={showUnclaimed}
          onUnclaimedToggle={setShowUnclaimed}
        />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TransactionTableHead allVisibleNumbers={allVisibleNumbers} />
            <TableBody>
              {transactions.map(transaction => (
                <TransactionTableRow
                  key={transaction.id}
                  transaction={transaction}
                  onClaimedToggle={handleClaimedToggle}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Unclaim confirmation dialog */}
        <UnclaimConfirmDialog 
          open={showUnclaimDialog} 
          onOpenChange={setShowUnclaimDialog} 
          onConfirm={handleUnclaimConfirm} 
        />
      </CardContent>
    </Card>
  );
}

export default TransactionList;
