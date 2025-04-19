
import { Users, PhilippinePeso } from "lucide-react";
import MetricCard from "./MetricCard";

const MetricsOverview = () => {
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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default MetricsOverview;
