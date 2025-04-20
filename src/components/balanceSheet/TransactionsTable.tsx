
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { Transaction } from "@/types";
import { TransactionRow } from "./TransactionRow";
import { TransactionSummaryRow } from "./TransactionSummaryRow";

interface TransactionsTableProps {
  transactions: Transaction[];
  formatCurrency: (amount: number) => string;
}

export function TransactionsTable({ transactions, formatCurrency }: TransactionsTableProps) {
  const totalGrossAmount = transactions.reduce((sum, tx) => sum + tx.grossAmount, 0);
  const totalDeposits = transactions.reduce((sum, tx) => sum + tx.deposit, 0);
  const totalExpenses = transactions.reduce((sum, tx) => sum + tx.totalExpenses, 0);
  const dailyNetIncome = totalDeposits - totalExpenses;

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[220px]">Description</TableHead>
            <TableHead className="w-[120px] text-right">Gross Amount</TableHead>
            <TableHead className="w-[120px] text-right">Deposit</TableHead>
            <TableHead className="w-[120px] text-right">Balance</TableHead>
            <TableHead className="w-[120px] text-right">Expenses</TableHead>
            <TableHead className="w-[120px] text-right">Net Income</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              formatCurrency={formatCurrency}
            />
          ))}
          <TransactionSummaryRow
            transactions={transactions}
            totalGrossAmount={totalGrossAmount}
            totalDeposits={totalDeposits}
            totalExpenses={totalExpenses}
            dailyNetIncome={dailyNetIncome}
            formatCurrency={formatCurrency}
          />
        </TableBody>
      </Table>
    </div>
  );
}
