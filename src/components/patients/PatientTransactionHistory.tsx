import { TableCell, TableRow, Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { usePatientTransactions } from "@/hooks/usePatientTransactions";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Transaction } from "@/types";
import { handleTransactionClaim } from "@/utils/transactionUtils";
import { UnclaimConfirmDialog } from "@/components/transactions/UnclaimConfirmDialog";

interface PatientTransactionHistoryProps {
  patientCode: string;
}

export function PatientTransactionHistory({ patientCode }: PatientTransactionHistoryProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { transactions: initialTransactions, loading, error } = usePatientTransactions(patientCode);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showUnclaimDialog, setShowUnclaimDialog] = useState(false);
  const [transactionToUnclaim, setTransactionToUnclaim] = useState<Transaction | null>(null);

  useState(() => {
    if (initialTransactions.length > 0) {
      setTransactions(initialTransactions);
    }
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load transaction history",
      variant: "destructive"
    });
  }

  const handleClaimedToggle = (transaction: Transaction) => {
    if (transaction.claimed) {
      setTransactionToUnclaim(transaction);
      setShowUnclaimDialog(true);
      return;
    }

    const updatedTransaction = handleTransactionClaim(transaction);
    
    setTransactions(prevTransactions => 
      prevTransactions.map(t => 
        t.id === transaction.id ? updatedTransaction : t
      )
    );

    toast({
      title: "✓ Payment Claimed!",
      description: `Balance of ${formatCurrency(transaction.balance)} has been collected and recorded.`,
      className: "bg-[#FFC42B] text-[#241715] rounded-lg",
      duration: 3000,
    });
  };

  const handleUnclaimConfirm = () => {
    if (!transactionToUnclaim) return;

    const updatedTransaction = handleTransactionClaim(transactionToUnclaim);
    
    setTransactions(prevTransactions => 
      prevTransactions.map(t => 
        t.id === transactionToUnclaim.id ? updatedTransaction : t
      )
    );

    toast({
      title: "Claim Removed",
      description: "Transaction restored to unclaimed status.",
      variant: "default"
    });

    setShowUnclaimDialog(false);
    setTransactionToUnclaim(null);
  };

  return (
    <div className="space-y-4 overflow-auto">
      <Table className="min-w-[1180px]">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Gross Amount</TableHead>
            <TableHead className="text-right">Deposit</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-center w-[64px]">Claimed</TableHead>
            <TableHead>Claimed On</TableHead>
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
                <TableCell className="text-center">
                  <Checkbox
                    checked={transaction.claimed}
                    onCheckedChange={() => handleClaimedToggle(transaction)}
                    className={`border-2 !border-[#8E9196] bg-white ${
                      transaction.claimed
                        ? "!border-[#ea384c] !bg-[#ea384c]/10 !text-[#ea384c]"
                        : "!text-[#8E9196]"
                    }`}
                    style={{
                      color: transaction.claimed ? "#ea384c" : "#8E9196",
                    }}
                  />
                </TableCell>
                <TableCell>
                  {transaction.claimed && transaction.dateClaimed 
                    ? formatDate(transaction.dateClaimed)
                    : <span className="text-[#8E9196]">Unclaimed</span>}
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

      <UnclaimConfirmDialog
        open={showUnclaimDialog}
        onOpenChange={setShowUnclaimDialog}
        onConfirm={handleUnclaimConfirm}
      />
    </div>
  );
}
