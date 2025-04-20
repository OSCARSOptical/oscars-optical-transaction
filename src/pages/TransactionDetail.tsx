import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Transaction } from '@/types';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BreadcrumbNav from '@/components/layout/Breadcrumb';

import { TransactionHeader } from '@/components/transactions/detail/TransactionHeader';
import { PatientInfo } from '@/components/transactions/create/PatientInfo';
import { OrderDetailsCard } from '@/components/transactions/detail/OrderDetailsCard';
import RefractionDetails from '@/components/transactions/create/RefractionDetails';
import DoctorRemarks from '@/components/transactions/create/DoctorRemarks';
import { OrderNotesCard } from '@/components/transactions/detail/OrderNotesCard';
import FinancialDetails from '@/components/transactions/create/FinancialDetails';

const TransactionDetail = () => {
  const { transactionCode, patientCode } = useParams<{ transactionCode: string; patientCode: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactionData = () => {
      setLoading(true);
      
      setTimeout(() => {
        let mockTransaction: Transaction = {
          id: "1",
          code: transactionCode || "TX25-04-00001",
          date: "2025-04-10",
          patientCode: patientCode || "PX-JD-0000001",
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
          claimed: false,
          dateClaimed: null
        };
        
        const payment = findPayment(transactionCode || "", 'balance');
        
        if (payment) {
          mockTransaction = {
            ...mockTransaction,
            claimed: true,
            dateClaimed: payment.paymentDate,
            balance: 0,
            deposit: mockTransaction.deposit + payment.amount
          };
        }
        
        setTransaction(mockTransaction);
        setLoading(false);
      }, 500);
    };
    
    fetchTransactionData();
    
    const handleBalanceSheetUpdate = () => {
      fetchTransactionData();
    };
    
    window.addEventListener('balanceSheetUpdated', handleBalanceSheetUpdate);
    
    return () => {
      window.removeEventListener('balanceSheetUpdated', handleBalanceSheetUpdate);
    };
  }, [transactionCode, patientCode]);

  const handleClaimedToggle = () => {
    if (!transaction) return;
    
    setTransaction(prevTransaction => {
      if (!prevTransaction) return null;
      
      return {
        ...prevTransaction,
        claimed: !prevTransaction.claimed,
        dateClaimed: !prevTransaction.claimed ? new Date().toISOString().split('T')[0] : null,
        balance: !prevTransaction.claimed ? 0 : prevTransaction.grossAmount - prevTransaction.deposit,
        deposit: !prevTransaction.claimed ? 
          prevTransaction.deposit + prevTransaction.balance : 
          prevTransaction.deposit - prevTransaction.balance
      };
    });
    
    toast({
      title: "✓ Saved!",
      className: "bg-[#FFC42B] text-[#241715] rounded-lg",
      duration: 2000,
    });
  };

  const handleEdit = () => {
    navigate(`/transactions/edit/${transaction?.code}`, { 
      state: { transaction } 
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
        <Alert variant="destructive">
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

  const breadcrumbItems = [
    { label: 'Transactions', href: '/transactions' },
    { label: transaction.patientName, href: `/patients/${transaction.patientCode}` },
    { label: transaction.code }
  ];

  return (
    <div className="space-y-6 pb-16">
      <div className="flex justify-between items-start">
        <BreadcrumbNav items={breadcrumbItems} />
        <Button onClick={handleEdit} variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>
      
      <TransactionHeader 
        transaction={transaction}
        onClaimedToggle={handleClaimedToggle}
      />
      
      <div className="grid gap-6">
        <PatientInfo 
          patient={{
            id: transaction.patientCode,
            code: transaction.patientCode,
            firstName: transaction.firstName,
            lastName: transaction.lastName,
            age: 0,
            email: "",
            phone: "",
            address: ""
          }}
          readOnly={true}
        />

        <OrderDetailsCard transaction={transaction} />
        
        <RefractionDetails 
          readOnly={true}
          initialData={{
            previousRx: transaction.previousRx,
            fullRx: transaction.fullRx,
            prescribedPower: transaction.prescribedPower,
            interpupillaryDistance: transaction.interpupillaryDistance
          }}
        />

        <DoctorRemarks 
          readOnly={true}
          initialData={{
            doctorId: transaction.doctorId,
            remarks: transaction.doctorRemarks
          }}
        />

        <FinancialDetails 
          readOnly={true}
          initialData={{
            grossAmount: transaction.grossAmount,
            deposit: transaction.deposit,
            lensCapital: transaction.lensCapital,
            edgingPrice: transaction.edgingPrice,
            otherExpenses: transaction.otherExpenses
          }}
        />

        <OrderNotesCard transaction={transaction} />
      </div>
    </div>
  );
};

export default TransactionDetail;
