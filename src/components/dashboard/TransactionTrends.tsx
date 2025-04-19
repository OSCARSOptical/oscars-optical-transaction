
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";

const TransactionTrends = () => {
  const transactionTrendData = [
    { type: "Complete", count: 15 },
    { type: "Frame Replacement", count: 8 },
    { type: "Lens Replacement", count: 12 },
    { type: "Eye Exam", count: 10 },
  ];

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
          colors={["#8b5cf6"]}
          valueFormatter={(value: number) => `${value}`}
          yAxisWidth={48}
          height={350}
        />
      </CardContent>
    </Card>
  );
};

export default TransactionTrends;
