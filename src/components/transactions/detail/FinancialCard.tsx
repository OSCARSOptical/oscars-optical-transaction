
import { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from '@/utils/formatters';
import { useFinancialCalculations } from '@/hooks/useFinancialCalculations';

interface FinancialCardProps {
  transaction: Transaction;
}

export function FinancialCard({ transaction }: FinancialCardProps) {
  // Use the financial calculations hook to ensure consistency across the app
  const [calculatedValues] = useFinancialCalculations({
    grossAmount: transaction.grossAmount || 0,
    deposit: transaction.deposit || 0,
    lensCapital: transaction.lensCapital || 0,
    edgingPrice: transaction.edgingPrice || 0,
    otherExpenses: transaction.otherExpenses || 0
  });

  const { balance, totalExpenses, netIncome } = calculatedValues;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Financial Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Gross Amount</TableCell>
              <TableCell className="text-right">{formatCurrency(transaction.grossAmount)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Deposit</TableCell>
              <TableCell className="text-right">{formatCurrency(transaction.deposit)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Balance</TableCell>
              <TableCell className="text-right">{formatCurrency(balance)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Expenses</TableCell>
              <TableCell className="text-right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">Lens Capital</TableCell>
              <TableCell className="text-right">{formatCurrency(transaction.lensCapital)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">Edging Price</TableCell>
              <TableCell className="text-right">{formatCurrency(transaction.edgingPrice)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">Other Expenses</TableCell>
              <TableCell className="text-right">{formatCurrency(transaction.otherExpenses)}</TableCell>
            </TableRow>
            <TableRow className="font-medium">
              <TableCell>Total Expenses</TableCell>
              <TableCell className="text-right">{formatCurrency(totalExpenses)}</TableCell>
            </TableRow>
            <TableRow className="font-bold">
              <TableCell>Net Income</TableCell>
              <TableCell className="text-right">{formatCurrency(netIncome)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
