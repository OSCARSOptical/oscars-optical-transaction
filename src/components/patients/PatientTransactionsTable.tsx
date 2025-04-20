
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { formatDate, formatCurrency } from '@/utils/formatters';
import { usePatientTransactions } from '@/hooks/usePatientTransactions';

interface PatientTransactionsTableProps {
  patientCode: string;
}

export function PatientTransactionsTable({ patientCode }: PatientTransactionsTableProps) {
  const navigate = useNavigate();
  const { transactions, loading, error } = usePatientTransactions(patientCode);

  if (error) {
    return <div>Failed to load transactions</div>;
  }

  return (
    <div className="overflow-auto">
      <Table className="min-w-[1180px]">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Gross Amount</TableHead>
            <TableHead className="text-right">Deposit</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-center w-[64px]">Claimed</TableHead>
            <TableHead className="text-right w-[110px]">Claimed On</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                Loading transactions...
              </TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>
                  <span 
                    className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80"
                    onClick={() => navigate(`/patients/${patientCode}/transactions/${transaction.code}`)}
                  >
                    {transaction.code}
                  </span>
                </TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.grossAmount)}</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.deposit)}</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.balance)}</TableCell>
                <TableCell className="text-center">
                  {transaction.claimed && (
                    <Check className="mx-auto h-4 w-4 text-[#9E0214]" strokeWidth={3} />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {transaction.claimed ? formatDate(transaction.dateClaimed) : '—'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default PatientTransactionsTable;
