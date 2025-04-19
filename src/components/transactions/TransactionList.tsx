
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TransactionTable } from './TransactionTable';
import { TransactionListHeader } from './TransactionListHeader';
import { Transaction } from '@/types';

const sampleTransactions: Transaction[] = [
  {
    id: '1',
    code: 'TX25-04-0001',
    date: '2025-04-10',
    patientCode: 'PC-001',
    patientName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    type: 'Complete',
    grossAmount: 75.00,
    deposit: 25.00,
    balance: 50.00
  },
  {
    id: '2',
    code: 'TX25-04-0002',
    date: '2025-04-08',
    patientCode: 'PC-002',
    patientName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    type: 'Eye Exam',
    grossAmount: 120.50,
    deposit: 60.25,
    balance: 60.25
  }
];

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchQuery.toLowerCase();
    return (
      transaction.patientName.toLowerCase().includes(searchLower) ||
      transaction.patientCode.toLowerCase().includes(searchLower) ||
      transaction.code.toLowerCase().includes(searchLower) ||
      transaction.firstName.toLowerCase().includes(searchLower) ||
      transaction.lastName.toLowerCase().includes(searchLower)
    );
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
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
