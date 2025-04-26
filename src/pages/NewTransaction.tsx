
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { usePatientData } from "@/hooks/usePatientData";
import { useTransactionCode } from "@/hooks/useTransactionCode";
import { Patient, Transaction } from "@/types";
import TransactionForm from "@/components/transactions/create/transaction-form/TransactionForm";
import TransactionHeader from "@/components/transactions/create/transaction-form/TransactionHeader";

const NewTransactionPage = () => {
  const { patientId, transactionCode } = useParams();
  const location = useLocation();
  const { patient: initialPatient } = usePatientData(patientId);
  const { generateTransactionCode } = useTransactionCode();
  const [transactionType, setTransactionType] = useState<string>("Complete");
  const isEditMode = location.pathname.includes('/edit/');
  
  // Get transaction from location state if in edit mode
  const editTransaction = isEditMode && location.state?.transaction 
    ? location.state.transaction 
    : null;

  const [transactionCodeState] = useState<string>(
    editTransaction?.code || generateTransactionCode()
  );
  
  const [patient, setPatient] = useState<Patient | undefined>(undefined);

  // Initialize with edit transaction data or create a new mock transaction
  const [mockTransaction, setMockTransaction] = useState<Transaction>(() => {
    if (editTransaction) {
      return editTransaction;
    }
    
    return {
      id: "new",
      code: transactionCodeState,
      date: new Date().toISOString().split('T')[0],
      patientCode: patientId || "",
      patientName: "",
      firstName: "",
      lastName: "",
      type: "Complete",
      grossAmount: 0,
      deposit: 0,
      balance: 0,
      lensCapital: 0,
      edgingPrice: 0,
      otherExpenses: 0,
      totalExpenses: 0,
      claimed: false,
      dateClaimed: null
    };
  });

  useEffect(() => {
    if (initialPatient && (!patient || patient.id !== initialPatient.id)) {
      setPatient(initialPatient);

      if (!isEditMode) {
        setMockTransaction(prev => ({
          ...prev,
          patientCode: initialPatient.code,
          patientName: `${initialPatient.firstName} ${initialPatient.lastName}`,
          firstName: initialPatient.firstName,
          lastName: initialPatient.lastName
        }));
      }
    }
  }, [initialPatient, patient, isEditMode]);

  // Prepare breadcrumb items based on whether we're editing or creating
  const breadcrumbItems = isEditMode
    ? [
        { label: "Transactions", href: "/transactions" },
        { label: mockTransaction.code, href: `/transactions/${mockTransaction.code}` },
        { label: "Edit" }
      ]
    : [
        { label: "Patients", href: "/patients" },
        { label: patient ? `${patient.firstName} ${patient.lastName}` : "Loading...", href: `/patients/${patient?.code}` },
        { label: transactionCodeState }
      ];

  return (
    <div className="space-y-6 pb-16">
      <TransactionHeader 
        transaction={mockTransaction}
        patient={patient}
        isEditMode={isEditMode}
        breadcrumbItems={breadcrumbItems}
      />
      
      <TransactionForm 
        patient={patient}
        mockTransaction={mockTransaction}
        setMockTransaction={setMockTransaction}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default NewTransactionPage;
