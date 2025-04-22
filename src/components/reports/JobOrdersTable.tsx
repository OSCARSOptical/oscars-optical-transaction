
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Transaction } from '@/types';
import { formatDate, formatCurrency } from '@/utils/formatters';

interface JobOrdersTableProps {
  transactions: Transaction[];
  loading: boolean;
  selectedTransactions?: string[];
  onSelectAll?: (checked: boolean) => void;
  onSelectTransaction?: (id: string, checked: boolean) => void;
  printMode?: boolean;
}

export function JobOrdersTable({
  transactions,
  loading,
  selectedTransactions = [],
  onSelectAll,
  onSelectTransaction,
  printMode = false
}: JobOrdersTableProps) {
  const allSelected = 
    transactions.length > 0 && 
    selectedTransactions.length === transactions.length;

  return (
    <div className={`relative overflow-x-auto ${printMode ? '' : 'max-h-[calc(100vh-300px)]'}`}>
      <Table className={printMode ? "print-table" : ""}>
        <TableHeader>
          <TableRow>
            {!printMode && onSelectAll && (
              <TableHead className="w-[48px]">
                <Checkbox 
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  disabled={transactions.length === 0}
                />
              </TableHead>
            )}
            <TableHead>Date</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Transaction Type</TableHead>
            <TableHead>Refractive Index</TableHead>
            <TableHead>Lens Type</TableHead>
            <TableHead>Lens Coating</TableHead>
            <TableHead className="text-right">Lens Capital</TableHead>
            <TableHead className="text-right">Edging Price</TableHead>
            <TableHead className="text-right">Other Expenses</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={printMode ? 11 : 12} className="text-center py-10">
                Loading job orders...
              </TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={printMode ? 11 : 12} className="text-center py-10">
                No job orders found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                {!printMode && onSelectTransaction && (
                  <TableCell>
                    <Checkbox 
                      checked={selectedTransactions.includes(transaction.id)}
                      onCheckedChange={(checked) => 
                        onSelectTransaction(transaction.id, checked === true)
                      }
                    />
                  </TableCell>
                )}
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>
                  <Link 
                    to={`/transactions/${transaction.code}?patientCode=${transaction.patientCode}`}
                    className={`text-[#9E0214] ${!printMode ? 'hover:underline' : ''}`}
                  >
                    {transaction.code}
                  </Link>
                </TableCell>
                <TableCell>{transaction.patientName}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.refractiveIndex || 'N/A'}</TableCell>
                <TableCell>{transaction.lensType || 'N/A'}</TableCell>
                <TableCell>{transaction.lensCoating || 'N/A'}</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.lensCapital || 0)}</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.edgingPrice || 0)}</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.otherExpenses || 0)}</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.totalExpenses || 0)}</TableCell>
                <TableCell className="max-w-[200px] truncate">{transaction.orderNotes || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
