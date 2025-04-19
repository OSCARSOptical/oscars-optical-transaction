import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TransactionTable } from './TransactionTable';
import { TransactionListHeader } from './TransactionListHeader';

interface Transaction {
  id: string;
  date: string;
  patientName: string;
  type: 'payment' | 'charge';
  category: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

// Sample data
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    date: '2023-04-10',
    patientName: 'John Doe',
    type: 'payment',
    category: 'Consultation',
    amount: 75.00,
    status: 'completed',
  },
  {
    id: '2',
    date: '2023-04-08',
    patientName: 'Jane Smith',
    type: 'charge',
    category: 'Lab Test',
    amount: 120.50,
    status: 'pending',
  },
  {
    id: '3',
    date: '2023-04-05',
    patientName: 'Robert Johnson',
    type: 'payment',
    category: 'Procedure',
    amount: 450.00,
    status: 'completed',
  },
  {
    id: '4',
    date: '2023-04-03',
    patientName: 'Emily Davis',
    type: 'charge',
    category: 'Medication',
    amount: 85.75,
    status: 'failed',
  },
  {
    id: '5',
    date: '2023-04-01',
    patientName: 'Michael Wilson',
    type: 'payment',
    category: 'Follow-up',
    amount: 45.25,
    status: 'completed',
  },
];

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const filteredTransactions = transactions.filter(transaction => 
    transaction.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
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
