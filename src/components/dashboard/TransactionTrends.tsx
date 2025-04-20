
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";
import { Transaction } from "@/types";

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

const TransactionTrends = () => {
  // Process the transactions to get counts by type
  const transactionsByType = sampleTransactions.reduce((acc, tx) => {
    acc[tx.type] = (acc[tx.type] || 0) + 1;
    return acc;
  }, {});
  
  const transactionTrendData = Object.keys(transactionsByType).map(type => ({
    type,
    count: transactionsByType[type]
  }));

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle>Transaction Distribution</CardTitle>
        <CardDescription>Number of transactions by type this month</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <BarChart
          data={transactionTrendData}
          categories={["count"]}
          index="type"
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
