
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TransactionTable } from './TransactionTable';
import { TransactionListHeader } from './TransactionListHeader';
import { Transaction } from '@/types';
import { sampleTransactions } from '@/data';

interface TransactionListProps {
  searchQuery?: string;
  showUnclaimed?: boolean;
}

export function TransactionList({ searchQuery = '', showUnclaimed = false }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showUnclaimedState, setShowUnclaimedState] = useState(showUnclaimed);
  const { toast } = useToast();

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setShowUnclaimedState(showUnclaimed);
  }, [showUnclaimed]);

  useEffect(() => {
    const hasCodeMismatch = transactions.some(transaction => {
      const expectedPatientName = `${transaction.firstName} ${transaction.lastName}`;
      return transaction.patientName !== expectedPatientName;
    });
    
    if (hasCodeMismatch) {
      toast({
        title: "Data Error",
        description: "Mismatch between transaction and patient ID—please check the patient link.",
        variant: "destructive"
      });
    }
  }, [transactions, toast]);

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = (
        transaction.patientName.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        transaction.patientCode.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        transaction.code.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        transaction.firstName.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        transaction.lastName.toLowerCase().includes(localSearchQuery.toLowerCase())
      );

      if (showUnclaimedState) {
        return matchesSearch && !transaction.claimed;
      }
      
      return matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
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
          showUnclaimed={showUnclaimedState}
          onUnclaimedToggle={setShowUnclaimedState}
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

export default TransactionList;
