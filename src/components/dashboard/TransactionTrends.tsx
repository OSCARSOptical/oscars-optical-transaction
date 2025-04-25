
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";

const TransactionTrends = () => {
  // Create empty data for the chart
  const emptyData = [
    { name: 'Jan', revenue: 0 },
    { name: 'Feb', revenue: 0 },
    { name: 'Mar', revenue: 0 },
    { name: 'Apr', revenue: 0 },
    { name: 'May', revenue: 0 },
    { name: 'Jun', revenue: 0 },
    { name: 'Jul', revenue: 0 },
    { name: 'Aug', revenue: 0 },
    { name: 'Sep', revenue: 0 },
    { name: 'Oct', revenue: 0 },
    { name: 'Nov', revenue: 0 },
    { name: 'Dec', revenue: 0 }
  ];

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue for {new Date().getFullYear()}</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <BarChart
          data={emptyData}
          categories={["revenue"]}
          index="name"
          colors={["#9E0214"]}
          valueFormatter={(value: number) => `₱${value.toLocaleString()}`}
          yAxisWidth={60}
          height={350}
        />
      </CardContent>
    </Card>
  );
};

export default TransactionTrends;
