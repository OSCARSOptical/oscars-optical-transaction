
import { Table, TableBody } from "@/components/ui/table";
import { TransactionTableHead } from './TransactionTableHead';
import { TransactionTableRow } from './TransactionTableRow';
import { Transaction } from '@/types';
import { UnclaimConfirmDialog } from "./UnclaimConfirmDialog";
import { useUnclaimDialog } from "./useUnclaimDialog";

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionTable({ 
  transactions,
  onDeleteTransaction 
}: TransactionTableProps) {
  
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
      console.log("Claim functionality not implemented");
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TransactionTableHead allVisibleNumbers={allVisibleNumbers} />
          <TableBody>
            {transactions.map(transaction => (
              <TransactionTableRow
                key={transaction.id}
                transaction={transaction}
                onClaimedToggle={handleClaimedToggle}
                onDeleteTransaction={onDeleteTransaction}
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
    </>
  );
}

export default TransactionTable;
