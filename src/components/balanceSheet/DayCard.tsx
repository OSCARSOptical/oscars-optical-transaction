
import { format, parse } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Transaction } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface DayCardProps {
  date: string;
  transactions: Transaction[];
}

export function DayCard({ date, transactions }: DayCardProps) {
  const navigate = useNavigate();
  const dateObj = parse(date, 'yyyy-MM-dd', new Date());
  const formattedDate = format(dateObj, "MMMM d, yyyy");
  const dayName = format(dateObj, "EEEE");
  
  const totalGrossAmount = transactions.reduce((sum, tx) => sum + tx.grossAmount, 0);
  const totalDeposits = transactions.reduce((sum, tx) => sum + tx.deposit, 0);
  const totalExpenses = transactions.reduce((sum, tx) => sum + tx.totalExpenses, 0);
  const dailyNetIncome = totalDeposits - totalExpenses;
  
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
        <div className="flex flex-col space-y-1.5">
          <h3 className="text-lg">
            <span className="font-bold">{formattedDate}</span>
            <span className="text-muted-foreground ml-2 font-normal">{dayName}</span>
          </h3>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[220px]">Description</TableHead>
                <TableHead className="w-[120px] text-right">Gross Amount</TableHead>
                <TableHead className="w-[120px] text-right">Deposit</TableHead>
                <TableHead className="w-[120px] text-right">Balance</TableHead>
                <TableHead className="w-[120px] text-right">Expenses</TableHead>
                <TableHead className="w-[120px] text-right">Net Income</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const netIncome = transaction.deposit - transaction.totalExpenses;
                
                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="min-w-[220px] truncate">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80 text-left"
                            onClick={() => navigate(`/transactions/${transaction.code}`)}
                          >
                            {transaction.code}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{transaction.code}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.grossAmount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.deposit)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.balance)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.totalExpenses)}</TableCell>
                    <TableCell className="text-right">
                      <span className={netIncome >= 0 ? 'text-[#009B29]' : 'text-[#9E0214]'}>
                        {formatCurrency(netIncome)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="border-t border-gray-200 font-medium">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{formatCurrency(totalGrossAmount)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalDeposits)}</TableCell>
                <TableCell className="text-right">{formatCurrency(transactions.reduce((sum, tx) => sum + tx.balance, 0))}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalExpenses)}</TableCell>
                <TableCell className="text-right">
                  <span className={dailyNetIncome >= 0 ? 'text-[#009B29]' : 'text-[#9E0214]'}>
                    {formatCurrency(dailyNetIncome)}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
