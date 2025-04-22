
import { Users, ShoppingBag, CreditCard, CheckCircle } from "lucide-react";
import { format } from 'date-fns';

export const getMetricsConfig = (
  patientsCount: number,
  newPatientsThisMonth: number,
  monthlyRevenue: number,
  monthlyRevenueComparison: string,
  pendingPayments: number,
  pendingCount: number,
  transactionsCount: number
) => {
  const currentMonth = format(new Date(), 'yyyy-MM');

  return [
    {
      title: "Total Patients",
      value: patientsCount.toString(),
      description: `+${newPatientsThisMonth} this month`,
      icon: Users,
      iconColor: "text-blue-500",
      href: "/patients"
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(monthlyRevenue),
      description: monthlyRevenueComparison,
      icon: ShoppingBag,
      iconColor: "text-[#9E0214]",
      href: `/balance-sheet?month=${currentMonth}`
    },
    {
      title: "Pending Payments",
      value: formatCurrency(pendingPayments),
      description: `${pendingCount} patients`,
      icon: CreditCard,
      iconColor: "text-[#FFC42B]",
      href: "/transactions?filter=unclaimed"
    },
    {
      title: "Total Transactions This Month",
      value: transactionsCount.toString(),
      description: "Current month",
      icon: CheckCircle,
      iconColor: "text-green-500",
      href: "/transactions"
    },
  ];
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    currencyDisplay: 'symbol',
  }).format(amount).replace('PHP', '₱');
};
