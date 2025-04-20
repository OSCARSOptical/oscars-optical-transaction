
import { format, parse } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Transaction } from "@/types";
import { TransactionsTable } from "./TransactionsTable";

interface DayCardProps {
  date: string;
  transactions: Transaction[];
}

export function DayCard({ date, transactions }: DayCardProps) {
  const dateObj = parse(date, 'yyyy-MM-dd', new Date());
  const formattedDate = format(dateObj, "MMMM d, yyyy");
  const dayName = format(dateObj, "EEEE");
  
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
            <span className="text-muted-foreground ml-2 font-normal">| {dayName}</span>
          </h3>
        </div>
      </CardHeader>
      <CardContent>
        <TransactionsTable 
          transactions={transactions}
          formatCurrency={formatCurrency}
        />
      </CardContent>
    </Card>
  );
}
