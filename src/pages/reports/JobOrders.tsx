import { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { sampleTransactions } from '@/data/sampleData';
import { Transaction } from '@/types';
import BreadcrumbNav from '@/components/layout/Breadcrumb';
import JobOrdersTable from '@/components/reports/JobOrdersTable';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

const JobOrders = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sort transactions by date (newest first)
    const sortedTransactions = [...sampleTransactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setTransactions(sortedTransactions);
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

  const handlePrint = useReactToPrint({
    documentTitle: "Job Orders Report",
    onBeforePrint: () => {
      console.log("Preparing to print...");
      return Promise.resolve();
    },
    onAfterPrint: () => {
      console.log("Print completed or canceled");
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

  const breadcrumbItems = [
    { label: 'Reports', href: '/reports' },
    { label: 'Job Orders' }
  ];

  const handlePrintClick = () => {
    handlePrint();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Orders</h1>
        
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
      
      <JobOrdersTable 
        transactions={transactions}
        selectedRows={selectedRows}
        selectAll={selectAll}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
      />
      
      <div className="hidden">
        <div ref={printRef}>
          <JobOrdersTable 
            transactions={transactions.filter(tx => selectedRows.includes(tx.id))}
            isPrintView={true}
          />
        </div>
      </div>
    </div>
  );
};

export default JobOrders;
