
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";
import { parseISO, format, getMonth, isSameYear, addMonths, startOfMonth, endOfMonth, isAfter, isBefore } from 'date-fns';
import { getAllPayments } from "@/utils/paymentsUtils";

const TransactionTrends = () => {
  // Get current date and year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  // Get all payments from storage
  const allPayments = getAllPayments();
  
  // Create a map to store monthly revenue
  const monthlyRevenue = new Map();
  
  // Calculate revenue for each month from payments only
  allPayments.forEach(payment => {
    const paymentDate = parseISO(payment.paymentDate);
    if (isSameYear(paymentDate, currentDate)) {
      const month = getMonth(paymentDate);
      monthlyRevenue.set(month, (monthlyRevenue.get(month) || 0) + payment.amount);
    }
  });
  
  // Create chart data from the map
  const revenueData = Array.from(monthlyRevenue, ([month, revenue]) => ({
    name: format(new Date(currentYear, month, 1), 'MMM'),
    revenue: revenue
  })).sort((a, b) => {
    // Sort by month (Jan, Feb, Mar, etc.)
    const monthA = new Date(currentYear, "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(a.name) / 3, 1);
    const monthB = new Date(currentYear, "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(b.name) / 3, 1);
    return monthA.getTime() - monthB.getTime();
  });

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue for {currentYear}</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <BarChart
          data={revenueData}
          categories={["revenue"]}
          index="name"
          colors={["#9E0214"]} // Brand deep-red
          valueFormatter={(value: number) => `₱${value.toLocaleString()}`}
          yAxisWidth={60}
          height={350}
        />
      </CardContent>
    </Card>
  );
};

export default TransactionTrends;
