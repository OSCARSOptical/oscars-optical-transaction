
import { useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { Transaction } from '@/types';
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { TransactionTableHeader } from './TransactionTableHeader';
import { TransactionTableRow } from './TransactionTableRow';
import { TransactionTotalsRow } from './TransactionTotalsRow';

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

  // Filter transactions to only show selected ones if any are selected
  const displayTransactions = selectedTransactions.length > 0
    ? transactions.filter(transaction => selectedTransactions.includes(transaction.id))
    : transactions;

  return (
    <div className="space-y-4 print-container">
      <div className="flex justify-between items-center print:hidden">
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
      
      <div className="print:block relative overflow-x-auto print-section">
        <Table>
          <TransactionTableHeader />
          <TableBody>
            {transactions.map((transaction) => (
              <TransactionTableRow
                key={transaction.id}
                transaction={transaction}
                isSelected={selectedTransactions.includes(transaction.id)}
                onToggleSelection={toggleSelection}
              />
            ))}
            {selectedTransactions.length > 0 && (
              <TransactionTotalsRow totals={totals} />
            )}
          </TableBody>
        </Table>
      </div>

      <style>
        {`
          @media print {
            @page {
              size: landscape;
            }
            
            body * {
              visibility: hidden;
            }
            
            .print-section, .print-section * {
              visibility: visible;
            }
            
            .print-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            
            /* Make sure the table columns are properly sized */
            table {
              width: 100%;
              table-layout: auto;
            }
            
            /* Hide selection checkboxes on print */
            .print:hidden {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}
