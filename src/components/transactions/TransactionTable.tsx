
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Transaction } from '@/types';

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionTable({ transactions, onDeleteTransaction }: TransactionTableProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Complete':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-50';
      case 'Eye Exam':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50';
      case 'Frame Replacement':
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50';
      case 'Lens Replacement':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50';
      case 'Medical Certificate':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50';
      case 'Contact Lens':
        return 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-50';
      case 'Repair':
        return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50';
      case 'Return':
        return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-50';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Transaction Code</TableHead>
          <TableHead>Patient Name</TableHead>
          <TableHead>Patient Code</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Gross Amount</TableHead>
          <TableHead className="text-right">Deposit</TableHead>
          <TableHead className="text-right">Balance</TableHead>
          <TableHead className="w-[60px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{formatDate(transaction.date)}</TableCell>
            <TableCell>
              <span 
                className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80"
                onClick={() => navigate(`/transactions/${transaction.code}`)}
              >
                {transaction.code}
              </span>
            </TableCell>
            <TableCell>{transaction.patientName}</TableCell>
            <TableCell>{transaction.patientCode}</TableCell>
            <TableCell>
              <Badge 
                variant="outline" 
                className={getTypeColor(transaction.type)}
              >
                {transaction.type}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{formatCurrency(transaction.grossAmount)}</TableCell>
            <TableCell className="text-right">{formatCurrency(transaction.deposit)}</TableCell>
            <TableCell className="text-right">{formatCurrency(transaction.balance)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => navigate(`/transactions/${transaction.code}`)}
                    className="cursor-pointer"
                  >
                    View Full Transaction
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
