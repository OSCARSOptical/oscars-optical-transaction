
import { useState, useEffect, useRef } from 'react';
import BreadcrumbNav from '@/components/layout/Breadcrumb';
import JobOrdersTable from '@/components/reports/JobOrdersTable';
import AdditionalItemsDialog, { AdditionalItem } from '@/components/reports/AdditionalItemsDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import JobOrdersSelection from "@/components/reports/JobOrdersSelection";
import JobOrdersActionsBar from "@/components/reports/JobOrdersActionsBar";
import { useJobOrdersPrint } from "@/components/reports/useJobOrdersPrint";

const JobOrders = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [additionalItems, setAdditionalItems] = useState<AdditionalItem[]>([]);
  const [printedTransactions, setPrintedTransactions] = useState<string[]>([]);
  const printRef = useRef<HTMLDivElement>(null);
  const [showClearHistoryDialog, setShowClearHistoryDialog] = useState(false);

  useEffect(() => {
    const savedPrintedTx = localStorage.getItem('printedTransactions');
    if (savedPrintedTx) {
      setPrintedTransactions(JSON.parse(savedPrintedTx));
    }
  }, []);

  const handleSelectionChange = (rows: string[], all: boolean) => {
    setSelectedRows(rows);
    setSelectAll(all);
  };

  const calculateTransactionTotal = () => {
    return 0; // This will be updated when we integrate with real data
  };

  const handlePrint = useJobOrdersPrint({
    printRef,
    printedTransactions,
    setPrintedTransactions,
    selectedRows,
    setAdditionalItems
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
        <JobOrdersActionsBar
          printDisabled={selectedRows.length === 0}
          onPrintClick={handlePrintClick}
          onClearHistoryClick={() => setShowClearHistoryDialog(true)}
          printedTransactionsCount={printedTransactions.length}
        />
      </div>

      <JobOrdersTable
        transactions={[]} // Empty array since we no longer use sample data
        selectedRows={selectedRows}
        selectAll={selectAll}
        onSelectAll={() => {
          setSelectedRows([]);
          setSelectAll(false);
        }}
        onSelectRow={(id) => {
          setSelectedRows(prevRows => {
            const nextRows = prevRows.filter(rowId => rowId !== id);
            setSelectAll(false);
            return nextRows;
          });
        }}
        printedTransactions={printedTransactions}
      />

      <JobOrdersSelection
        transactions={[]} // Empty array since we no longer use sample data
        onSelectionChange={handleSelectionChange}
        initialSelectedRows={selectedRows}
        initialSelectAll={selectAll}
      />

      <div className="hidden">
        <div ref={printRef}>
          <JobOrdersTable
            transactions={[]} // Empty array since we no longer use sample data
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
