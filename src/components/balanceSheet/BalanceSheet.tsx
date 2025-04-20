
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { format, parse } from "date-fns";
import { DollarSign, Calendar } from "lucide-react";
import { Transaction } from "@/types";
import { DayCard } from "./DayCard";
import { MonthlySelector } from "./MonthlySelector";
import { MonthlySummary } from "./MonthlySummary";

// This would come from a shared data source in a real app
// Using the same transactions data from TransactionList
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    code: 'TX25-04-0001',
    date: '2025-04-10',
    patientCode: 'PX-JD-12345',
    patientName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    type: 'Eye Exam',
    grossAmount: 150.00,
    deposit: 50.00,
    balance: 100.00
  },
  {
    id: '2',
    code: 'TX25-04-0002',
    date: '2025-04-08',
    patientCode: 'PX-JS-67890',
    patientName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    type: 'Frame Replacement',
    grossAmount: 300.00,
    deposit: 150.00,
    balance: 150.00
  },
  {
    id: '3',
    code: 'TX25-04-0003',
    date: '2025-04-10',
    patientCode: 'PX-RJ-54321',
    patientName: 'Robert Johnson',
    firstName: 'Robert',
    lastName: 'Johnson',
    type: 'Complete',
    grossAmount: 450.00,
    deposit: 200.00,
    balance: 250.00
  },
  {
    id: '4',
    code: 'TX25-04-0004',
    date: '2025-04-15',
    patientCode: 'PX-MP-98765',
    patientName: 'Mary Parker',
    firstName: 'Mary',
    lastName: 'Parker',
    type: 'Lens Replacement',
    grossAmount: 180.00,
    deposit: 90.00,
    balance: 90.00
  }
];

// Sample expenses data
const sampleExpenses = [
  { id: '1', date: '2025-04-08', description: 'Lens Purchase', amount: 75.00, category: 'lens capital' },
  { id: '2', date: '2025-04-08', description: 'Edging Service', amount: 25.00, category: 'edging price' },
  { id: '3', date: '2025-04-10', description: 'Utilities', amount: 30.00, category: 'other' },
  { id: '4', date: '2025-04-10', description: 'Frame Inventory', amount: 100.00, category: 'other' },
  { id: '5', date: '2025-04-15', description: 'Lens Purchase', amount: 50.00, category: 'lens capital' },
];

export function BalanceSheet() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  
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
  
  // Filter expenses for the selected month
  const filteredExpenses = sampleExpenses.filter(expense => {
    const expenseDate = parse(expense.date, 'yyyy-MM-dd', new Date());
    return (
      format(expenseDate, 'MM-yyyy') === format(selectedMonth, 'MM-yyyy')
    );
  });
  
  // Group transactions and expenses by date
  const groupedData = filteredTransactions.reduce((acc, transaction) => {
    if (!acc[transaction.date]) {
      acc[transaction.date] = {
        transactions: [],
        expenses: [],
        date: transaction.date
      };
    }
    acc[transaction.date].transactions.push(transaction);
    return acc;
  }, {});
  
  // Add expenses to grouped data
  filteredExpenses.forEach(expense => {
    if (!groupedData[expense.date]) {
      groupedData[expense.date] = {
        transactions: [],
        expenses: [],
        date: expense.date
      };
    }
    groupedData[expense.date].expenses.push(expense);
  });
  
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedData).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  // Calculate monthly totals
  const monthlyTotals = {
    grossSales: filteredTransactions.reduce((sum, tx) => sum + tx.grossAmount, 0),
    deposits: filteredTransactions.reduce((sum, tx) => sum + tx.deposit, 0),
    expenses: filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    netIncome: filteredTransactions.reduce((sum, tx) => sum + tx.deposit, 0) - 
               filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  };

  // Calculate running balance for each day
  let runningBalance = 0;
  const daysWithBalance = [...sortedDates].reverse().map(date => {
    const dayData = groupedData[date];
    
    const dayDeposits = dayData.transactions.reduce((sum, tx) => sum + tx.deposit, 0);
    const dayExpenses = dayData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const dayNetIncome = dayDeposits - dayExpenses;
    
    const startingBalance = runningBalance;
    runningBalance += dayNetIncome;
    
    return {
      ...dayData,
      startingBalance,
      endingBalance: runningBalance
    };
  }).reverse();

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
      
      {daysWithBalance.length > 0 ? (
        daysWithBalance.map((dayData, index) => (
          <DayCard
            key={dayData.date}
            date={dayData.date}
            transactions={dayData.transactions}
            expenses={dayData.expenses}
            startingBalance={dayData.startingBalance}
            endingBalance={dayData.endingBalance}
          />
        ))
      ) : (
        <Card className="shadow-sm border border-gray-100">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Calendar className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">No Transactions</h3>
            <p className="text-muted-foreground text-center">
              There are no transactions or expenses recorded for {currentMonth} {currentYear}.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BalanceSheet;
