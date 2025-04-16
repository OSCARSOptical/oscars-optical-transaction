
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Edit, MoreHorizontal, Plus, Search, Trash2, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const navigate = useNavigate();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-50';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-50';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full shadow-sm border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <CreditCard className="mr-2 h-5 w-5 text-crimson-600" />
          Transactions
        </CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              className="pl-9 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => navigate('/transactions/new')}
            className="bg-crimson-600 hover:bg-crimson-700"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell className="font-medium">{transaction.patientName}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        transaction.type === 'payment' 
                          ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50'
                          : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50'
                      }
                    >
                      {transaction.type === 'payment' ? 'Payment' : 'Charge'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(transaction.status)}
                    >
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={transaction.type === 'payment' ? 'text-green-600' : 'text-gray-900'}>
                      {transaction.type === 'payment' ? '+' : ''} ${transaction.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => navigate(`/transactions/${transaction.id}`)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="cursor-pointer text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default TransactionList;
