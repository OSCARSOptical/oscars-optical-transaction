
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, CreditCard, CheckCircle } from "lucide-react";

interface MonthlySummaryProps {
  totals: {
    grossSales: number;
    deposits: number;
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
      <CardContent className="p-4 h-24">
        <div className="grid grid-cols-3 gap-6">
          <div className="flex items-center">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <ShoppingBag className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Gross Sales</p>
              <h3 className="text-xl font-bold">{formatCurrency(totals.grossSales)}</h3>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <CreditCard className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Expenses</p>
              <h3 className="text-xl font-bold">{formatCurrency(totals.expenses)}</h3>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Net Sales</p>
              <h3 className={`text-xl font-bold ${totals.netIncome >= 0 ? 'text-[#009B29]' : 'text-[#9E0214]'}`}>
                {formatCurrency(totals.netIncome)}
              </h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
