
import { format } from 'date-fns';
import MetricCard from "./MetricCard";
import { useMetricsData } from '@/hooks/useMetricsData';
import { sampleTransactions } from '@/data';
import { getMetricsConfig } from '@/config/metricsConfig';

interface MetricsOverviewProps {
  onPendingPaymentsClick?: () => void;
}

const MetricsOverview = ({ onPendingPaymentsClick }: MetricsOverviewProps) => {
  const {
    transactions,
    pendingPayments,
    pendingCount,
    monthlyRevenue,
    monthlyRevenueComparison,
    newPatientsThisMonth
  } = useMetricsData(sampleTransactions, []);

  const currentMonth = format(new Date(), 'yyyy-MM');
  const monthlyTransactionsCount = transactions.filter(tx => 
    format(new Date(tx.date), 'yyyy-MM') === currentMonth
  ).length;

  // We want to attach an onClick only to Pending Payments metric
  const metrics = getMetricsConfig(
    0, // Total patients count (now 0 since we're not using sample data)
    newPatientsThisMonth,
    monthlyRevenue,
    monthlyRevenueComparison,
    pendingPayments,
    pendingCount,
    monthlyTransactionsCount
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const isPendingPayments = metric.title === "Pending Payments";
        return (
          <MetricCard
            key={`${index}-${metric.title}`}
            {...metric}
            onClick={isPendingPayments ? onPendingPaymentsClick : undefined}
            // Remove 'href' if we attach onClick for accessibility consistency
            href={!isPendingPayments ? metric.href : undefined}
          />
        );
      })}
    </div>
  );
};

export default MetricsOverview;
