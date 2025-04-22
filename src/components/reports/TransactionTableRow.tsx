import { Link } from 'react-router-dom';
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface TransactionTableRowProps {
  transaction: Transaction;
  isSelected: boolean;
  onToggleSelection: (transactionId: string) => void;
  showWhenPrinting?: boolean;
}

export function TransactionTableRow({ 
  transaction, 
  isSelected, 
  onToggleSelection,
  showWhenPrinting = true
}: TransactionTableRowProps) {
  const frameType = "Full Rim";
  
  return (
    <TableRow 
      key={transaction.id} 
      className={`${isSelected ? "bg-gray-50" : ""} ${!showWhenPrinting ? "print-hide" : ""}`}
    >
      <TableCell className="print:hidden">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(transaction.id)}
        />
      </TableCell>
      <TableCell className="w-[80px]">{transaction.date}</TableCell>
      <TableCell className="w-[100px]">
        <Link 
          to={{
            pathname: `/transactions/${transaction.code}`,
            search: `?patientCode=${transaction.patientCode}`
          }}
          className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80 print:no-underline print:text-black"
        >
          {transaction.code}
        </Link>
      </TableCell>
      <TableCell className="w-[120px]">{transaction.patientName}</TableCell>
      <TableCell className="w-[100px]">{transaction.type}</TableCell>
      <TableCell className="w-[60px]">{transaction.refractiveIndex || 'N/A'}</TableCell>
      <TableCell className="w-[80px]">{frameType}</TableCell>
      <TableCell className="w-[80px]">{transaction.lensType || 'N/A'}</TableCell>
      <TableCell className="w-[80px]">{transaction.lensCoating || 'N/A'}</TableCell>
      <TableCell className="w-[80px] text-right">{formatCurrency(transaction.lensCapital)}</TableCell>
      <TableCell className="w-[80px] text-right">{formatCurrency(transaction.edgingPrice)}</TableCell>
      <TableCell className="w-[80px] text-right">{formatCurrency(transaction.otherExpenses)}</TableCell>
      <TableCell className="w-[80px] text-right">{formatCurrency(transaction.totalExpenses)}</TableCell>
      <TableCell className="w-[120px] truncate">{transaction.orderNotes}</TableCell>
    </TableRow>
  );
}
