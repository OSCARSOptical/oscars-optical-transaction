
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Transaction } from "@/types";

interface DayCardProps {
  date: string;
  transactions: Transaction[];
  startingBalance: number;
  endingBalance: number;
}

export function DayCard({ date, transactions, startingBalance, endingBalance }: DayCardProps) {
  const navigate = useNavigate();
  
  // Parse and format the date
  const dateObj = parse(date, 'yyyy-MM-dd', new Date());
  const formattedDate = format(dateObj, 'EEEE, MMMM d, yyyy');
  
  // Calculate totals
  const totalGrossAmount = transactions.reduce((sum, tx) => sum + tx.grossAmount, 0);
  const totalDeposits = transactions.reduce((sum, tx) => sum + tx.deposit, 0);
  const totalBalance = transactions.reduce((sum, tx) => sum + tx.balance, 0);
  const totalExpenses = transactions.reduce((sum, tx) => sum + tx.totalExpenses, 0);
  const dailyNetIncome = totalDeposits - totalExpenses;
  
  // Handle transaction code click
  const handleTransactionClick = (transactionCode: string) => {
    navigate(`/transactions/${transactionCode}`);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      currencyDisplay: 'symbol',
    }).format(amount).replace('PHP', '₱');
  };
  
  return (
    <Card className="shadow-sm border border-gray-100 mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-2xl font-bold">{formattedDate}</div>
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-1 md:space-y-0 text-sm mt-2 md:mt-0">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Gross Amount</span>
              <span className="font-semibold">{formatCurrency(totalGrossAmount)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Deposits Received</span>
              <span className="font-semibold">{formatCurrency(totalDeposits)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Total Expenses</span>
              <span className="font-semibold">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Daily Net Income</span>
              <span className={`font-semibold ${dailyNetIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(dailyNetIncome)}
              </span>
            </div>
          </div>
        </CardTitle>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Starting Balance</span>
            <span className="font-semibold">{formatCurrency(startingBalance)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Ending Balance</span>
            <span className="font-semibold">{formatCurrency(endingBalance)}</span>
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
                const netIncome = transaction.deposit - transaction.totalExpenses;
                
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
                    <TableCell className="text-right">{formatCurrency(transaction.grossAmount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.deposit)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.balance)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.totalExpenses)}</TableCell>
                    <TableCell className="text-right">
                      <span className={netIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(netIncome)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="w-full grid grid-cols-6 text-sm font-medium">
          <div>Total</div>
          <div className="text-right">{formatCurrency(totalGrossAmount)}</div>
          <div className="text-right">{formatCurrency(totalDeposits)}</div>
          <div className="text-right">{formatCurrency(totalBalance)}</div>
          <div className="text-right">{formatCurrency(totalExpenses)}</div>
          <div className="text-right">
            <span className={dailyNetIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
              {formatCurrency(dailyNetIncome)}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
