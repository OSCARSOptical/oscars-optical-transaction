
import { useState, useEffect } from 'react';
import BreadcrumbNav from '@/components/layout/Breadcrumb';
import { JobOrdersTable } from '@/components/reports/JobOrdersTable';
import { PrintHistory } from '@/components/reports/PrintHistory';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Transaction } from '@/types';

// Sample data structure for print history
export interface PrintHistoryEntry {
  id: string;
  datePrinted: string;
  transactions: Transaction[];
}

const JobOrders = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [printHistory, setPrintHistory] = useLocalStorage<PrintHistoryEntry[]>('print_history', []);

  // Breadcrumb items for navigation
  const breadcrumbItems = [
    { label: 'Reports', href: '/reports' },
    { label: 'Job Orders' }
  ];

  // Load transactions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch from localStorage for demo purposes
      const storedTransactions: Transaction[] = [];
      
      // Iterate through localStorage to find transaction items
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('transaction_')) {
          try {
            const id = key.split('_')[1];
            const code = localStorage.getItem(`transaction_${id}_code`);
            const date = localStorage.getItem(`transaction_${id}_date`);
            const patientName = localStorage.getItem(`transaction_${id}_patientName`);
            const patientCode = localStorage.getItem(`transaction_${id}_patientCode`);
            const type = localStorage.getItem(`transaction_${id}_type`);
            const refractiveIndex = localStorage.getItem(`transaction_${id}_refractiveIndex`);
            const lensType = localStorage.getItem(`transaction_${id}_lensType`);
            const lensCoating = localStorage.getItem(`transaction_${id}_lensCoating`);
            const lensCapital = localStorage.getItem(`transaction_${id}_lensCapital`);
            const edgingPrice = localStorage.getItem(`transaction_${id}_edgingPrice`);
            const otherExpenses = localStorage.getItem(`transaction_${id}_otherExpenses`);
            const orderNotes = localStorage.getItem(`transaction_${id}_orderNotes`);
            
            if (code && date && patientName) {
              storedTransactions.push({
                id,
                code: code || '',
                date: date || '',
                patientName: patientName || '',
                patientCode: patientCode || '',
                firstName: '', // These fields are not used in reports
                lastName: '',
                type: (type as any) || 'Complete',
                refractiveIndex: refractiveIndex as any,
                lensType: lensType as any,
                lensCoating: lensCoating as any,
                lensCapital: parseFloat(lensCapital || '0'),
                edgingPrice: parseFloat(edgingPrice || '0'),
                otherExpenses: parseFloat(otherExpenses || '0'),
                totalExpenses: 0, // Will calculate below
                grossAmount: 0, // Not used in reports
                deposit: 0,
                balance: 0,
                claimed: false,
                dateClaimed: null,
                orderNotes: orderNotes || ''
              });
            }
          } catch (error) {
            console.error('Error parsing transaction:', error);
          }
        }
      }
      
      // Calculate total expenses for each transaction
      const transactionsWithTotals = storedTransactions.map(t => ({
        ...t,
        totalExpenses: (t.lensCapital || 0) + (t.edgingPrice || 0) + (t.otherExpenses || 0)
      }));
      
      // Sort by date, newest first
      const sortedTransactions = transactionsWithTotals.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setTransactions(sortedTransactions);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(transactions.map(t => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  // Handle selection of individual transactions
  const handleSelectTransaction = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, id]);
    } else {
      setSelectedTransactions(selectedTransactions.filter(tId => tId !== id));
    }
  };

  // Handle Print Selected action
  const handlePrintSelected = () => {
    if (selectedTransactions.length === 0) return;
    
    // Filter transactions to only include selected ones
    const selectedTxs = transactions.filter(t => 
      selectedTransactions.includes(t.id)
    );
    
    // Create a new print history entry
    const newHistoryEntry: PrintHistoryEntry = {
      id: Date.now().toString(),
      datePrinted: new Date().toISOString(),
      transactions: selectedTxs
    };
    
    // Open print window
    window.print();
    
    // Add to print history
    setPrintHistory([newHistoryEntry, ...printHistory]);
    
    // Remove selected transactions from the main list
    setTransactions(transactions.filter(t => 
      !selectedTransactions.includes(t.id)
    ));
    
    // Clear selections
    setSelectedTransactions([]);
  };

  return (
    <div className="space-y-6">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight mb-1">Job Orders</h2>
        <Button 
          onClick={handlePrintSelected}
          disabled={selectedTransactions.length === 0}
          className="bg-[#9E0214] hover:bg-[#9E0214]/90"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Selected ({selectedTransactions.length})
        </Button>
      </div>
      
      <div className="print:block hidden">
        <style type="text/css" media="print">{`
          @page {
            size: landscape;
          }
          
          @media print {
            tr:nth-child(25n+26) {
              page-break-before: always;
            }
          }
        `}</style>
      </div>
      
      {/* Main table */}
      <div className="print:hidden">
        <JobOrdersTable 
          transactions={transactions}
          loading={loading}
          selectedTransactions={selectedTransactions}
          onSelectAll={handleSelectAll}
          onSelectTransaction={handleSelectTransaction}
        />
      </div>
      
      {/* Print-only table */}
      <div className="hidden print:block">
        <JobOrdersTable 
          transactions={transactions.filter(t => selectedTransactions.includes(t.id))}
          loading={false}
          printMode={true}
        />
      </div>
      
      {/* Print History */}
      {printHistory.length > 0 && (
        <div className="mt-10 print:hidden">
          <PrintHistory printHistory={printHistory} />
        </div>
      )}
    </div>
  );
};

export default JobOrders;
