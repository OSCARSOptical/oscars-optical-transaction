import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Transaction, Patient } from '@/types';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TransactionView } from '@/components/transactions/detail/TransactionView';
import { findPayment } from '@/utils/paymentsUtils';
import { samplePatients } from '@/data';

// Sample patients data with the same format as in PatientDetail component
const samplePatients: Patient[] = [
  {
    id: '12345',
    firstName: 'John',
    lastName: 'Doe',
    age: 35,
    email: 'john@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, City, State',
    code: 'PX-JD-0000001',
    sex: 'Male'
  }, 
  {
    id: '67890',
    firstName: 'Jane',
    lastName: 'Smith',
    age: 28,
    email: 'jane@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak St, City, State',
    code: 'PX-JS-0000001',
    sex: 'Female'
  },
  {
    id: '54321',
    firstName: 'Oscar',
    lastName: 'Santos',
    age: 40,
    email: 'oscar@example.com',
    phone: '(555) 555-1111',
    address: '789 Pine St, City, State',
    code: 'PX-OS-0000001',
    sex: 'Male'
  },
  {
    id: '98765',
    firstName: 'Maria',
    lastName: 'Garcia',
    age: 32,
    email: 'maria@example.com',
    phone: '(555) 444-3333',
    address: '321 Elm St, City, State',
    code: 'PX-MG-0000001',
    sex: 'Female'
  },
  {
    id: '12121',
    firstName: 'Robert',
    lastName: 'Johnson',
    age: 45,
    email: 'robert@example.com',
    phone: '(555) 222-9999',
    address: '567 Cedar St, City, State',
    code: 'PX-RJ-0000001',
    sex: 'Male'
  },
  {
    id: '23232',
    firstName: 'Sarah',
    lastName: 'Williams',
    age: 29,
    email: 'sarah@example.com',
    phone: '(555) 888-7777',
    address: '890 Maple St, City, State',
    code: 'PX-SW-0000001',
    sex: 'Female'
  },
  {
    id: '34343',
    firstName: 'Michael',
    lastName: 'Brown',
    age: 38,
    email: 'michael@example.com',
    phone: '(555) 777-5555',
    address: '654 Birch St, City, State',
    code: 'PX-MB-0000001',
    sex: 'Male'
  },
  {
    id: '45454',
    firstName: 'Emily',
    lastName: 'Taylor',
    age: 27,
    email: 'emily@example.com',
    phone: '(555) 666-4444',
    address: '432 Walnut St, City, State',
    code: 'PX-ET-0000001',
    sex: 'Female'
  },
  {
    id: '56565',
    firstName: 'David',
    lastName: 'Martinez',
    age: 42,
    email: 'david@example.com',
    phone: '(555) 333-2222',
    address: '765 Spruce St, City, State',
    code: 'PX-DM-0000001',
    sex: 'Male'
  },
  {
    id: '67676',
    firstName: 'Lisa',
    lastName: 'Anderson',
    age: 31,
    email: 'lisa@example.com',
    phone: '(555) 111-8888',
    address: '987 Oak St, City, State',
    code: 'PX-LA-0000001',
    sex: 'Female'
  }
];

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
        const foundPatient = samplePatients.find(p => p.code === patientCodeToUse);

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

  // Pass both the transaction and complete patient data to the view, and set breadcrumb items:
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
