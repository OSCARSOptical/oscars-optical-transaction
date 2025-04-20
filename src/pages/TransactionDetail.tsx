import { useParams } from 'react-router-dom';
import BreadcrumbNav from '@/components/layout/Breadcrumb';
import { useEffect, useState } from 'react';
import { Transaction } from '@/types';

// Import transaction detail components here

const TransactionDetail = () => {
  const { transactionCode } = useParams<{ transactionCode: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch transaction by code from API
    // For now, we'll simulate a loading state with setTimeout
    setLoading(true);
    setTimeout(() => {
      // Mock data
      const mockTransaction: Transaction = {
        id: "1",
        code: transactionCode || "TX25-04-00001",
        date: "2025-04-10",
        patientCode: "PX-JD-0000001",
        patientName: "John Doe",
        firstName: "John",
        lastName: "Doe",
        type: "Complete",
        grossAmount: 7500.00,
        deposit: 2500.00,
        balance: 5000.00,
        lensCapital: 1200.00,
        edgingPrice: 150.00,
        otherExpenses: 50.00,
        totalExpenses: 1400.00,
        claimed: true,
        dateClaimed: "2025-04-15"
      };
      
      setTransaction(mockTransaction);
      setLoading(false);
    }, 500);
  }, [transactionCode]);

  if (loading) {
    return <div>Loading transaction details...</div>;
  }

  if (!transaction) {
    return <div>Transaction not found</div>;
  }

  return (
    <div className="space-y-4">
      <BreadcrumbNav 
        items={[
          { label: 'Transactions', href: '/transactions' },
          { label: transaction.patientName, href: `/patients/${transaction.patientCode}` },
          { label: transaction.code }
        ]}
      />
      
      {/* Transaction detail content goes here */}
      <div>Transaction detail for {transaction.code}</div>
    </div>
  );
};

export default TransactionDetail;
