
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { usePatientData } from "@/hooks/usePatientData";
import { useTransactionCode } from "@/hooks/useTransactionCode";
import BreadcrumbNav from "@/components/layout/Breadcrumb";
import PatientInfo from "@/components/transactions/create/PatientInfo";
import OrderDetails from "@/components/transactions/create/OrderDetails";
import RefractionDetails from "@/components/transactions/create/RefractionDetails";
import DoctorRemarks from "@/components/transactions/create/DoctorRemarks";
import FinancialDetails from "@/components/transactions/create/FinancialDetails";
import { Patient, Transaction } from "@/types";
import { TransactionHeader } from "@/components/transactions/detail/TransactionHeader";

const NewTransactionPage = () => {
  const { patientId, transactionCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const handleTransactionTypeChange = (type: string) => {
    setTransactionType(type);
    setMockTransaction(prev => ({
      ...prev,
      type: type as any
    }));
  };

  const handleIpdChangeForRefraction = (ipdValue: number | undefined) => {
    setMockTransaction(prev => ({
      ...prev,
      interpupillaryDistance: ipdValue
    }));
  };

  const handleSave = () => {
    toast({
      title: "Success",
      description: `Transaction ${mockTransaction.code} has been ${isEditMode ? 'updated' : 'saved'}.`,
    });
    navigate("/transactions");
  };

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

  // Dummy function - not actually used for new/edit transactions
  const handleClaimedToggle = () => {};

  return (
    <div className="space-y-6 pb-16">
      <BreadcrumbNav items={breadcrumbItems} />

      <TransactionHeader
        transaction={mockTransaction}
        onClaimedToggle={handleClaimedToggle}
        readOnly={true}
        pageTitle={isEditMode ? `Edit Transaction ${mockTransaction.code}` : "New Transaction"}
        patientName={patient ? `${patient.firstName} ${patient.lastName}` : ""}
        patientCode={patient ? patient.code : ""}
        isNew={true}
      />

      <div className="grid gap-y-10">
        <PatientInfo
          patient={patient}
          readOnly={true}
        />

        <OrderDetails
          initialType={transactionType}
          onTypeChange={handleTransactionTypeChange}
          initialData={{
            transactionType: mockTransaction.type,
            transactionDate: mockTransaction.date,
            refractiveIndex: mockTransaction.refractiveIndex,
            lensType: mockTransaction.lensType,
            lensCoating: mockTransaction.lensCoating,
            tint: mockTransaction.tint,
            color: mockTransaction.color,
            orderNotes: mockTransaction.orderNotes
          }}
          readOnly={false}
        />

        <RefractionDetails
          initialData={{
            previousRx: mockTransaction.previousRx,
            fullRx: mockTransaction.fullRx,
            prescribedPower: mockTransaction.prescribedPower,
            interpupillaryDistance: mockTransaction.interpupillaryDistance,
            previousRxLensType: mockTransaction.previousRxLensType,
            previousRxDate: mockTransaction.previousRxDate
          }}
          readOnly={false}
        />

        <DoctorRemarks />

        <FinancialDetails />

        <div className="flex justify-end">
          <Button onClick={handleSave} className="w-full md:w-auto">
            <Save className="mr-2" />
            Save Transaction
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewTransactionPage;
