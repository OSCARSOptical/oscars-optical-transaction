
import { TransactionCard } from './TransactionCard';
import { useFilteredTransactions } from './useFilteredTransactions';
import { useTransactionCodeMismatchToast } from './useTransactionCodeMismatchToast';

interface TransactionListProps {
  searchQuery?: string;
  showUnclaimed?: boolean;
}

export function TransactionList({ searchQuery = "", showUnclaimed = false }: TransactionListProps) {
  const {
    transactions,
    setTransactions,
    sortOrder,
    setSortOrder,
    showUnclaimedState,
    setShowUnclaimedState,
    filteredTransactions,
    loading
  } = useFilteredTransactions(searchQuery, showUnclaimed);

  useTransactionCodeMismatchToast(transactions);

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
    // The toast is already handled in TransactionTable for deletion.
  };

  return (
    <TransactionCard 
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
      showUnclaimed={showUnclaimedState}
      setShowUnclaimed={setShowUnclaimedState}
      filteredTransactions={filteredTransactions}
      handleDeleteTransaction={handleDeleteTransaction}
      loading={loading}
    />
  );
}

export default TransactionList;
