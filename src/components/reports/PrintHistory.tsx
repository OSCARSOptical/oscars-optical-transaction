
import { useState } from 'react';
import { formatDate } from '@/utils/formatters';
import { PrintHistoryEntry } from '@/pages/JobOrders';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, ChevronDown, ChevronUp } from "lucide-react";
import { JobOrdersTable } from './JobOrdersTable';

interface PrintHistoryProps {
  printHistory: PrintHistoryEntry[];
}

export function PrintHistory({ printHistory }: PrintHistoryProps) {
  const [expandedEntries, setExpandedEntries] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    if (expandedEntries.includes(id)) {
      setExpandedEntries(expandedEntries.filter(entryId => entryId !== id));
    } else {
      setExpandedEntries([...expandedEntries, id]);
    }
  };

  const handlePrint = (entry: PrintHistoryEntry) => {
    // Create a popup window for printing specific history entry
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Job Orders</title>
        <style>
          @page {
            size: landscape;
          }
          body {
            font-family: system-ui, sans-serif;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
          }
          tr:nth-child(25n+26) {
            page-break-before: always;
          }
        </style>
      </head>
      <body>
        <h2>Job Orders - Printed on ${formatDate(entry.datePrinted)}</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction ID</th>
              <th>Patient Name</th>
              <th>Transaction Type</th>
              <th>Refractive Index</th>
              <th>Lens Type</th>
              <th>Lens Coating</th>
              <th>Lens Capital</th>
              <th>Edging Price</th>
              <th>Other Expenses</th>
              <th>Total</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${entry.transactions.map(t => `
              <tr>
                <td>${formatDate(t.date)}</td>
                <td>${t.code}</td>
                <td>${t.patientName}</td>
                <td>${t.type}</td>
                <td>${t.refractiveIndex || 'N/A'}</td>
                <td>${t.lensType || 'N/A'}</td>
                <td>${t.lensCoating || 'N/A'}</td>
                <td align="right">₱${t.lensCapital?.toFixed(2)}</td>
                <td align="right">₱${t.edgingPrice?.toFixed(2)}</td>
                <td align="right">₱${t.otherExpenses?.toFixed(2)}</td>
                <td align="right">₱${t.totalExpenses?.toFixed(2)}</td>
                <td>${t.orderNotes || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Print History</h3>
      
      {printHistory.map((entry) => (
        <Card key={entry.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50 pb-0 pt-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Printed on {formatDate(entry.datePrinted)}
              </CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleExpand(entry.id)}
                >
                  {expandedEntries.includes(entry.id) ? (
                    <ChevronUp className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  )}
                  {expandedEntries.includes(entry.id) ? 'Hide' : 'Show'} Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePrint(entry)}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Re-print
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {entry.transactions.length} record{entry.transactions.length !== 1 ? 's' : ''} • 
              {entry.transactions.map(t => t.code).join(', ')}
            </div>
          </CardHeader>
          
          {expandedEntries.includes(entry.id) && (
            <CardContent className="pt-4">
              <JobOrdersTable 
                transactions={entry.transactions}
                loading={false}
                printMode={true}
              />
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
