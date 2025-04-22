
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface TransactionTableRowProps {
  transaction: Transaction;
  isSelected: boolean;
  onToggleSelection: (transactionId: string) => void;
}

export function TransactionTableRow({ 
  transaction, 
  isSelected, 
  onToggleSelection 
}: TransactionTableRowProps) {
  return (
    <TableRow key={transaction.id}>
      <TableCell className="print:hidden">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(transaction.id)}
        />
      </TableCell>
      <TableCell>{transaction.date}</TableCell>
      <TableCell>{transaction.code}</TableCell>
      <TableCell>{transaction.patientName}</TableCell>
      <TableCell>{transaction.type}</TableCell>
      <TableCell>{transaction.refractiveIndex || 'N/A'}</TableCell>
      <TableCell>Full Rim</TableCell>
      <TableCell>{transaction.lensType}</TableCell>
      <TableCell>{transaction.lensCoating}</TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.lensCapital)}</TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.edgingPrice)}</TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.otherExpenses)}</TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.totalExpenses)}</TableCell>
      <TableCell className="max-w-[200px] truncate">{transaction.orderNotes}</TableCell>
    </TableRow>
  );
}
