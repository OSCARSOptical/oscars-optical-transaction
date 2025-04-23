
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PatientTrends from "@/components/dashboard/PatientTrends";
import TransactionTrends from "@/components/dashboard/TransactionTrends";
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { samplePatients } from "@/data";

const Dashboard = () => {
  const currentDateTime = new Date();
  const formattedDate = format(currentDateTime, 'MMMM d, yyyy');
  const formattedTime = format(currentDateTime, 'h:mm a');
  const navigate = useNavigate();

  // Handler for pending payments widget
  const handlePendingPaymentsClick = () => {
    navigate("/transactions?unclaimed=1");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h2>
          <p className="text-muted-foreground">Welcome, Doctor!</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">{formattedDate}</p>
          <p className="text-muted-foreground">{formattedTime}</p>
        </div>
      </div>

      <MetricsOverview onPendingPaymentsClick={handlePendingPaymentsClick} />

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
          <PatientTrends patients={samplePatients} />
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4">
          <TransactionTrends />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
