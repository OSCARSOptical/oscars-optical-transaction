
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/ui/chart";
import { Transaction } from "@/types";
import { parseISO, format, getMonth, isSameYear, addMonths, startOfMonth, endOfMonth, isAfter, isBefore } from 'date-fns';
import { getAllPayments } from "@/utils/paymentsUtils";

// Import the shared transactions data
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    code: 'TX25-04-00001',
    date: '2025-04-10',
    patientCode: 'PX-JD-0000001',
    patientName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    type: 'Complete',
    grossAmount: 7500.00,
    deposit: 2500.00,
    balance: 5000.00,
    lensCapital: 1200.00,
    edgingPrice: 150.00,
    otherExpenses: 50.00,
    totalExpenses: 1400.00,
    claimed: true,
    dateClaimed: '2025-04-15'
  },
  {
    id: '2',
    code: 'TX25-04-00002',
    date: '2025-04-08',
    patientCode: 'PX-JS-0000001',
    patientName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    type: 'Eye Exam',
    grossAmount: 1205.00,
    deposit: 1205.00,
    balance: 0.00,
    lensCapital: 0.00,
    edgingPrice: 0.00,
    otherExpenses: 0.00,
    totalExpenses: 0.00,
    claimed: true,
    dateClaimed: '2025-04-08'
  },
  {
    id: '3',
    code: 'TX25-04-00003',
    date: '2025-04-11',
    patientCode: 'PX-OS-0000001',
    patientName: 'Oscar Santos',
    firstName: 'Oscar',
    lastName: 'Santos',
    type: 'Frame Replacement',
    grossAmount: 6800.00,
    deposit: 6800.00,
    balance: 0.00,
    lensCapital: 2800.00,
    edgingPrice: 200.00,
    otherExpenses: 100.00,
    totalExpenses: 3100.00,
    claimed: false,
    dateClaimed: null
  }
];

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
