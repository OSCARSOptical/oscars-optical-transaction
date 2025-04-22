import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";
import { Transaction } from "@/types";
import { parseISO, format, getMonth, isSameYear } from 'date-fns';
import { sampleTransactions } from '@/data';

const TransactionTrends = () => {
  // Get current year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  // Create a map of months to transaction counts
  const monthsWithData = new Map();
  
  // Group transactions by month
  sampleTransactions.forEach(tx => {
    const txDate = parseISO(tx.date);
    
    if (isSameYear(txDate, currentDate)) {
      const month = getMonth(txDate);
      monthsWithData.set(month, (monthsWithData.get(month) || 0) + 1);
    }
  });
  
  // Create chart data from the map (only including months with data)
  const transactionData = Array.from(monthsWithData, ([month, count]) => ({
    name: format(new Date(currentYear, month, 1), 'MMM'),
    count: count
  })).sort((a, b) => {
    // Sort by month (Jan, Feb, Mar, etc.)
    const monthA = new Date(currentYear, "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(a.name) / 3, 1);
    const monthB = new Date(currentYear, "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(b.name) / 3, 1);
    return monthA.getTime() - monthB.getTime();
  });

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle>Transaction Distribution</CardTitle>
        <CardDescription>Number of transactions by month ({currentYear})</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <BarChart
          data={transactionData}
          categories={["count"]}
          index="name"
          colors={["#9E0214"]} // Brand deep-red
          valueFormatter={(value: number) => `${value}`}
          yAxisWidth={48}
          height={350}
        />
      </CardContent>
    </Card>
  );
};

export default TransactionTrends;
