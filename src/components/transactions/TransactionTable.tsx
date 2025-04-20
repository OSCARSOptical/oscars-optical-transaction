
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Check } from "lucide-react";
import { Transaction } from '@/types';

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionTable({ transactions, onDeleteTransaction }: TransactionTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>(transactions);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit', 
      day: '2-digit', 
      year: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      currencyDisplay: 'symbol',
    }).format(amount).replace('PHP', '₱');
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

  const handleClaimedToggle = (id: string, currentValue: boolean) => {
    const updatedTransactions = localTransactions.map(transaction => {
      if (transaction.id === id) {
        const updatedTransaction = {
          ...transaction,
          claimed: !currentValue,
          dateClaimed: !currentValue ? new Date().toISOString() : null
        };
        return updatedTransaction;
      }
      return transaction;
    });
    
    setLocalTransactions(updatedTransactions);
    
    toast({
      title: "✓ Saved!",
      className: "bg-[#FFC42B] text-[#241715] rounded-lg",
      duration: 2000,
    });
  };

  return (
    <div className="relative overflow-x-auto">
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-gray-50 pointer-events-none z-10"></div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Patient ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Gross Amount</TableHead>
            <TableHead className="text-right">Deposit</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead>Claimed</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localTransactions.map((transaction) => (
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
                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  <Checkbox 
                    checked={transaction.claimed} 
                    onCheckedChange={() => handleClaimedToggle(transaction.id, transaction.claimed)}
                    id={`claimed-${transaction.id}`}
                  />
                  {transaction.claimed && <Check className="h-4 w-4 text-green-500" />}
                </div>
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
    </div>
  );
}
