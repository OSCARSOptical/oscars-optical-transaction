
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Transaction } from "@/types";

interface DayCardProps {
  date: string;
  transactions: Transaction[];
  sameDayDeposits: number;
  lateCollections: number;
  expenses: number;
  netIncome: number;
  startingBalance: number;
  endingBalance: number;
}

export function DayCard({ 
  date, 
  transactions, 
  sameDayDeposits, 
  lateCollections, 
  expenses, 
  netIncome,
  startingBalance,
  endingBalance
}: DayCardProps) {
  const navigate = useNavigate();
  
  // Parse and format the date
  const dateObj = parse(date, 'yyyy-MM-dd', new Date());
  const formattedDate = format(dateObj, 'MM/dd/yy, EEEE');
  
  // Calculate totals
  const totalGrossAmount = transactions.reduce((sum, tx) => sum + tx.grossAmount, 0);
  const totalDeposits = sameDayDeposits + lateCollections;
  const totalBalance = transactions.reduce((sum, tx) => sum + tx.balance, 0);
  
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
    <Card className="shadow-sm border border-gray-100 mb-6 bg-[#FAF8F5] rounded-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-2xl font-bold">{formattedDate}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 md:mt-0">
            <div className="flex flex-col p-2 bg-white rounded-md shadow-sm">
              <span className="text-xs text-muted-foreground">Gross</span>
              <span className="font-semibold">{formatCurrency(totalGrossAmount)}</span>
            </div>
            <div className="flex flex-col p-2 bg-white rounded-md shadow-sm">
              <span className="text-xs text-muted-foreground">Same-Day Deposits</span>
              <span className="font-semibold text-green-600">{formatCurrency(sameDayDeposits)}</span>
            </div>
            <div className="flex flex-col p-2 bg-white rounded-md shadow-sm">
              <span className="text-xs text-muted-foreground">Late Collections</span>
              <span className="font-semibold text-amber-600">{formatCurrency(lateCollections)}</span>
            </div>
            <div className="flex flex-col p-2 bg-white rounded-md shadow-sm">
              <span className="text-xs text-muted-foreground">Daily Net</span>
              <span className={`font-semibold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netIncome)}
              </span>
            </div>
          </div>
        </CardTitle>
        <div className="mt-2 text-sm text-muted-foreground">
          Start {formatCurrency(startingBalance)} → End {formatCurrency(endingBalance)}
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="rounded-md border overflow-x-auto">
          <div className="absolute right-0 top-0 bottom-0 w-10 pointer-events-none z-10"
               style={{ background: 'linear-gradient(to right, rgba(250,248,245,0), #FAF8F5 100%)' }}>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[240px]">Description</TableHead>
                <TableHead className="text-right">Gross Amount</TableHead>
                <TableHead className="text-right">Deposit</TableHead>
                <TableHead className="text-right">Type</TableHead>
                <TableHead className="text-right">Total Expenses</TableHead>
                <TableHead className="text-right">Net Income</TableHead>
                <TableHead className="text-right">Claimed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const netIncome = transaction.deposit - transaction.totalExpenses;
                
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <button 
                        className="text-[#9E0214] hover:underline cursor-pointer"
                        onClick={() => handleTransactionClick(transaction.code)}
                      >
                        {transaction.code}
                      </button>
                      <div className="text-xs text-muted-foreground">{transaction.patientName}</div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.grossAmount)}</TableCell>
                    <TableCell className="text-right">
                      <div className={transaction.sameDay ? 'text-green-600' : 'text-amber-600'}>
                        {formatCurrency(transaction.deposit)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {transaction.sameDay ? 'Same-Day' : 'Late Collection'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{transaction.type}</TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.totalExpenses)}</TableCell>
                    <TableCell className="text-right">
                      <span className={netIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(netIncome)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <input 
                        type="checkbox" 
                        checked={transaction.claimed} 
                        className="form-checkbox h-4 w-4 text-green-600 rounded"
                        onChange={() => {
                          // In a real app, this would update the database
                          console.log(`Toggle claimed: ${transaction.code}`);
                        }}
                      />
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
          <div className="text-right"></div>
          <div className="text-right">{formatCurrency(expenses)}</div>
          <div className="text-right">
            <span className={netIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
              {formatCurrency(netIncome)}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
