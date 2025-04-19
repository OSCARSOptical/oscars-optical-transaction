import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PatientTrends from "@/components/dashboard/PatientTrends";
import TransactionTrends from "@/components/dashboard/TransactionTrends";
const Dashboard = () => {
  return <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h2>
        <p className="text-muted-foreground">Your practice overview and key metrics</p>
      </div>

      <MetricsOverview />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <RevenueChart />
        </TabsContent>
        <TabsContent value="patients" className="space-y-4">
          <PatientTrends />
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4">
          <TransactionTrends />
        </TabsContent>
      </Tabs>
    </div>;
};
export default Dashboard;