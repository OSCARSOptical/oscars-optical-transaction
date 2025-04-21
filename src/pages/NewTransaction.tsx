
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { usePatientData } from "@/hooks/usePatientData";
import { useTransactionCode } from "@/hooks/useTransactionCode";
import BreadcrumbNav from "@/components/layout/Breadcrumb";
// Import components
import PatientInfo from "@/components/transactions/create/PatientInfo";
import OrderDetails from "@/components/transactions/create/OrderDetails";
import RefractionDetails from "@/components/transactions/create/RefractionDetails";
import DoctorRemarks from "@/components/transactions/create/DoctorRemarks";
import FinancialDetails from "@/components/transactions/create/FinancialDetails";
import { Patient, Transaction } from "@/types";
import { TransactionHeader } from "@/components/transactions/detail/TransactionHeader";

const NewTransactionPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { patient: initialPatient } = usePatientData(patientId);
  const { generateTransactionCode } = useTransactionCode();
  const [transactionType, setTransactionType] = useState<string>("Complete");
  const [transactionCode] = useState<string>(generateTransactionCode());
  const [patient, setPatient] = useState<Patient | undefined>(undefined);

  // Create a mock transaction for the TransactionHeader
  const [mockTransaction, setMockTransaction] = useState<Transaction>({
    id: "new",
    code: transactionCode,
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
  });

  useEffect(() => {
    if (initialPatient && (!patient || patient.id !== initialPatient.id)) {
      setPatient(initialPatient);

      setMockTransaction(prev => ({
        ...prev,
        patientCode: initialPatient.code,
        patientName: `${initialPatient.firstName} ${initialPatient.lastName}`,
        firstName: initialPatient.firstName,
        lastName: initialPatient.lastName
      }));
    }
  }, [initialPatient, patient]);

  const handlePatientUpdate = (updatedPatient: Patient) => {
    setPatient(updatedPatient);
    setMockTransaction(prev => ({
      ...prev,
      patientCode: updatedPatient.code,
      patientName: `${updatedPatient.firstName} ${updatedPatient.lastName}`,
      firstName: updatedPatient.firstName,
      lastName: updatedPatient.lastName
    }));
  };

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
      description: `Transaction ${transactionCode} has been saved.`,
    });
    navigate("/transactions");
  };

  const breadcrumbItems = [
    { label: "Patients", href: "/patients" },
    { label: patient ? `${patient.firstName} ${patient.lastName}` : "Loading...", href: `/patients/${patient?.code}` },
    { label: transactionCode }
  ];

  const handleClaimedToggle = () => {};

  return (
    <div className="space-y-6 pb-16">
      <BreadcrumbNav items={breadcrumbItems} />

      {/* HEADER REMOVED BASED ON USER REQUEST */}

      <TransactionHeader
        transaction={mockTransaction}
        onClaimedToggle={handleClaimedToggle}
        readOnly={true}
        pageTitle="New Transaction"
        patientName={patient ? `${patient.firstName} ${patient.lastName}` : ""}
        patientCode={patient ? patient.code : ""}
      />

      <div className="grid gap-y-10">
        <PatientInfo
          patient={patient}
          onPatientUpdate={handlePatientUpdate}
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
        />

        <RefractionDetails
          initialData={{
            previousRx: mockTransaction.previousRx,
            fullRx: mockTransaction.fullRx,
            prescribedPower: mockTransaction.prescribedPower,
            interpupillaryDistance: mockTransaction.interpupillaryDistance
          }}
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

