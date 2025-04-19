import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, PhilippinePeso } from "lucide-react";
import { BarChart, LineChart } from "@/components/ui/chart";

const Dashboard = () => {
  // Sample metrics data with Appointments removed and Total Transactions added
  const metrics = [
    {
      title: "Total Patients",
      value: "156",
      description: "+5 this month",
      icon: Users,
      iconColor: "text-blue-500",
    },
    {
      title: "Monthly Revenue",
      value: "₱12,563",
      description: "+8% from last month",
      icon: PhilippinePeso,
      iconColor: "text-green-500",
    },
    {
      title: "Pending Payments",
      value: "₱3,890",
      description: "10 patients",
      icon: PhilippinePeso,
      iconColor: "text-yellow-500",
    },
    {
      title: "Total Transactions This Month",
      value: "45",
      description: "Current month",
      icon: PhilippinePeso,
      iconColor: "text-purple-500",
    },
  ];

  // Sample chart data
  const revenueData = [
    {
      name: "Jan",
      revenue: 9500,
    },
    {
      name: "Feb",
      revenue: 11200,
    },
    {
      name: "Mar",
      revenue: 10500,
    },
    {
      name: "Apr",
      revenue: 12500,
    },
    {
      name: "May",
      revenue: 11800,
    },
    {
      name: "Jun",
      revenue: 13500,
    },
  ];

  const patientData = [
    {
      name: "Jan",
      patients: 130,
      newPatients: 20,
    },
    {
      name: "Feb",
      patients: 135,
      newPatients: 15,
    },
    {
      name: "Mar",
      patients: 142,
      newPatients: 12,
    },
    {
      name: "Apr",
      patients: 148,
      newPatients: 18,
    },
    {
      name: "May",
      patients: 152,
      newPatients: 11,
    },
    {
      name: "Jun",
      patients: 156,
      newPatients: 9,
    },
  ];

  // New transaction trend data
  const transactionTrendData = [
    {
      type: "Complete",
      count: 15,
    },
    {
      type: "Frame Replacement",
      count: 8,
    },
    {
      type: "Lens Replacement",
      count: 12,
    },
    {
      type: "Eye Exam",
      count: 10,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h2>
        <p className="text-muted-foreground">Your practice overview and key metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="shadow-sm border border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="transactions">Transaction Trend</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card className="shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Monthly revenue for the current year
              </CardDescription>
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
        </TabsContent>
        <TabsContent value="patients" className="space-y-4">
          <Card className="shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle>Patient Trends</CardTitle>
              <CardDescription>
                Total patients and new patient acquisitions
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <BarChart
                data={patientData}
                categories={["patients", "newPatients"]}
                index="name"
                colors={["#dc2626", "#0ea5e9"]}
                valueFormatter={(value: number) => `${value}`}
                yAxisWidth={48}
                height={350}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4">
          <Card className="shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle>Transaction Distribution</CardTitle>
              <CardDescription>
                Number of transactions by type this month
              </CardDescription>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
