
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Transaction, Patient } from '@/types';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TransactionView } from '@/components/transactions/detail/TransactionView';
import { findPayment } from '@/utils/paymentsUtils';

// Sample data with the same format as in PatientDetail component
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

      // First, fetch the patient data from our sample database
      const foundPatient = samplePatients.find(p => p.code === patientCode);

      if (foundPatient) {
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

        // After patient is set, create transaction data with this patient info
        setTimeout(() => {
          let mockTransaction: Transaction = {
            id: "1",
            code: transactionCode || "TX25-04-00001",
            date: "2025-04-10",
            patientCode: patientCode || "PX-JD-0000001",
            patientName: `${updatedPatient.firstName} ${updatedPatient.lastName}`,
            firstName: updatedPatient.firstName,
            lastName: updatedPatient.lastName,
            type: "Complete",
            grossAmount: 7500.00,
            deposit: 2500.00,
            balance: 5000.00,
            lensCapital: 1200.00,
            edgingPrice: 150.00,
            otherExpenses: 50.00,
            totalExpenses: 1400.00,
            claimed: false,
            dateClaimed: null,
            refractiveIndex: "1.56",
            lensType: "SV",
            lensCoating: "UC",
            tint: "N/A",
            color: "",
            interpupillaryDistance: 62,
            orderNotes: "Sample order notes",
            previousRx: undefined,
            fullRx: undefined,
            prescribedPower: undefined,
            doctorId: undefined,
            doctorRemarks: undefined
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
      } else {
        // Patient not found, no transaction should be fetched
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

  // Pass both the transaction and complete patient data to the view
  return <TransactionView 
    transaction={transaction} 
    patientData={patient} 
    onClaimedToggle={handleClaimedToggle} 
    pageTitle="Transaction Details" 
  />;
};

export default TransactionDetail;
