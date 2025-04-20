
import { TableCell, TableRow, Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { usePatientTransactions } from "@/hooks/usePatientTransactions";
import { formatDate, formatCurrency } from "@/utils/formatters";

interface PatientTransactionHistoryProps {
  patientCode: string;
}

export function PatientTransactionHistory({ patientCode }: PatientTransactionHistoryProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { transactions, loading, error } = usePatientTransactions(patientCode);

  const formatClaimDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load transaction history",
      variant: "destructive"
    });
  }

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
            <TableHead className="text-right">Claimed</TableHead>
            <TableHead className="text-right">Claimed On</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6">
                Loading transactions...
              </TableCell>
            </TableRow>
          ) : transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>
                  <span 
                    className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80"
                    onClick={() => navigate(`/patients/${patientCode}/transactions/${transaction.code}`)}
                  >
                    {transaction.code}
                  </span>
                </TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.grossAmount)}</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.deposit)}</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.balance)}</TableCell>
                <TableCell className="text-right">
                  {transaction.claimed && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {formatClaimDate(transaction.claimed ? transaction.dateClaimed : null)}
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
                        onClick={() => navigate(`/patients/${patientCode}/transactions/${transaction.code}`)}
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
              <TableCell colSpan={9} className="text-center py-6">
                No transactions found for this patient.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
