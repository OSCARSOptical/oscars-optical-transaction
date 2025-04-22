
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
        {/* Print-only header with logo */}
        <div className="hidden print:flex print:items-center print:mb-4">
          <img 
            src="/lovable-uploads/4a1415d8-524e-4a2b-9e0f-d5d704e60955.png" 
            alt="OSCARS Optical Clinic" 
            className="h-16"
          />
          <h1 className="text-2xl font-bold ml-4">Transaction Report</h1>
        </div>

        <Table>
          <TransactionTableHeader />
          <TableBody>
            {transactions.map((transaction) => (
              <TransactionTableRow
                key={transaction.id}
                transaction={transaction}
                isSelected={selectedTransactions.includes(transaction.id)}
                onToggleSelection={toggleSelection}
                showWhenPrinting={selectedTransactions.length === 0 || selectedTransactions.includes(transaction.id)}
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
              margin: 0.5cm;
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
            
            /* Optimize table for print */
            table {
              width: 100%;
              table-layout: fixed;
              border-collapse: collapse;
              font-size: 8pt;
            }

            td, th {
              padding: 4px !important;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            tr {
              page-break-inside: avoid;
            }
            
            /* Hide selection checkboxes on print */
            .print\:hidden {
              display: none !important;
            }

            /* Hide non-selected transactions during print */
            tr.print-hide {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}
