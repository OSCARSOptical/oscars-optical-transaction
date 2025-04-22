import { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { sampleTransactions } from '@/data/sampleData';
import { Transaction } from '@/types';
import BreadcrumbNav from '@/components/layout/Breadcrumb';
import JobOrdersTable from '@/components/reports/JobOrdersTable';
import AdditionalItemsDialog, { AdditionalItem } from '@/components/reports/AdditionalItemsDialog';
import { Button } from '@/components/ui/button';
import { Printer, RefreshCw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const JobOrders = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [additionalItems, setAdditionalItems] = useState<AdditionalItem[]>([]);
  const [printedTransactions, setPrintedTransactions] = useState<string[]>([]);
  const printRef = useRef<HTMLDivElement>(null);
  const [showClearHistoryDialog, setShowClearHistoryDialog] = useState(false);

  useEffect(() => {
    const sortedTransactions = [...sampleTransactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setTransactions(sortedTransactions);
    
    // Try to retrieve previously printed transactions from localStorage
    const savedPrintedTx = localStorage.getItem('printedTransactions');
    if (savedPrintedTx) {
      setPrintedTransactions(JSON.parse(savedPrintedTx));
    }
  }, []);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(transactions.map(tx => tx.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
      setSelectAll(false);
    } else {
      setSelectedRows([...selectedRows, id]);
      if (selectedRows.length + 1 === transactions.length) {
        setSelectAll(true);
      }
    }
  };

  const calculateTransactionTotal = () => {
    return transactions
      .filter(tx => selectedRows.includes(tx.id))
      .reduce((sum, tx) => sum + tx.grossAmount, 0);
  };

  const handlePrint = useReactToPrint({
    documentTitle: "Job Orders Report",
    onBeforePrint: () => {
      console.log("Preparing to print...");
      return Promise.resolve();
    },
    onAfterPrint: () => {
      console.log("Print completed or canceled");
      
      // Mark selected transactions as printed
      const newPrintedTransactions = [...printedTransactions, ...selectedRows];
      setPrintedTransactions(newPrintedTransactions);
      
      // Save to localStorage
      localStorage.setItem('printedTransactions', JSON.stringify(newPrintedTransactions));
      
      setAdditionalItems([]);
      return Promise.resolve();
    },
    contentRef: printRef,
    pageStyle: `
      @page {
        size: landscape;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        table { page-break-inside: auto; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        tr:nth-child(25n) { page-break-after: always; }
        thead { display: table-header-group; }
      }
    `,
  });

  const handlePrintClick = () => {
    setIsDialogOpen(true);
  };

  const handleAdditionalItems = (items: AdditionalItem[]) => {
    setAdditionalItems(items);
    setIsDialogOpen(false);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  const handleClearHistory = () => {
    setPrintedTransactions([]);
    localStorage.removeItem('printedTransactions');
    setShowClearHistoryDialog(false);
  };

  const breadcrumbItems = [
    { label: 'Reports', href: '/reports' },
    { label: 'Job Orders' }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Orders</h1>
        
        <div className="flex gap-2">
          {printedTransactions.length > 0 && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowClearHistoryDialog(true)}
            >
              <RefreshCw className="h-4 w-4" />
              Clear Print History
            </Button>
          )}
          <Button
            variant="outline"
            className="gap-2"
            onClick={handlePrintClick}
            disabled={selectedRows.length === 0}
          >
            <Printer className="h-4 w-4" />
            Print Selected
          </Button>
        </div>
      </div>
      
      <JobOrdersTable 
        transactions={transactions}
        selectedRows={selectedRows}
        selectAll={selectAll}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        printedTransactions={printedTransactions}
      />
      
      <div className="hidden">
        <div ref={printRef}>
          <JobOrdersTable 
            transactions={transactions.filter(tx => selectedRows.includes(tx.id))}
            isPrintView={true}
            additionalItems={additionalItems}
          />
        </div>
      </div>

      <AdditionalItemsDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleAdditionalItems}
        transactionTotal={calculateTransactionTotal()}
      />

      <AlertDialog open={showClearHistoryDialog} onOpenChange={setShowClearHistoryDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Print History?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear the print history? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearHistory}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JobOrders;
