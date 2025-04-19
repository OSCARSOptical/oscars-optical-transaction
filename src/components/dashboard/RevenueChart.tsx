
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/ui/chart";

const RevenueChart = () => {
  const revenueData = [
    { name: "Jan", revenue: 9500 },
    { name: "Feb", revenue: 11200 },
    { name: "Mar", revenue: 10500 },
    { name: "Apr", revenue: 12500 },
    { name: "May", revenue: 11800 },
    { name: "Jun", revenue: 13500 },
  ];

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue for the current year</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <LineChart
          data={revenueData}
          categories={["revenue"]}
          index="name"
          colors={["#dc2626"]}
          valueFormatter={(value: number) => `₱${value}`}
          yAxisWidth={60}
          height={350}
        />
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
