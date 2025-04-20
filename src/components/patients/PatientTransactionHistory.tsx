
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
import { useToast } from "@/hooks/use-toast";

interface PatientTransactionHistoryProps {
  patientCode: string;
}

export function PatientTransactionHistory({ patientCode }: PatientTransactionHistoryProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Mock transactions data with updated properties to match the Transaction type
  const allTransactions: Transaction[] = [
    {
      id: "1",
      code: "TX25-04-00001",
      date: "2025-04-10",
      patientCode: "PX-JD-0000001",
      patientName: "John Doe",
      firstName: "John",
      lastName: "Doe",
      type: "Eye Exam",
      grossAmount: 150.00,
      deposit: 50.00,
      depositDate: "2025-04-10", // Added missing depositDate field
      balance: 100.00,
      lensCapital: 0,
      edgingPrice: 0,
      otherExpenses: 0,
      totalExpenses: 0,
      claimed: false,
      dateClaimed: null
    },
    {
      id: "2",
      code: "TX25-04-00002",
      date: "2025-04-08",
      patientCode: "PX-JS-0000001",
      patientName: "Jane Smith",
      firstName: "Jane",
      lastName: "Smith",
      type: "Frame Replacement",
      grossAmount: 300.00,
      deposit: 150.00,
      depositDate: "2025-04-08", // Added missing depositDate field
      balance: 150.00,
      lensCapital: 100,
      edgingPrice: 50,
      otherExpenses: 25,
      totalExpenses: 175,
      claimed: true,
      dateClaimed: "2025-04-10"
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
        description: "Mismatch between transaction and patient ID—please check the patient link.",
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
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      currencyDisplay: 'symbol',
    }).format(amount).replace('PHP', '₱');
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Transaction ID</TableHead>
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
                <TableCell>
                  <span 
                    className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80"
                    onClick={() => navigate(`/transactions/${transaction.code}`)}
                  >
                    {transaction.code}
                  </span>
                </TableCell>
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
