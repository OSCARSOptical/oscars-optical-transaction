
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface MonthlySummaryProps {
  totals: {
    grossSales: number;
    sameDayDeposits: number;
    lateCollections: number;
    totalDeposits: number;
    expenses: number;
    netIncome: number;
  };
}

export function MonthlySummary({ totals }: MonthlySummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      currencyDisplay: 'symbol',
    }).format(amount).replace('PHP', '₱');
  };

  return (
    <Card className="sticky top-0 z-10 shadow-sm border border-gray-100 bg-white">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="flex items-center p-2 rounded-lg bg-gray-50">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">MTD Gross</p>
              <h3 className="text-lg font-bold">{formatCurrency(totals.grossSales)}</h3>
            </div>
          </div>
          
          <div className="flex items-center p-2 rounded-lg bg-gray-50">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Same-Day Deposits</p>
              <h3 className="text-lg font-bold">{formatCurrency(totals.sameDayDeposits)}</h3>
            </div>
          </div>
          
          <div className="flex items-center p-2 rounded-lg bg-gray-50">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Late Collections</p>
              <h3 className="text-lg font-bold">{formatCurrency(totals.lateCollections)}</h3>
            </div>
          </div>
          
          <div className="flex items-center p-2 rounded-lg bg-gray-50">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">MTD Deposits</p>
              <h3 className="text-lg font-bold">{formatCurrency(totals.totalDeposits)}</h3>
            </div>
          </div>
          
          <div className="flex items-center p-2 rounded-lg bg-gray-50">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <DollarSign className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">MTD Expenses</p>
              <h3 className="text-lg font-bold">{formatCurrency(totals.expenses)}</h3>
            </div>
          </div>
          
          <div className="flex items-center p-2 rounded-lg bg-gray-50">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">MTD Net</p>
              <h3 className={`text-lg font-bold ${totals.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totals.netIncome)}
              </h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
