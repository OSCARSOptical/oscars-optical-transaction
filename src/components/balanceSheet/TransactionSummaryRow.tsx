
import { TableCell, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types";

interface TransactionSummaryRowProps {
  transactions: Transaction[];
  totalGrossAmount: number;
  totalDeposits: number;
  totalExpenses: number;
  dailyNetIncome: number;
  formatCurrency: (amount: number) => string;
}

export function TransactionSummaryRow({ 
  transactions, 
  totalGrossAmount, 
  totalDeposits, 
  totalExpenses, 
  dailyNetIncome,
  formatCurrency 
}: TransactionSummaryRowProps) {
  return (
    <TableRow className="border-t border-gray-200 font-medium">
      <TableCell>Total</TableCell>
      <TableCell className="text-right">{formatCurrency(totalGrossAmount)}</TableCell>
      <TableCell className="text-right">{formatCurrency(totalDeposits)}</TableCell>
      <TableCell className="text-right">{formatCurrency(transactions.reduce((sum, tx) => sum + tx.balance, 0))}</TableCell>
      <TableCell className="text-right">{formatCurrency(totalExpenses)}</TableCell>
      <TableCell className="text-right">
        <span className={dailyNetIncome >= 0 ? 'text-[#009B29]' : 'text-[#9E0214]'}>
          {formatCurrency(dailyNetIncome)}
        </span>
      </TableCell>
    </TableRow>
  );
}
