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
            {displayTransactions.map((transaction) => (
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
              margin: 1cm;
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
            
            .print-header {
              display: flex;
              align-items: center;
              margin-bottom: 1cm;
            }
            
            .print-logo {
              max-width: 200px;
              margin-right: 20px;
            }
            
            .print-title {
              font-size: 18pt;
              font-weight: bold;
            }
            
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
            
            .print\\:hidden {
              display: none !important;
            }
          }
        `}
      </style>

      <div className="print-header print:hidden">
        <img 
          src="/path/to/oscars-optical-logo.png" 
          alt="OSCARS Optical Logo" 
          className="print-logo" 
        />
        <div className="print-title">Transaction Report</div>
      </div>
    </div>
  );
}
