
import { useParams, useNavigate } from 'react-router-dom';
import BreadcrumbNav from '@/components/layout/Breadcrumb';
import { useEffect, useState } from 'react';
import { Transaction } from '@/types';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TransactionHeader } from '@/components/transactions/detail/TransactionHeader';
import { PatientCard } from '@/components/transactions/detail/PatientCard';
import { FinancialCard } from '@/components/transactions/detail/FinancialCard';
import { InfoCard } from '@/components/transactions/detail/InfoCard';

const TransactionDetail = () => {
  const { transactionCode } = useParams<{ transactionCode: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
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

  const handleClaimedToggle = () => {
    if (!transaction) return;
    
    const updatedTransaction = {
      ...transaction,
      claimed: !transaction.claimed,
      dateClaimed: !transaction.claimed ? new Date().toISOString() : null
    };
    
    setTransaction(updatedTransaction);
    
    toast({
      title: "✓ Saved!",
      className: "bg-[#FFC42B] text-[#241715] rounded-lg",
      duration: 2000,
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <BreadcrumbNav 
          items={[
            { label: 'Transactions', href: '/transactions' },
            { label: 'Loading...' }
          ]}
        />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="space-y-4">
        <BreadcrumbNav 
          items={[
            { label: 'Transactions', href: '/transactions' }
          ]}
        />
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Transaction not found</AlertTitle>
          <AlertDescription>
            The transaction with code {transactionCode} could not be found.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/transactions')}>
          Return to Transactions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BreadcrumbNav 
        items={[
          { label: 'Transactions', href: '/transactions' },
          { label: transaction.patientName, href: `/patients/${transaction.patientCode}` },
          { label: transaction.code }
        ]}
      />
      
      <TransactionHeader 
        transaction={transaction}
        onClaimedToggle={handleClaimedToggle}
      />
      
      <PatientCard transaction={transaction} />
      
      <FinancialCard transaction={transaction} />
      
      <InfoCard title="Order Details" />
      
      <InfoCard title="Refraction Details" />
      
      <InfoCard title="Doctor & Remarks" />
      
      <InfoCard title="Order Notes" />
    </div>
  );
};

export default TransactionDetail;
