
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TransactionTable } from './TransactionTable';
import { TransactionListHeader } from './TransactionListHeader';
import { Transaction } from '@/types';

// This would come from a shared data source in a real app
// We're using the same data source as the PatientTransactionHistory component
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    code: 'TX25-04-0001',
    date: '2025-04-10',
    patientCode: 'PX-JD-12345',
    patientName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    type: 'Eye Exam',
    grossAmount: 150.00,
    deposit: 50.00,
    balance: 100.00
  },
  {
    id: '2',
    code: 'TX25-04-0002',
    date: '2025-04-08',
    patientCode: 'PX-JS-67890',
    patientName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    type: 'Frame Replacement',
    grossAmount: 300.00,
    deposit: 150.00,
    balance: 150.00
  }
];

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Verify all transactions have matching patient codes
  useEffect(() => {
    const hasCodeMismatch = transactions.some(transaction => {
      // Check if the patient name matches the format "FirstName LastName"
      const expectedPatientName = `${transaction.firstName} ${transaction.lastName}`;
      return transaction.patientName !== expectedPatientName;
    });
    
    if (hasCodeMismatch) {
      toast({
        title: "Data Error",
        description: "Mismatch between transaction and patient code—please check the patient link.",
        variant: "destructive"
      });
    }
  }, [transactions, toast]);

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
