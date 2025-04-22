
import { Link } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
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
}

const JobOrdersTable = ({ 
  transactions, 
  selectedRows = [], 
  selectAll = false, 
  onSelectAll = () => {}, 
  onSelectRow = () => {},
  isPrintView = false,
  additionalItems = []
}: JobOrdersTableProps) => {
  const calculateTotal = () => {
    const transactionsTotal = transactions.reduce((sum, tx) => sum + tx.grossAmount, 0);
    const additionalTotal = additionalItems.reduce((sum, item) => sum + item.amount, 0);
    return transactionsTotal + additionalTotal;
  };

  const transactionsTotal = transactions.reduce((sum, tx) => sum + tx.grossAmount, 0);

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isPrintView ? 13 : 14} className="text-center py-10">
                No job orders found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id}>
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {isPrintView && (
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center px-4 font-semibold">
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
