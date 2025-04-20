
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { format, parse, isSameDay } from "date-fns";
import { DollarSign, Calendar } from "lucide-react";
import { Transaction } from "@/types";
import { DayCard } from "./DayCard";
import { MonthYearPicker } from "./MonthYearPicker";
import { MonthlySummary } from "./MonthlySummary";

// This would come from a shared data source in a real app
// Using the same transactions data from TransactionList with extended deposit info
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    code: 'TX25-04-00001',
    date: '2025-04-10', // orderDate
    patientCode: 'PX-JD-0000001',
    patientName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    type: 'Complete',
    grossAmount: 7500.00,
    deposit: 2500.00,
    depositDate: '2025-04-10', // Same-day deposit
    balance: 5000.00,
    lensCapital: 1200.00,
    edgingPrice: 150.00,
    otherExpenses: 50.00,
    totalExpenses: 1400.00,
    claimed: true,
    dateClaimed: '2025-04-15',
    sameDay: true // Computed
  },
  {
    id: '2',
    code: 'TX25-04-00002',
    date: '2025-04-08', // orderDate
    patientCode: 'PX-JS-0000001',
    patientName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    type: 'Eye Exam',
    grossAmount: 1205.00,
    deposit: 1205.00,
    depositDate: '2025-04-08', // Same-day deposit
    balance: 0.00,
    lensCapital: 0.00,
    edgingPrice: 0.00,
    otherExpenses: 0.00,
    totalExpenses: 0.00,
    claimed: true,
    dateClaimed: '2025-04-08',
    sameDay: true // Computed
  },
  {
    id: '3',
    code: 'TX25-04-00003',
    date: '2025-04-11', // orderDate
    patientCode: 'PX-OS-0000001',
    patientName: 'Oscar Santos',
    firstName: 'Oscar',
    lastName: 'Santos',
    type: 'Frame Replacement',
    grossAmount: 6800.00,
    deposit: 6800.00,
    depositDate: '2025-04-15', // Late deposit (not same day)
    balance: 0.00,
    lensCapital: 2800.00,
    edgingPrice: 200.00,
    otherExpenses: 100.00,
    totalExpenses: 3100.00,
    claimed: false,
    dateClaimed: null,
    sameDay: false // Computed
  },
  {
    id: '4',
    code: 'TX25-04-00004',
    date: '2025-04-15', // orderDate
    patientCode: 'PX-MC-0000001',
    patientName: 'Maria Cruz',
    firstName: 'Maria',
    lastName: 'Cruz',
    type: 'Complete',
    grossAmount: 9200.00,
    deposit: 4000.00,
    depositDate: '2025-04-25', // Late deposit (not same day)
    balance: 5200.00,
    lensCapital: 3000.00,
    edgingPrice: 300.00,
    otherExpenses: 200.00,
    totalExpenses: 3500.00,
    claimed: true,
    dateClaimed: '2025-05-03', // Claimed in May
    sameDay: false // Computed
  }
];

export function BalanceSheet() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  
  // Get current month and year
  const currentMonth = format(selectedMonth, 'MMMM');
  const currentYear = format(selectedMonth, 'yyyy');
  
  // Helper function to compute sameDay flag if not already set
  const computeSameDay = (transaction: Transaction): Transaction => {
    if (transaction.sameDay !== undefined) return transaction;
    
    const orderDate = parse(transaction.date, 'yyyy-MM-dd', new Date());
    const depositDate = parse(transaction.depositDate, 'yyyy-MM-dd', new Date());
    
    return {
      ...transaction,
      sameDay: isSameDay(orderDate, depositDate)
    };
  };
  
  // Process all transactions to ensure sameDay is computed
  const processedTransactions = sampleTransactions.map(computeSameDay);
  
  // Get all transactions with deposits made in the selected month
  // (regardless of when the order was placed)
  const filteredTransactions = processedTransactions.filter(transaction => {
    const depositDate = parse(transaction.depositDate, 'yyyy-MM-dd', new Date());
    return (
      format(depositDate, 'MM-yyyy') === format(selectedMonth, 'MM-yyyy')
    );
  });
  
  // Group transactions by deposit date
  const groupedData = filteredTransactions.reduce((acc, transaction) => {
    if (!acc[transaction.depositDate]) {
      acc[transaction.depositDate] = {
        transactions: [],
        date: transaction.depositDate
      };
    }
    acc[transaction.depositDate].transactions.push(transaction);
    return acc;
  }, {});
  
  // Sort dates in ascending order for the month
  const sortedDates = Object.keys(groupedData).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });
  
  // Calculate monthly totals
  const monthlyTotals = {
    grossSales: filteredTransactions.reduce((sum, tx) => sum + tx.grossAmount, 0),
    sameDayDeposits: filteredTransactions.filter(tx => tx.sameDay).reduce((sum, tx) => sum + tx.deposit, 0),
    lateCollections: filteredTransactions.filter(tx => !tx.sameDay).reduce((sum, tx) => sum + tx.deposit, 0),
    expenses: filteredTransactions.reduce((sum, tx) => sum + tx.totalExpenses, 0),
    netIncome: filteredTransactions.reduce((sum, tx) => sum + tx.deposit - tx.totalExpenses, 0)
  };

  // Calculate running balance for each day
  let runningBalance = 0;
  // In a real app, we would fetch the previous month's ending balance
  const previousMonthEndingBalance = 25000.00; // Example value
  runningBalance = previousMonthEndingBalance;
  
  const daysWithBalance = sortedDates.map(date => {
    const dayData = groupedData[date];
    
    const dayTransactions = dayData.transactions;
    const sameDayDeposits = dayTransactions.filter(tx => tx.sameDay).reduce((sum, tx) => sum + tx.deposit, 0);
    const lateCollections = dayTransactions.filter(tx => !tx.sameDay).reduce((sum, tx) => sum + tx.deposit, 0);
    const dayExpenses = dayTransactions.reduce((sum, tx) => sum + tx.totalExpenses, 0);
    const dayNetIncome = (sameDayDeposits + lateCollections) - dayExpenses;
    
    const startingBalance = runningBalance;
    runningBalance += dayNetIncome;
    
    return {
      ...dayData,
      sameDayDeposits,
      lateCollections,
      totalDeposits: sameDayDeposits + lateCollections,
      expenses: dayExpenses,
      dayNetIncome,
      startingBalance,
      endingBalance: runningBalance
    };
  });

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
        <MonthYearPicker 
          selectedMonth={selectedMonth} 
          onMonthChange={setSelectedMonth} 
        />
      </div>
      
      <MonthlySummary 
        totals={{
          grossSales: monthlyTotals.grossSales,
          sameDayDeposits: monthlyTotals.sameDayDeposits, 
          lateCollections: monthlyTotals.lateCollections,
          totalDeposits: monthlyTotals.sameDayDeposits + monthlyTotals.lateCollections,
          expenses: monthlyTotals.expenses,
          netIncome: monthlyTotals.netIncome
        }} 
      />
      
      {daysWithBalance.length > 0 ? (
        daysWithBalance.map((dayData, index) => (
          <DayCard
            key={dayData.date}
            date={dayData.date}
            transactions={dayData.transactions}
            sameDayDeposits={dayData.sameDayDeposits}
            lateCollections={dayData.lateCollections}
            expenses={dayData.expenses}
            netIncome={dayData.dayNetIncome}
            startingBalance={dayData.startingBalance}
            endingBalance={dayData.endingBalance}
          />
        ))
      ) : (
        <Card className="shadow-sm border border-gray-100 bg-[#FAF8F5] rounded-lg">
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
