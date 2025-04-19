
import { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Transaction } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface PatientTransactionHistoryProps {
  patientCode: string;
}

export function PatientTransactionHistory({ patientCode }: PatientTransactionHistoryProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Mock transactions data - in a real app this would come from a shared data source or API
  const allTransactions: Transaction[] = [
    {
      id: "1",
      code: "TX25-04-0001",
      date: "2025-04-10",
      patientCode: "PX-JD-12345",
      patientName: "John Doe",
      firstName: "John",
      lastName: "Doe",
      type: "Eye Exam",
      grossAmount: 150.00,
      deposit: 50.00,
      balance: 100.00
    },
    {
      id: "2",
      code: "TX25-04-0002",
      date: "2025-04-08",
      patientCode: "PX-JS-67890",
      patientName: "Jane Smith",
      firstName: "Jane",
      lastName: "Smith",
      type: "Frame Replacement",
      grossAmount: 300.00,
      deposit: 150.00,
      balance: 150.00
    }
  ];

  useEffect(() => {
    // Filter transactions for this patient only
    const patientTransactions = allTransactions.filter(
      transaction => transaction.patientCode === patientCode
    );
    
    // Verify patient code match and alert if mismatch
    const hasCodeMismatch = patientTransactions.some(
      transaction => transaction.patientCode !== patientCode
    );
    
    if (hasCodeMismatch) {
      toast({
        title: "Data Error",
        description: "Mismatch between transaction and patient code—please check the patient link.",
        variant: "destructive"
      });
    }
    
    setTransactions(patientTransactions);
  }, [patientCode, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Transaction Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Gross Amount</TableHead>
            <TableHead className="text-right">Deposit</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{transaction.code}</TableCell>
                <TableCell>{transaction.type}</TableCell>
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
                      >
                        View Full Transaction
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                No transactions found for this patient.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
