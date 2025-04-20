
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal } from "lucide-react";
import { Transaction } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionTable({ transactions, onDeleteTransaction }: TransactionTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>(transactions);
  const [showUnclaimDialog, setShowUnclaimDialog] = useState(false);
  const [transactionToUnclaim, setTransactionToUnclaim] = useState<string | null>(null);

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
    if (currentValue) {
      // If already claimed, we need to confirm before unclaiming
      setTransactionToUnclaim(id);
      setShowUnclaimDialog(true);
      return;
    }
    
    // If not claimed, proceed with claiming
    const updatedTransactions = localTransactions.map(transaction => {
      if (transaction.id === id) {
        // 1. Create a balance payment transaction (would be added to the database in a real app)
        const today = new Date().toISOString().split('T')[0];
        
        // In a real app we would create a new transaction here with this data
        const balancePaymentTransaction = {
          id: `bp-${transaction.id}`, // Just for demo purposes
          code: `BP-${transaction.code}`,
          date: today,
          patientCode: transaction.patientCode,
          patientName: transaction.patientName,
          firstName: transaction.firstName,
          lastName: transaction.lastName,
          type: transaction.type,
          grossAmount: 0,
          deposit: transaction.balance, // Move balance to deposit
          balance: 0,
          lensCapital: 0,
          edgingPrice: 0,
          otherExpenses: 0,
          totalExpenses: 0,
          claimed: true,
          dateClaimed: today
        };
        
        // 2. Update the original transaction
        const updatedTransaction = {
          ...transaction,
          claimed: true,
          dateClaimed: today,
          balance: 0 // Set balance to 0
        };
        
        // Show a toast notification
        toast({
          title: "✓ Payment Claimed!",
          description: `Balance of ${formatCurrency(transaction.balance)} has been collected and recorded.`,
          className: "bg-[#FFC42B] text-[#241715] rounded-lg",
          duration: 3000,
        });
        
        return updatedTransaction;
      }
      return transaction;
    });
    
    setLocalTransactions(updatedTransactions);
  };

  const handleUnclaimConfirm = () => {
    if (!transactionToUnclaim) return;
    
    const updatedTransactions = localTransactions.map(transaction => {
      if (transaction.id === transactionToUnclaim) {
        // Restore the balance (in a real app, we would also delete the balance sheet entry)
        const restoredTransaction = {
          ...transaction,
          claimed: false,
          dateClaimed: null,
          // In a real app, we would need to restore the original balance
          balance: 5000.00 // For demo purposes using a hard-coded value
        };
        
        toast({
          title: "Claim Removed",
          description: "Transaction restored to unclaimed status and balance sheet entry removed.",
          variant: "default"
        });
        
        return restoredTransaction;
      }
      return transaction;
    });
    
    setLocalTransactions(updatedTransactions);
    setShowUnclaimDialog(false);
    setTransactionToUnclaim(null);
  };

  return (
    <>
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
              <TableHead>Claimed on</TableHead>
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
                  </div>
                </TableCell>
                <TableCell>{formatDate(transaction.dateClaimed)}</TableCell>
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

      <AlertDialog open={showUnclaimDialog} onOpenChange={setShowUnclaimDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Claim?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove claim and delete balance-sheet entry for this transaction? This will restore the balance amount in the transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowUnclaimDialog(false)}>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnclaimConfirm}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
