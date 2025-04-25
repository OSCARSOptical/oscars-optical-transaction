
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns";
import { Trash2, PenLine } from "lucide-react";
import { Transaction } from '@/types';

interface TransactionHeaderProps {
  transaction: Transaction;
  onClaimedToggle: () => void;
  pageTitle?: string;
  patientName?: string;
  patientCode?: string;
  readOnly?: boolean;
}

export function TransactionHeader({
  transaction,
  onClaimedToggle,
  pageTitle = "Transaction Details",
  patientName,
  patientCode,
  readOnly
}: TransactionHeaderProps) {
  const navigate = useNavigate();
  const transactionDate = transaction.date ? new Date(transaction.date) : new Date();

  const handleDelete = () => {
    // Remove transaction from localStorage
    localStorage.removeItem(`transaction_${transaction.code}`);
    
    // Navigate back to patient's transactions
    navigate(`/patients/${transaction.patientCode}`);
  };

  const handleEdit = () => {
    // Navigate to the edit transaction page correctly
    navigate(`/transactions/edit/${transaction.code}`, { 
      state: { transaction } 
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          {patientName && (
            <p className="text-muted-foreground">
              Patient: {patientName} ({patientCode})
            </p>
          )}
        </div>
        {!readOnly && (
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleEdit}>
              <PenLine className="h-4 w-4 mr-2" />
              Edit Transaction
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Transaction
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete transaction {transaction.code}
                    and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Badge 
          variant={transaction.claimed ? "default" : "secondary"}
          className="cursor-pointer hover:opacity-90"
          onClick={onClaimedToggle}
        >
          {transaction.claimed ? "Claimed" : "Unclaimed"}
        </Badge>
        {transaction.claimed && transaction.dateClaimed && (
          <span className="text-sm text-muted-foreground">
            Claimed on {format(new Date(transaction.dateClaimed), 'PPP')}
          </span>
        )}
      </div>
    </div>
  );
}
