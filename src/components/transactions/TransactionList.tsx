
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { TransactionTable } from './TransactionTable';
import { getTransactions } from '@/data/storageData';
import { useFilteredTransactions } from './useFilteredTransactions';

interface TransactionListProps {
  searchQuery: string;
  showUnclaimed: boolean;
}

export default function TransactionList({ searchQuery = '', showUnclaimed = false }: TransactionListProps) {
  const {
    filteredTransactions,
    localSearchQuery,
    setLocalSearchQuery,
  } = useFilteredTransactions(searchQuery, showUnclaimed);
  
  const navigate = useNavigate();

  // Update the search query when the prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery, setLocalSearchQuery]);

  // Dummy handler for onDeleteTransaction as it's required by TransactionTable
  const handleDeleteTransaction = (id: string) => {
    console.log(`Delete transaction with ID: ${id}`);
    // In a real implementation, this would delete the transaction
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            <TransactionTable 
              transactions={filteredTransactions} 
              onDeleteTransaction={handleDeleteTransaction}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          onClick={() => navigate('/new-transaction')}
        >
          Add New Transaction
        </Button>
      </div>
    </div>
  );
}
