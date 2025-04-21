import { Transaction } from '@/types';
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";

// Add new prop for navigation
interface TransactionTableRowProps {
  transaction: Transaction;
  onClaimedToggle: (id: string, claimed: boolean) => void;
  enableNavigation?: boolean;
}

export function TransactionTableRow({
  transaction,
  onClaimedToggle,
  enableNavigation = false
}: TransactionTableRowProps) {
  const navigate = useNavigate();

  const handleRowClick = () => {
    if (enableNavigation) {
      navigate(`/patients/${transaction.patientCode}/transactions/${transaction.code}`, {
        state: {
          patientName: `${transaction.firstName} ${transaction.lastName}`,
        }
      });
    }
  };

  return (
    <TableRow className={enableNavigation ? "cursor-pointer hover:bg-gray-50" : ""}>
      <TableCell>
        <span
          className={enableNavigation ? "text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80" : ""}
          onClick={handleRowClick}
        >
          {transaction.date}
        </span>
      </TableCell>
      <TableCell>
        <span
          className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80"
          onClick={handleRowClick}
        >
          {transaction.code}
        </span>
      </TableCell>
      <TableCell>{transaction.firstName} {transaction.lastName}</TableCell>
      <TableCell>{transaction.patientCode}</TableCell>
      <TableCell>{transaction.type}</TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.grossAmount)}</TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.deposit)}</TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.balance)}</TableCell>
      <TableCell>{transaction.claimed ? "Yes" : "No"}</TableCell>
      <TableCell>{transaction.dateClaimed ?? "—"}</TableCell>
      <TableCell className="w-[60px]"></TableCell>
    </TableRow>
  );
}
