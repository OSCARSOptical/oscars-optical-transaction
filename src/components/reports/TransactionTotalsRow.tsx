
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";

interface TransactionTotalsRowProps {
  totals: {
    lensCapital: number;
    edgingPrice: number;
    otherExpenses: number;
    total: number;
  };
}

export function TransactionTotalsRow({ totals }: TransactionTotalsRowProps) {
  return (
    <TableRow className="font-bold">
      <TableCell colSpan={9} className="print:hidden">Totals</TableCell>
      <TableCell className="text-right">{formatCurrency(totals.lensCapital)}</TableCell>
      <TableCell className="text-right">{formatCurrency(totals.edgingPrice)}</TableCell>
      <TableCell className="text-right">{formatCurrency(totals.otherExpenses)}</TableCell>
      <TableCell className="text-right">{formatCurrency(totals.total)}</TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
}
