
import { Link } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { AdditionalItem } from './AdditionalItemsDialog';

interface JobOrdersTableProps {
  transactions: Transaction[];
  selectedRows?: string[];
  selectAll?: boolean;
  onSelectAll?: () => void;
  onSelectRow?: (id: string) => void;
  isPrintView?: boolean;
  additionalItems?: AdditionalItem[];
  printedTransactions?: string[];
}

const JobOrdersTable = ({ 
  transactions, 
  selectedRows = [], 
  selectAll = false, 
  onSelectAll = () => {}, 
  onSelectRow = () => {},
  isPrintView = false,
  additionalItems = [],
  printedTransactions = []
}: JobOrdersTableProps) => {
  // Calculate expense subtotals
  const lensCapitalTotal = transactions.reduce((sum, tx) => sum + tx.lensCapital, 0);
  const edgingPriceTotal = transactions.reduce((sum, tx) => sum + tx.edgingPrice, 0);
  const otherExpensesTotal = transactions.reduce((sum, tx) => sum + tx.otherExpenses, 0);
  
  const transactionsTotal = transactions.reduce((sum, tx) => sum + tx.grossAmount, 0);
  
  const calculateTotal = () => {
    const additionalTotal = additionalItems.reduce((sum, item) => sum + item.amount, 0);
    return transactionsTotal + additionalTotal;
  };

  return (
    <div className={`w-full overflow-auto ${isPrintView ? 'print-table' : ''}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {!isPrintView && (
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectAll} 
                  onCheckedChange={onSelectAll} 
                  aria-label="Select all" 
                />
              </TableHead>
            )}
            <TableHead>Date</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Transaction Type</TableHead>
            <TableHead>Refractive Index</TableHead>
            <TableHead>Frame Type</TableHead>
            <TableHead>Lens Type</TableHead>
            <TableHead>Lens Coating</TableHead>
            <TableHead className="text-right">Lens Capital</TableHead>
            <TableHead className="text-right">Edging Price</TableHead>
            <TableHead className="text-right">Other Expenses</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Notes</TableHead>
            {!isPrintView && <TableHead>Status</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isPrintView ? 13 : 15} className="text-center py-10">
                No job orders found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id} className={printedTransactions.includes(tx.id) && !isPrintView ? "bg-gray-50" : ""}>
                {!isPrintView && (
                  <TableCell>
                    <Checkbox 
                      checked={selectedRows.includes(tx.id)} 
                      onCheckedChange={() => onSelectRow(tx.id)} 
                      aria-label={`Select row ${tx.id}`} 
                    />
                  </TableCell>
                )}
                <TableCell>{formatDate(tx.date)}</TableCell>
                <TableCell>
                  <Link 
                    to={`/patients/${tx.patientCode}/transactions/${tx.code}`}
                    className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80"
                  >
                    {tx.code}
                  </Link>
                </TableCell>
                <TableCell>{tx.patientName}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell>{tx.refractiveIndex || 'N/A'}</TableCell>
                <TableCell>{'N/A'}</TableCell>
                <TableCell>{tx.lensType || 'N/A'}</TableCell>
                <TableCell>{tx.lensCoating || 'N/A'}</TableCell>
                <TableCell className="text-right">{formatCurrency(tx.lensCapital)}</TableCell>
                <TableCell className="text-right">{formatCurrency(tx.edgingPrice)}</TableCell>
                <TableCell className="text-right">{formatCurrency(tx.otherExpenses)}</TableCell>
                <TableCell className="text-right">{formatCurrency(tx.grossAmount)}</TableCell>
                <TableCell className="max-w-[200px] truncate">{tx.orderNotes || '—'}</TableCell>
                {!isPrintView && (
                  <TableCell>
                    {printedTransactions.includes(tx.id) && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Printed
                      </Badge>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {isPrintView && (
        <div className="mt-6 border-t pt-4">
          {/* Expense breakdown section */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="font-semibold">Lens Capital</div>
              <div className="font-bold text-lg">{formatCurrency(lensCapitalTotal)}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Edging Price</div>
              <div className="font-bold text-lg">{formatCurrency(edgingPriceTotal)}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Other Expenses</div>
              <div className="font-bold text-lg">{formatCurrency(otherExpensesTotal)}</div>
            </div>
          </div>

          <div className="flex justify-between font-bold mt-4 pt-2 border-t">
            <div>Total Expenses:</div>
            <div>{formatCurrency(transactionsTotal)}</div>
          </div>

          {additionalItems && additionalItems.length > 0 && (
            <>
              {additionalItems.map((item, index) => (
                <div key={`additional-${index}`} className="flex justify-between items-center px-4 mt-2">
                  <div>{item.description}:</div>
                  <div>{formatCurrency(item.amount)}</div>
                </div>
              ))}
              
              <div className="flex justify-between items-center px-4 mt-4 pt-2 border-t font-bold">
                <div>GRAND TOTAL:</div>
                <div>{formatCurrency(calculateTotal())}</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default JobOrdersTable;
