
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TransactionTable } from './TransactionTable';
import { TransactionListHeader } from './TransactionListHeader';
import { Transaction } from '@/types';

// Sample data - using the correct Transaction type from types/index.ts
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    code: 'TX-2023-001',
    date: '2023-04-10',
    patientCode: 'PC-001',
    patientName: 'John Doe',
    type: 'Complete',
    grossAmount: 75.00,
    deposit: 25.00,
    balance: 50.00
  },
  {
    id: '2',
    code: 'TX-2023-002',
    date: '2023-04-08',
    patientCode: 'PC-002',
    patientName: 'Jane Smith',
    type: 'Eye Exam',
    grossAmount: 120.50,
    deposit: 60.25,
    balance: 60.25
  },
  {
    id: '3',
    code: 'TX-2023-003',
    date: '2023-04-05',
    patientCode: 'PC-003',
    patientName: 'Robert Johnson',
    type: 'Frame Replacement',
    grossAmount: 450.00,
    deposit: 225.00,
    balance: 225.00
  },
  {
    id: '4',
    code: 'TX-2023-004',
    date: '2023-04-03',
    patientCode: 'PC-004',
    patientName: 'Emily Davis',
    type: 'Lens Replacement',
    grossAmount: 85.75,
    deposit: 40.00,
    balance: 45.75
  },
  {
    id: '5',
    code: 'TX-2023-005',
    date: '2023-04-01',
    patientCode: 'PC-005',
    patientName: 'Michael Wilson',
    type: 'Medical Certificate',
    grossAmount: 45.25,
    deposit: 45.25,
    balance: 0.00
  },
];

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const filteredTransactions = transactions.filter(transaction => 
    transaction.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
