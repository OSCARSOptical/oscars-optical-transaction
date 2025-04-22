
import { format } from 'date-fns';
import MetricCard from "./MetricCard";
import { useMetricsData } from '@/hooks/useMetricsData';
import { sampleTransactions, samplePatients } from '@/data';
import { getMetricsConfig } from '@/config/metricsConfig';

const MetricsOverview = () => {
  const {
    transactions,
    pendingPayments,
    pendingCount,
    monthlyRevenue,
    monthlyRevenueComparison,
    newPatientsThisMonth
  } = useMetricsData(sampleTransactions, samplePatients);

  const currentMonth = format(new Date(), 'yyyy-MM');
  
  const monthlyTransactionsCount = transactions.filter(tx => 
    format(new Date(tx.date), 'yyyy-MM') === currentMonth
  ).length;

  const metrics = getMetricsConfig(
    samplePatients.length,
    newPatientsThisMonth,
    monthlyRevenue,
    monthlyRevenueComparison,
    pendingPayments,
    pendingCount,
    monthlyTransactionsCount
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={`${index}-${metric.title}`} {...metric} />
      ))}
    </div>
  );
};

export default MetricsOverview;
