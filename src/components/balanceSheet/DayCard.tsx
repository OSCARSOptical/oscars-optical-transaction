
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Transaction } from "@/types";

interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: 'lens capital' | 'edging price' | 'other';
}

interface DayCardProps {
  date: string;
  transactions: Transaction[];
  expenses: Expense[];
  startingBalance: number;
  endingBalance: number;
}

export function DayCard({ date, transactions, expenses, startingBalance, endingBalance }: DayCardProps) {
  const navigate = useNavigate();
  
  // Parse and format the date
  const dateObj = parse(date, 'yyyy-MM-dd', new Date());
  const formattedDate = format(dateObj, 'EEEE, MMMM d, yyyy');
  
  // Calculate totals
  const totalGrossAmount = transactions.reduce((sum, tx) => sum + tx.grossAmount, 0);
  const totalDeposits = transactions.reduce((sum, tx) => sum + tx.deposit, 0);
  const totalBalance = transactions.reduce((sum, tx) => sum + tx.balance, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const dailyNetIncome = totalDeposits - totalExpenses;
  
  // Handle transaction code click
  const handleTransactionClick = (transactionCode: string) => {
    navigate(`/transactions/${transactionCode}`);
  };
  
  return (
    <Card className="shadow-sm border border-gray-100 mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-2xl font-bold">{formattedDate}</div>
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-1 md:space-y-0 text-sm mt-2 md:mt-0">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Gross Amount</span>
              <span className="font-semibold">${totalGrossAmount.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Deposits Received</span>
              <span className="font-semibold">${totalDeposits.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Total Expenses</span>
              <span className="font-semibold">${totalExpenses.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Daily Net Income</span>
              <span className={`font-semibold ${dailyNetIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${dailyNetIncome.toFixed(2)}
              </span>
            </div>
          </div>
        </CardTitle>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Starting Balance</span>
            <span className="font-semibold">${startingBalance.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Ending Balance</span>
            <span className="font-semibold">${endingBalance.toFixed(2)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[240px]">Description</TableHead>
                <TableHead className="text-right">Gross Amount</TableHead>
                <TableHead className="text-right">Deposit</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Total Expenses</TableHead>
                <TableHead className="text-right">Daily Net Income</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                // For each transaction, find related expenses
                const transactionExpenses = expenses.filter(expense => 
                  expense.date === transaction.date
                );
                
                const expenseTotal = transactionExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                const netIncome = transaction.deposit - expenseTotal;
                
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <button 
                        className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80"
                        onClick={() => handleTransactionClick(transaction.code)}
                      >
                        {transaction.code}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">${transaction.grossAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${transaction.deposit.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${transaction.balance.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${expenseTotal.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className={netIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ${netIncome.toFixed(2)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {expenses.map(expense => {
                // Only show expenses not already attributed to transactions
                const isTransactionExpense = transactions.some(tx => tx.date === expense.date);
                if (!isTransactionExpense) {
                  return (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-red-600">
                          -${expense.amount.toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                }
                return null;
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="w-full grid grid-cols-6 text-sm font-medium">
          <div>Total</div>
          <div className="text-right">${totalGrossAmount.toFixed(2)}</div>
          <div className="text-right">${totalDeposits.toFixed(2)}</div>
          <div className="text-right">${totalBalance.toFixed(2)}</div>
          <div className="text-right">${totalExpenses.toFixed(2)}</div>
          <div className="text-right">
            <span className={dailyNetIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
              ${dailyNetIncome.toFixed(2)}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
