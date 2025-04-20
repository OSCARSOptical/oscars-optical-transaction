
import { useState, useEffect } from 'react';
import { Users, ShoppingBag, CreditCard, CheckCircle } from "lucide-react";
import MetricCard from "./MetricCard";
import { Transaction } from '@/types';

// Import the shared transactions data
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

// Import the shared patients data
const samplePatients = [
  {
    id: '12345',
    firstName: 'John',
    lastName: 'Doe',
    age: 35,
    email: 'john@example.com',
    phone: '555-123-4567',
    address: '123 Main St, City, State',
    code: 'PX-JD-0000001'
  }, 
  {
    id: '67890',
    firstName: 'Jane',
    lastName: 'Smith',
    age: 28,
    email: 'jane@example.com',
    phone: '555-987-6543',
    address: '456 Oak St, City, State',
    code: 'PX-JS-0000001'
  },
  {
    id: '54321',
    firstName: 'Oscar',
    lastName: 'Santos',
    age: 40,
    email: 'oscar@example.com',
    phone: '555-555-1111',
    address: '789 Pine St, City, State',
    code: 'PX-OS-0000001'
  }
];

const MetricsOverview = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Calculate total pending payments (balances on unclaimed transactions)
    const pending = transactions
      .filter(tx => !tx.claimed)
      .reduce((sum, tx) => sum + tx.balance, 0);
    
    // Count how many transactions have pending payments
    const count = transactions.filter(tx => !tx.claimed && tx.balance > 0).length;
    
    setPendingPayments(pending);
    setPendingCount(count);
  }, [transactions]);

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      currencyDisplay: 'symbol',
    }).format(amount).replace('PHP', '₱');
  };

  // Calculate monthly revenue (use current month transactions)
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const monthlyRevenue = transactions
    .filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() + 1 === currentMonth && txDate.getFullYear() === currentYear;
    })
    .reduce((sum, tx) => sum + tx.deposit, 0);

  const metrics = [
    {
      title: "Total Patients",
      value: samplePatients.length.toString(),
      description: "+5 this month",
      icon: Users,
      iconColor: "text-blue-500",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(monthlyRevenue),
      description: "+8% from last month",
      icon: ShoppingBag,
      iconColor: "text-[#9E0214]",
    },
    {
      title: "Pending Payments",
      value: formatCurrency(pendingPayments),
      description: `${pendingCount} patients`,
      icon: CreditCard,
      iconColor: "text-[#FFC42B]",
    },
    {
      title: "Total Transactions This Month",
      value: transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() + 1 === currentMonth && txDate.getFullYear() === currentYear;
      }).length.toString(),
      description: "Current month",
      icon: CheckCircle,
      iconColor: "text-green-500",
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
