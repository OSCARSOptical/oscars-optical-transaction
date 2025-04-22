
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TransactionTable } from './TransactionTable';
import { TransactionListHeader } from './TransactionListHeader';
import { useEnrichedTransactions } from '@/hooks/useEnrichedTransactions';
import { useState } from 'react';

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
        <TransactionTable 
          transactions={transactions}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </CardContent>
    </Card>
  );
}

export default TransactionList;
