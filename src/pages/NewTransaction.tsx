
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { usePatientData } from "@/hooks/usePatientData";
import { useTransactionCode } from "@/hooks/useTransactionCode";
import BreadcrumbNav from "@/components/layout/Breadcrumb";

// Import components
import PatientHeader from "@/components/transactions/create/PatientHeader";
import PatientInfo from "@/components/transactions/create/PatientInfo";
import OrderDetails from "@/components/transactions/create/OrderDetails";
import RefractionDetails from "@/components/transactions/create/RefractionDetails";
import DoctorRemarks from "@/components/transactions/create/DoctorRemarks";
import FinancialDetails from "@/components/transactions/create/FinancialDetails";
import { Patient } from "@/types";

const NewTransactionPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { patient: initialPatient } = usePatientData(patientId);
  const { generateTransactionCode } = useTransactionCode();
  const [transactionType, setTransactionType] = useState<string>("Complete");
  const [transactionCode] = useState<string>(generateTransactionCode());
  const [patient, setPatient] = useState<Patient | undefined>(undefined);

  // Update patient state whenever initialPatient changes
  useEffect(() => {
    if (initialPatient && (!patient || patient.id !== initialPatient.id)) {
      setPatient(initialPatient);
    }
  }, [initialPatient, patient]);

  // Handle patient updates from PatientInfo component
  const handlePatientUpdate = (updatedPatient: Patient) => {
    setPatient(updatedPatient);
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

  return (
    <div className="space-y-6 pb-16">
      <BreadcrumbNav items={breadcrumbItems} />

      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">New Transaction</h2>
        <p className="text-muted-foreground">Create a new patient transaction</p>
      </div>

      <div className="grid gap-6">
        <PatientHeader 
          patient={patient} 
          transactionCode={transactionCode}
        />
        <PatientInfo 
          patient={patient}
          onPatientUpdate={handlePatientUpdate}
        />
        <RefractionDetails />
        <DoctorRemarks />
        <OrderDetails initialType={transactionType} onTypeChange={setTransactionType} />
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
