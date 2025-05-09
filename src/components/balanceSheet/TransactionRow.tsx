
import { TableCell, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TransactionRowProps {
  transaction: Transaction;
  formatCurrency: (amount: number) => string;
}

export function TransactionRow({ transaction, formatCurrency }: TransactionRowProps) {
  const navigate = useNavigate();
  const netIncome = transaction.deposit - transaction.totalExpenses;
  
  const handleNavigateToTransaction = () => {
    if (transaction.isBalancePayment && transaction.code.includes(' - Balance')) {
      // Extract the original transaction code from the description
      const originalCode = transaction.code.split(' - Balance')[0];
      navigate(`/patients/${transaction.patientCode}/transactions/${originalCode}`);
    } else {
      navigate(`/patients/${transaction.patientCode}/transactions/${transaction.code}`);
    }
  };
  
  return (
    <TableRow>
      <TableCell className="min-w-[220px] truncate">
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80 text-left"
              onClick={handleNavigateToTransaction}
            >
              {transaction.code}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{transaction.code}</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.grossAmount)}</TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.deposit)}</TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.balance)}</TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.totalExpenses)}</TableCell>
      <TableCell className="text-right">
        <span className={netIncome >= 0 ? 'text-[#009B29]' : 'text-[#9E0214]'}>
          {formatCurrency(netIncome)}
        </span>
      </TableCell>
    </TableRow>
  );
}
