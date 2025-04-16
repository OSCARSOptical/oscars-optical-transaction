
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { BarChart4, DollarSign, TrendingUp } from "lucide-react";

export function BalanceSheet() {
  // Sample data
  const revenueData = [
    {
      name: "Jan",
      revenue: 1500,
      expenses: 900,
    },
    {
      name: "Feb",
      revenue: 1700,
      expenses: 950,
    },
    {
      name: "Mar",
      revenue: 2100,
      expenses: 1050,
    },
    {
      name: "Apr",
      revenue: 1900,
      expenses: 1000,
    },
    {
      name: "May",
      revenue: 2300,
      expenses: 1100,
    },
    {
      name: "Jun",
      revenue: 2400,
      expenses: 1200,
    },
  ];

  const expenseCategories = [
    { name: "Staff", value: 45 },
    { name: "Supplies", value: 25 },
    { name: "Rent", value: 15 },
    { name: "Equipment", value: 10 },
    { name: "Other", value: 5 },
  ];

  const patientPayments = [
    {
      name: "Jan",
      amount: 1200,
    },
    {
      name: "Feb",
      amount: 1350,
    },
    {
      name: "Mar",
      amount: 1700,
    },
    {
      name: "Apr",
      amount: 1550,
    },
    {
      name: "May",
      amount: 1800,
    },
    {
      name: "Jun",
      amount: 1950,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$13,900.00</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from last period
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$6,200.00</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+8%</span> from last period
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Net Profit
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$7,700.00</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="payments">Patient Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card className="shadow-sm border border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold flex items-center">
                <BarChart4 className="mr-2 h-5 w-5 text-crimson-600" />
                Revenue vs Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <BarChart
                data={revenueData}
                categories={["revenue", "expenses"]}
                index="name"
                colors={["#10b981", "#f43f5e"]}
                valueFormatter={(value: number) => `$${value}`}
                yAxisWidth={48}
                height={350}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses" className="space-y-4">
          <Card className="shadow-sm border border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={expenseCategories}
                category="value"
                index="name"
                valueFormatter={(value: number) => `${value}%`}
                colors={["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899"]}
                className="h-80"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="space-y-4">
          <Card className="shadow-sm border border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">
                Patient Payment Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <LineChart
                data={patientPayments}
                categories={["amount"]}
                index="name"
                colors={["#3b82f6"]}
                valueFormatter={(value: number) => `$${value}`}
                yAxisWidth={48}
                height={350}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default BalanceSheet;
