
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from '@/types';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { formatCurrency } from '@/utils/formatters';

interface TransactionReportProps {
  transactions: Transaction[];
}

export function TransactionReport({ transactions }: TransactionReportProps) {
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);

  const toggleSelection = (transactionId: string) => {
    setSelectedTransactions(prev => 
      prev.includes(transactionId) 
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate totals for selected transactions
  const totals = {
    lensCapital: selectedTransactions.reduce((sum, id) => {
      const transaction = transactions.find(t => t.id === id);
      return sum + (transaction?.lensCapital || 0);
    }, 0),
    edgingPrice: selectedTransactions.reduce((sum, id) => {
      const transaction = transactions.find(t => t.id === id);
      return sum + (transaction?.edgingPrice || 0);
    }, 0),
    otherExpenses: selectedTransactions.reduce((sum, id) => {
      const transaction = transactions.find(t => t.id === id);
      return sum + (transaction?.otherExpenses || 0);
    }, 0),
    total: selectedTransactions.reduce((sum, id) => {
      const transaction = transactions.find(t => t.id === id);
      return sum + (transaction?.totalExpenses || 0);
    }, 0),
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transaction Report</h2>
        <Button 
          onClick={handlePrint} 
          className="print:hidden"
          disabled={selectedTransactions.length === 0}
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Report
        </Button>
      </div>
      
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] print:hidden">Select</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Transaction Type</TableHead>
              <TableHead>RI</TableHead>
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
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="print:hidden">
                  <Checkbox
                    checked={selectedTransactions.includes(transaction.id)}
                    onCheckedChange={() => toggleSelection(transaction.id)}
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
            ))}
            {selectedTransactions.length > 0 && (
              <TableRow className="font-bold">
                <TableCell colSpan={9} className="print:hidden">Totals</TableCell>
                <TableCell className="text-right">{formatCurrency(totals.lensCapital)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totals.edgingPrice)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totals.otherExpenses)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totals.total)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-section, .print-section * {
              visibility: visible;
            }
            .print-section {
              position: absolute;
              left: 0;
              top: 0;
            }
          }
        `}
      </style>
    </div>
  );
}
