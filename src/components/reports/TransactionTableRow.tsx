
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
  const handleTransactionClick = () => {
    // Navigate directly to the transaction route without requiring a patient code
    navigate(`/transactions/${transaction.code}`);
  };
  
  // Get frame type (hardcoded for now, as it's not in the transaction model)
  const frameType = "Full Rim";
  
  return (
    <TableRow key={transaction.id}>
      <TableCell className="print:hidden">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(transaction.id)}
        />
      </TableCell>
      <TableCell>{transaction.date}</TableCell>
      <TableCell>
        <span 
          className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80"
          onClick={handleTransactionClick}
        >
          {transaction.code}
        </span>
      </TableCell>
      <TableCell>{transaction.patientName}</TableCell>
      <TableCell>{transaction.type}</TableCell>
      <TableCell>{transaction.refractiveIndex || 'N/A'}</TableCell>
      <TableCell>{frameType}</TableCell>
      <TableCell>{transaction.lensType || 'N/A'}</TableCell>
      <TableCell>{transaction.lensCoating || 'N/A'}</TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.lensCapital)}</TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.edgingPrice)}</TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.otherExpenses)}</TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.totalExpenses)}</TableCell>
      <TableCell className="max-w-[200px] truncate">{transaction.orderNotes}</TableCell>
    </TableRow>
  );
}
