import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TransactionTable } from './TransactionTable';
import { TransactionListHeader } from './TransactionListHeader';
import { Transaction } from '@/types';

const sampleTransactions: Transaction[] = [
  {
    id: '1',
    code: 'TX25-04-00001',
    date: '2025-04-10',
    patientCode: 'PX-JD-0000001',
    patientName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    type: 'Complete',
    grossAmount: 7500.00,
    deposit: 2500.00,
    balance: 5000.00,
    lensCapital: 1200.00,
    edgingPrice: 150.00,
    otherExpenses: 50.00,
    totalExpenses: 1400.00,
    claimed: true,
    dateClaimed: '2025-04-15',
    phone: '555-123-4567'
  },
  {
    id: '2',
    code: 'TX25-04-00002',
    date: '2025-04-08',
    patientCode: 'PX-JS-0000001',
    patientName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    type: 'Eye Exam',
    grossAmount: 1205.00,
    deposit: 1205.00,
    balance: 0.00,
    lensCapital: 0.00,
    edgingPrice: 0.00,
    otherExpenses: 0.00,
    totalExpenses: 0.00,
    claimed: true,
    dateClaimed: '2025-04-08',
    phone: '555-987-6543'
  },
  {
    id: '3',
    code: 'TX25-04-00003',
    date: '2025-04-11',
    patientCode: 'PX-OS-0000001',
    patientName: 'Oscar Santos',
    firstName: 'Oscar',
    lastName: 'Santos',
    type: 'Frame Replacement',
    grossAmount: 6800.00,
    deposit: 6800.00,
    balance: 0.00,
    lensCapital: 2800.00,
    edgingPrice: 200.00,
    otherExpenses: 100.00,
    totalExpenses: 3100.00,
    claimed: false,
    dateClaimed: null,
    phone: '555-555-1111'
  },
  {
    id: '4',
    code: 'TX25-04-00004',
    date: '2025-04-12',
    patientCode: 'PX-EB-0000001',
    patientName: 'Emily Brown',
    firstName: 'Emily',
    lastName: 'Brown',
    type: 'Contact Lens Fitting',
    grossAmount: 950.00,
    deposit: 950.00,
    balance: 0.00,
    lensCapital: 0.00,
    edgingPrice: 0.00,
    otherExpenses: 0.00,
    totalExpenses: 0.00,
    claimed: true,
    dateClaimed: '2025-04-12',
    phone: '555-222-3333'
  },
  {
    id: '5',
    code: 'TX25-04-00005',
    date: '2025-04-13',
    patientCode: 'PX-LC-0000001',
    patientName: 'Liam Clark',
    firstName: 'Liam',
    lastName: 'Clark',
    type: 'Comprehensive Eye Exam',
    grossAmount: 1500.00,
    deposit: 500.00,
    balance: 1000.00,
    lensCapital: 0.00,
    edgingPrice: 0.00,
    otherExpenses: 0.00,
    totalExpenses: 0.00,
    claimed: false,
    dateClaimed: null,
    phone: '555-444-5555'
  },
  {
    id: '6',
    code: 'TX25-04-00006',
    date: '2025-04-14',
    patientCode: 'PX-MA-0000001',
    patientName: 'Mia Adams',
    firstName: 'Mia',
    lastName: 'Adams',
    type: 'Frame Adjustment',
    grossAmount: 200.00,
    deposit: 200.00,
    balance: 0.00,
    lensCapital: 0.00,
    edgingPrice: 0.00,
    otherExpenses: 0.00,
    totalExpenses: 0.00,
    claimed: true,
    dateClaimed: '2025-04-14',
    phone: '555-666-7777'
  },
  {
    id: '7',
    code: 'TX25-04-00007',
    date: '2025-04-15',
    patientCode: 'PX-NJ-0000001',
    patientName: 'Noah Jones',
    firstName: 'Noah',
    lastName: 'Jones',
    type: 'Lens Replacement',
    grossAmount: 1800.00,
    deposit: 1800.00,
    balance: 0.00,
    lensCapital: 700.00,
    edgingPrice: 100.00,
    otherExpenses: 50.00,
    totalExpenses: 850.00,
    claimed: true,
    dateClaimed: '2025-04-15',
    phone: '555-888-9999'
  },
  {
    id: '8',
    code: 'TX25-04-00008',
    date: '2025-04-16',
    patientCode: 'PX-SO-0000001',
    patientName: 'Sophia Owen',
    firstName: 'Sophia',
    lastName: 'Owen',
    type: 'Contact Lens Refill',
    grossAmount: 300.00,
    deposit: 300.00,
    balance: 0.00,
    lensCapital: 0.00,
    edgingPrice: 0.00,
    otherExpenses: 0.00,
    totalExpenses: 0.00,
    claimed: false,
    dateClaimed: null,
    phone: '555-111-2222'
  },
  {
    id: '9',
    code: 'TX25-04-00009',
    date: '2025-04-17',
    patientCode: 'PX-EV-0000001',
    patientName: 'Ethan Vance',
    firstName: 'Ethan',
    lastName: 'Vance',
    type: 'Progressive Lenses',
    grossAmount: 2200.00,
    deposit: 1200.00,
    balance: 1000.00,
    lensCapital: 900.00,
    edgingPrice: 150.00,
    otherExpenses: 50.00,
    totalExpenses: 1100.00,
    claimed: true,
    dateClaimed: '2025-04-17',
    phone: '555-333-4444'
  },
  {
    id: '10',
    code: 'TX25-04-00010',
    date: '2025-04-18',
    patientCode: 'PX-AB-0000001',
    patientName: 'Ava Bennett',
    firstName: 'Ava',
    lastName: 'Bennett',
    type: 'Bifocal Lenses',
    grossAmount: 2100.00,
    deposit: 1100.00,
    balance: 1000.00,
    lensCapital: 850.00,
    edgingPrice: 150.00,
    otherExpenses: 50.00,
    totalExpenses: 1050.00,
    claimed: false,
    dateClaimed: null,
    phone: '555-777-8888'
  },
  {
    id: '11',
    code: 'TX25-04-00011',
    date: '2025-04-19',
    patientCode: 'PX-IB-0000001',
    patientName: 'Isabella Baker',
    firstName: 'Isabella',
    lastName: 'Baker',
    type: 'Single Vision Lenses',
    grossAmount: 1600.00,
    deposit: 600.00,
    balance: 1000.00,
    lensCapital: 650.00,
    edgingPrice: 100.00,
    otherExpenses: 50.00,
    totalExpenses: 800.00,
    claimed: true,
    dateClaimed: '2025-04-19',
    phone: '555-444-2222'
  }
];

interface TransactionListProps {
  searchQuery?: string;
}

export function TransactionList({ searchQuery = '' }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showUnclaimed, setShowUnclaimed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

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

      if (showUnclaimed) {
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

export default TransactionList;
