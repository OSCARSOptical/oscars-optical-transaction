import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Transaction, Patient } from '@/types';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TransactionView } from '@/components/transactions/detail/TransactionView';
import { findPayment } from '@/utils/paymentsUtils';
import { samplePatients as importedPatients } from '@/data';
import { sampleTransactions } from '@/data';

const TransactionDetail = () => {
  const { transactionCode, patientCode } = useParams<{ transactionCode: string; patientCode: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);

      // First find the transaction in our sample transactions
      const foundTransaction = sampleTransactions.find(t => t.code === transactionCode);

      if (foundTransaction) {
        // If transaction is found, find the matching patient
        const patientCodeToUse = patientCode || foundTransaction.patientCode;
        const foundPatient = importedPatients.find(p => p.code === patientCodeToUse);

        if (foundPatient) {
          // Apply any stored patient updates from localStorage
          const storedFirstName = localStorage.getItem(`patient_${foundPatient.id}_firstName`);
          const storedLastName = localStorage.getItem(`patient_${foundPatient.id}_lastName`);
          const storedAge = localStorage.getItem(`patient_${foundPatient.id}_age`);
          const storedEmail = localStorage.getItem(`patient_${foundPatient.id}_email`);
          const storedPhone = localStorage.getItem(`patient_${foundPatient.id}_phone`);
          const storedAddress = localStorage.getItem(`patient_${foundPatient.id}_address`);
          const storedSex = localStorage.getItem(`patient_${foundPatient.id}_sex`);

          // Create updated patient with localStorage values if they exist
          const updatedPatient = {
            ...foundPatient,
            firstName: storedFirstName || foundPatient.firstName,
            lastName: storedLastName || foundPatient.lastName,
            age: storedAge ? parseInt(storedAge) : foundPatient.age,
            email: storedEmail || foundPatient.email,
            phone: storedPhone || foundPatient.phone,
            address: storedAddress || foundPatient.address,
            sex: (storedSex as 'Male' | 'Female') || foundPatient.sex
          };

          setPatient(updatedPatient);

          // Check if transaction has been updated in local storage
          const payment = findPayment(transactionCode || "", 'balance');
          let updatedTransaction = { ...foundTransaction };
          
          if (payment) {
            updatedTransaction = {
              ...updatedTransaction,
              claimed: true,
              dateClaimed: payment.paymentDate,
              balance: 0,
              deposit: updatedTransaction.deposit + payment.amount
            };
          }

          setTransaction(updatedTransaction);
        } else {
          // No patient found for this transaction
          setPatient(null);
          setTransaction(foundTransaction);
        }
        
        setLoading(false);
      } else {
        // Transaction not found
        setLoading(false);
        setPatient(null);
        setTransaction(null);
      }
    };

    fetchData();
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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Transaction not found</AlertTitle>
          <AlertDescription>
            The transaction with code {transactionCode} could not be found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Patients', href: '/patients' },
    { label: patient ? `${patient.firstName} ${patient.lastName}` : patientCode || '', href: `/patients/${patientCode || transaction.patientCode}` },
    { label: transaction.code }
  ];

  return (
    <TransactionView
      transaction={transaction}
      patientData={patient}
      onClaimedToggle={handleClaimedToggle}
      pageTitle="Transaction Details"
      breadcrumbItems={breadcrumbItems}
    />
  );
};

export default TransactionDetail;
