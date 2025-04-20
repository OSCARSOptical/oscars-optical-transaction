
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { format, parse } from "date-fns";
import { DollarSign, Calendar } from "lucide-react";
import { Transaction } from "@/types";
import { DayCard } from "./DayCard";
import { MonthlySelector } from "./MonthlySelector";
import { MonthlySummary } from "./MonthlySummary";
import { getAllBalanceSheetEntries } from "@/utils/balanceSheetUtils";

// This would come from a shared data source in a real app
// Using the same transactions data from TransactionList
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    code: 'TX25-04-00001',
    date: '2025-04-10',
    patientCode: 'PX-JD-0000001',
    patientName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    type: 'Complete',
    grossAmount: 7500.00,
    deposit: 2500.00,
    balance: 5000.00,
    lensCapital: 1200.00,
    edgingPrice: 150.00,
    otherExpenses: 50.00,
    totalExpenses: 1400.00,
    claimed: true,
    dateClaimed: '2025-04-15'
  },
  {
    id: '2',
    code: 'TX25-04-00002',
    date: '2025-04-08',
    patientCode: 'PX-JS-0000001',
    patientName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    type: 'Eye Exam',
    grossAmount: 1205.00,
    deposit: 1205.00,
    balance: 0.00,
    lensCapital: 0.00,
    edgingPrice: 0.00,
    otherExpenses: 0.00,
    totalExpenses: 0.00,
    claimed: true,
    dateClaimed: '2025-04-08'
  },
  {
    id: '3',
    code: 'TX25-04-00003',
    date: '2025-04-11',
    patientCode: 'PX-OS-0000001',
    patientName: 'Oscar Santos',
    firstName: 'Oscar',
    lastName: 'Santos',
    type: 'Frame Replacement',
    grossAmount: 6800.00,
    deposit: 6800.00,
    balance: 0.00,
    lensCapital: 2800.00,
    edgingPrice: 200.00,
    otherExpenses: 100.00,
    totalExpenses: 3100.00,
    claimed: false,
    dateClaimed: null
  }
];

// Define an interface for grouped data to fix the type error
interface GroupedData {
  transactions: Transaction[];
  date: string;
}

// We no longer need separate expense data as it's now part of the transaction model
export function BalanceSheet() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Add event listener for balance sheet updates
  useEffect(() => {
    const handleBalanceSheetUpdate = () => {
      setRefreshTrigger(prev => prev + 1);
    };
    
    window.addEventListener('balanceSheetUpdated', handleBalanceSheetUpdate);
    
    return () => {
      window.removeEventListener('balanceSheetUpdated', handleBalanceSheetUpdate);
    };
  }, []);
  
  // Get current month and year
  const currentMonth = format(selectedMonth, 'MMMM');
  const currentYear = format(selectedMonth, 'yyyy');
  
  // Filter transactions for the selected month
  const filteredTransactions = sampleTransactions.filter(transaction => {
    const transactionDate = parse(transaction.date, 'yyyy-MM-dd', new Date());
    return (
      format(transactionDate, 'MM-yyyy') === format(selectedMonth, 'MM-yyyy')
    );
  });
  
  // Get balance sheet entries
  const balanceSheetEntries = getAllBalanceSheetEntries();
  
  // Group transactions by date and incorporate balance sheet entries
  const groupedData: Record<string, GroupedData> = filteredTransactions.reduce((acc, transaction) => {
    if (!acc[transaction.date]) {
      acc[transaction.date] = {
        transactions: [],
        date: transaction.date
      };
    }
    acc[transaction.date].transactions.push(transaction);
    return acc;
  }, {} as Record<string, GroupedData>);
  
  // Add balance sheet entries to the grouped data
  Object.entries(balanceSheetEntries).forEach(([date, entries]) => {
    const dateMonth = date.substring(0, 7); // YYYY-MM
    const selectedMonthStr = format(selectedMonth, 'yyyy-MM');
    
    if (dateMonth === selectedMonthStr) {
      if (!groupedData[date]) {
        groupedData[date] = {
          transactions: [],
          date: date
        };
      }
      
      // Add balance payment entries as "transactions" for display
      entries.forEach(entry => {
        if (entry.isBalancePayment) {
          groupedData[date].transactions.push({
            id: `balance-${entry.transactionId}-${Date.now()}`,
            code: entry.description,
            date: date,
            patientCode: "",
            patientName: "",
            firstName: "",
            lastName: "",
            type: "Balance Payment",
            grossAmount: entry.grossAmount,
            deposit: entry.deposit,
            balance: entry.balance,
            lensCapital: 0,
            edgingPrice: 0,
            otherExpenses: 0,
            totalExpenses: entry.expenses,
            claimed: true,
            dateClaimed: date,
            isBalancePayment: true
          });
        }
      });
    }
  });
  
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedData).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  // Calculate monthly totals including balance payments
  const allTransactions = Object.values(groupedData).flatMap(group => group.transactions);
  
  const monthlyTotals = {
    grossSales: allTransactions.reduce((sum, tx) => sum + tx.grossAmount, 0),
    deposits: allTransactions.reduce((sum, tx) => sum + tx.deposit, 0),
    expenses: allTransactions.reduce((sum, tx) => sum + tx.totalExpenses, 0),
    netIncome: allTransactions.reduce((sum, tx) => sum + tx.deposit - tx.totalExpenses, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">
            Balance Sheet
            <span className="ml-2 text-xl font-normal text-muted-foreground">
              {currentMonth} {currentYear}
            </span>
          </h2>
        </div>
        <MonthlySelector 
          selectedMonth={selectedMonth} 
          onMonthChange={setSelectedMonth} 
        />
      </div>
      
      <MonthlySummary totals={monthlyTotals} />
      
      {sortedDates.length > 0 ? (
        sortedDates.map((date) => (
          <DayCard
            key={`${date}-${refreshTrigger}`}
            date={date}
            transactions={groupedData[date].transactions}
          />
        ))
      ) : (
        <Card className="shadow-sm border border-gray-100">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Calendar className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">No Transactions</h3>
            <p className="text-muted-foreground text-center">
              There are no transactions recorded for {currentMonth} {currentYear}.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BalanceSheet;
