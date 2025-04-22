import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/ui/chart";
import { Transaction } from "@/types";
import { parseISO, format, getMonth, isSameYear, addMonths, startOfMonth, endOfMonth, isAfter, isBefore } from 'date-fns';
import { getAllPayments } from "@/utils/paymentsUtils";
import { sampleTransactions } from '@/data';

const RevenueChart = () => {
  // Get current date and year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  // Get all payments
  const allPayments = getAllPayments();
  
  // Create a map to store monthly revenue
  const monthlyRevenue = new Map();
  
  // Calculate revenue for each month (including current month)
  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(currentYear, i, 1);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    
    // Calculate deposits for this month
    const depositsForMonth = sampleTransactions
      .filter(tx => {
        const txDate = parseISO(tx.date);
        return isAfter(txDate, monthStart) && isBefore(txDate, monthEnd);
      })
      .reduce((sum, tx) => sum + tx.deposit, 0);
    
    // Calculate balance payments for this month
    const balancePaymentsForMonth = allPayments
      .filter(payment => {
        const paymentDate = parseISO(payment.paymentDate);
        return isAfter(paymentDate, monthStart) && isBefore(paymentDate, monthEnd);
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    // Total revenue for this month
    const totalRevenueForMonth = depositsForMonth + balancePaymentsForMonth;
    
    // Only add months that have data
    if (totalRevenueForMonth > 0) {
      monthlyRevenue.set(i, totalRevenueForMonth);
    } else if (i <= currentDate.getMonth()) {
      // For past months with zero revenue, still show them
      monthlyRevenue.set(i, 0);
    }
  }
  
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
        <LineChart
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

export default RevenueChart;
