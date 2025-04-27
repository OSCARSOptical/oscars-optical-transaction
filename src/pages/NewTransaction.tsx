
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { usePatientData } from "@/hooks/usePatientData";
import { useTransactionCode } from "@/hooks/useTransactionCode";
import { Patient, Transaction } from "@/types";
import TransactionForm from "@/components/transactions/create/transaction-form/TransactionForm";
import TransactionHeader from "@/components/transactions/create/transaction-form/TransactionHeader";
import { useNavigate } from "react-router-dom";

const NewTransactionPage = () => {
  const navigate = useNavigate();
  const { patientId: patientCode } = useParams(); // This is actually the patient code
  const location = useLocation();
  const { patient: initialPatient, loading: patientLoading } = usePatientData(patientCode);
  const { generateTransactionCode } = useTransactionCode();
  const isEditMode = location.pathname.includes('/edit/');
  
  const editTransaction = isEditMode && location.state?.transaction 
    ? location.state.transaction 
    : null;

  // Use today's date for new transactions or the date from editTransaction
  const transactionDate = editTransaction?.date 
    ? new Date(editTransaction.date) 
    : new Date();
  
  const [transactionCodeState] = useState<string>(
    editTransaction?.code || generateTransactionCode(transactionDate)
  );
  
  const [patient, setPatient] = useState<Patient | undefined>(undefined);

  useEffect(() => {
    if (!patientLoading && !initialPatient && patientCode) {
      navigate("/transactions", { 
        replace: true,
        state: { error: "Patient not found" }
      });
    }
  }, [patientLoading, initialPatient, patientCode, navigate]);

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

  const [mockTransaction, setMockTransaction] = useState<Transaction>(() => {
    if (editTransaction) {
      return editTransaction;
    }
    
    return {
      id: "new",
      code: transactionCodeState,
      date: transactionDate.toISOString().split('T')[0],
      patientCode: patientCode || "",
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
      dateClaimed: null,
      frameType: "",
      noPreviousRx: false
    };
  });

  // This effect updates the transaction code when the transaction date changes
  useEffect(() => {
    if (!isEditMode && mockTransaction.date) {
      const currentDate = new Date(mockTransaction.date);
      // Only regenerate the code if the year/month has changed
      const currentCode = mockTransaction.code;
      const currentCodePrefix = currentCode.split('-').slice(0, 2).join('-');
      
      const newDateYear = currentDate.getFullYear().toString().slice(-2);
      const newDateMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const newDatePrefix = `TX${newDateYear}-${newDateMonth}`;
      
      if (currentCodePrefix !== newDatePrefix) {
        const newCode = generateTransactionCode(currentDate);
        console.log(`Date changed, updating transaction code from ${currentCode} to ${newCode}`);
        setMockTransaction(prev => ({
          ...prev,
          code: newCode
        }));
      }
    }
  }, [mockTransaction.date, isEditMode, generateTransactionCode]);

  if (patientLoading) {
    return <div className="p-8">Loading patient data...</div>;
  }

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
