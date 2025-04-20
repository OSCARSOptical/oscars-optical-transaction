
import { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from '@/utils/formatters';

interface FinancialCardProps {
  transaction: Transaction;
}

export function FinancialCard({ transaction }: FinancialCardProps) {
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
              <TableCell className="text-right">{formatCurrency(transaction.balance)}</TableCell>
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
              <TableCell className="text-right">{formatCurrency(transaction.totalExpenses)}</TableCell>
            </TableRow>
            <TableRow className="font-bold">
              <TableCell>Net Income</TableCell>
              <TableCell className="text-right">{formatCurrency(transaction.deposit - transaction.totalExpenses)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
