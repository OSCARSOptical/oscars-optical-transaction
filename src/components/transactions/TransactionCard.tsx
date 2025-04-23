
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { TransactionTable } from './TransactionTable';
import { TransactionListHeader } from './TransactionListHeader';
import { Transaction } from '@/types';

interface TransactionCardProps {
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  showUnclaimed: boolean;
  setShowUnclaimed: (show: boolean) => void;
  filteredTransactions: Transaction[];
  handleDeleteTransaction: (id: string) => void;
}

export function TransactionCard({
  sortOrder,
  setSortOrder,
  showUnclaimed,
  setShowUnclaimed,
  filteredTransactions,
  handleDeleteTransaction
}: TransactionCardProps) {
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
          transactions={filteredTransactions}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </CardContent>
    </Card>
  );
}
