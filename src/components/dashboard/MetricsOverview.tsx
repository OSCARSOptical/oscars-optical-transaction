import { useState, useEffect } from 'react';
import { Users, ShoppingBag, CreditCard, CheckCircle } from "lucide-react";
import MetricCard from "./MetricCard";
import { Transaction } from '@/types';
import { format, subMonths, startOfMonth, endOfMonth, isSameMonth, isAfter, isBefore, parseISO } from 'date-fns';
import { getAllPayments } from '@/utils/paymentsUtils';

const sampleTransactions: Transaction[] = [
  {
    id: '1',
    code: 'TX25-04-00001',
    date: '2025-04-10',
    patientCode: 'PX-JD-0000001',
    patientName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    type: 'Complete',
    grossAmount: 7500.00,
    deposit: 2500.00,
    balance: 5000.00,
    lensCapital: 1200.00,
    edgingPrice: 150.00,
    otherExpenses: 50.00,
    totalExpenses: 1400.00,
    claimed: true,
    dateClaimed: '2025-04-15'
  },
  {
    id: '2',
    code: 'TX25-04-00002',
    date: '2025-04-08',
    patientCode: 'PX-JS-0000001',
    patientName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    type: 'Eye Exam',
    grossAmount: 1205.00,
    deposit: 1205.00,
    balance: 0.00,
    lensCapital: 0.00,
    edgingPrice: 0.00,
    otherExpenses: 0.00,
    totalExpenses: 0.00,
    claimed: true,
    dateClaimed: '2025-04-08'
  },
  {
    id: '3',
    code: 'TX25-04-00003',
    date: '2025-04-11',
    patientCode: 'PX-OS-0000001',
    patientName: 'Oscar Santos',
    firstName: 'Oscar',
    lastName: 'Santos',
    type: 'Frame Replacement',
    grossAmount: 6800.00,
    deposit: 6800.00,
    balance: 0.00,
    lensCapital: 2800.00,
    edgingPrice: 200.00,
    otherExpenses: 100.00,
    totalExpenses: 3100.00,
    claimed: false,
    dateClaimed: null
  }
];

const samplePatients = [
  {
    id: '12345',
    firstName: 'John',
    lastName: 'Doe',
    age: 35,
    email: 'john@example.com',
    phone: '555-123-4567',
    address: '123 Main St, City, State',
    code: 'PX-JD-0000001',
    createdDate: '2025-01-15'
  }, 
  {
    id: '67890',
    firstName: 'Jane',
    lastName: 'Smith',
    age: 28,
    email: 'jane@example.com',
    phone: '555-987-6543',
    address: '456 Oak St, City, State',
    code: 'PX-JS-0000001',
    createdDate: '2025-02-20'
  },
  {
    id: '54321',
    firstName: 'Oscar',
    lastName: 'Santos',
    age: 40,
    email: 'oscar@example.com',
    phone: '555-555-1111',
    address: '789 Pine St, City, State',
    code: 'PX-OS-0000001',
    createdDate: '2025-03-10'
  }
];

const MetricsOverview = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [monthlyRevenueComparison, setMonthlyRevenueComparison] = useState<string>('');
  const [newPatientsThisMonth, setNewPatientsThisMonth] = useState(0);

  useEffect(() => {
    const handleBalanceSheetUpdate = () => {
      setRefreshTrigger(prev => prev + 1);
    };
    
    window.addEventListener('balanceSheetUpdated', handleBalanceSheetUpdate);
    
    return () => {
      window.removeEventListener('balanceSheetUpdated', handleBalanceSheetUpdate);
    };
  }, []);

  useEffect(() => {
    const pending = transactions
      .filter(tx => !tx.claimed)
      .reduce((sum, tx) => sum + tx.balance, 0);
    
    const count = transactions.filter(tx => !tx.claimed && tx.balance > 0).length;
    
    setPendingPayments(pending);
    setPendingCount(count);
  }, [transactions, refreshTrigger]);

  useEffect(() => {
    const currentDate = new Date();
    const currentMonthStart = startOfMonth(currentDate);
    const currentMonthEnd = endOfMonth(currentDate);
    const lastMonthStart = startOfMonth(subMonths(currentDate, 1));
    const lastMonthEnd = endOfMonth(subMonths(currentDate, 1));
    
    const allPayments = getAllPayments();

    const currentMonthDeposits = transactions
      .filter(tx => {
        const txDate = parseISO(tx.date);
        return isAfter(txDate, currentMonthStart) && isBefore(txDate, currentMonthEnd);
      })
      .reduce((sum, tx) => sum + tx.deposit, 0);
    
    const currentMonthBalancePayments = allPayments
      .filter(payment => {
        const paymentDate = parseISO(payment.paymentDate);
        return isAfter(paymentDate, currentMonthStart) && isBefore(paymentDate, currentMonthEnd);
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    const currentMonthTotal = currentMonthDeposits + currentMonthBalancePayments;
    
    const lastMonthDeposits = transactions
      .filter(tx => {
        const txDate = parseISO(tx.date);
        return isAfter(txDate, lastMonthStart) && isBefore(txDate, lastMonthEnd);
      })
      .reduce((sum, tx) => sum + tx.deposit, 0);
    
    const lastMonthBalancePayments = allPayments
      .filter(payment => {
        const paymentDate = parseISO(payment.paymentDate);
        return isAfter(paymentDate, lastMonthStart) && isBefore(paymentDate, lastMonthEnd);
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    const lastMonthTotal = lastMonthDeposits + lastMonthBalancePayments;
    
    setMonthlyRevenue(currentMonthTotal);
    
    if (lastMonthTotal > 0) {
      const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
      setMonthlyRevenueComparison(`${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(0)}% from last month`);
    } else {
      setMonthlyRevenueComparison('—');
    }
    
    const newPatients = samplePatients.filter(patient => {
      const createdDate = parseISO(patient.createdDate);
      return isSameMonth(createdDate, currentDate);
    }).length;
    
    setNewPatientsThisMonth(newPatients);
    
  }, [transactions, refreshTrigger]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      currencyDisplay: 'symbol',
    }).format(amount).replace('PHP', '₱');
  };

  const currentMonth = format(new Date(), 'yyyy-MM');

  const monthlyTransactionsCount = transactions
    .filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() + 1 === currentMonth && txDate.getFullYear() === currentYear;
    }).length;

  const metrics = [
    {
      title: "Total Patients",
      value: samplePatients.length.toString(),
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
      value: monthlyTransactionsCount.toString(),
      description: "Current month",
      icon: CheckCircle,
      iconColor: "text-green-500",
      href: "/transactions"
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={`${index}-${refreshTrigger}`} {...metric} />
      ))}
    </div>
  );
};

export default MetricsOverview;
