
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import PatientHeader from "@/components/transactions/create/PatientHeader";
import PatientInfo from "@/components/transactions/create/PatientInfo";
import TransactionDetails from "@/components/transactions/create/TransactionDetails";
import OrderDetails from "@/components/transactions/create/OrderDetails";
import RefractionDetails from "@/components/transactions/create/RefractionDetails";
import DoctorRemarks from "@/components/transactions/create/DoctorRemarks";
import OrderNotes from "@/components/transactions/create/OrderNotes";
import { Patient } from "@/types";

interface NewTransactionPageProps {
  patient?: Patient;
}

const NewTransactionPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactionType, setTransactionType] = useState<string>("Complete");
  const [patient, setPatient] = useState<Patient | undefined>();

  useEffect(() => {
    // For demonstration, using mock data. In real app, fetch from API.
    if (patientId) {
      const mockPatient = {
        id: patientId,
        code: localStorage.getItem(`patient_${patientId}_code`) || "",
        firstName: localStorage.getItem(`patient_${patientId}_firstName`) || "",
        lastName: localStorage.getItem(`patient_${patientId}_lastName`) || "",
        age: Number(localStorage.getItem(`patient_${patientId}_age`)) || 0,
        email: localStorage.getItem(`patient_${patientId}_email`) || "",
        phone: localStorage.getItem(`patient_${patientId}_phone`) || "",
        address: localStorage.getItem(`patient_${patientId}_address`) || ""
      };

      if (!mockPatient.code) {
        toast({
          title: "Error",
          description: "Patient code not generated—please try saving the patient again.",
          variant: "destructive"
        });
        navigate("/transactions");
        return;
      }

      setPatient(mockPatient);
    }
  }, [patientId, navigate, toast]);

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">New Transaction</h2>
        <p className="text-muted-foreground">Create a new patient transaction</p>
      </div>

      <div className="grid gap-6">
        <PatientHeader patient={patient} />
        <PatientInfo patient={patient} />
        <TransactionDetails 
          onTypeChange={setTransactionType} 
        />
        <OrderDetails />
        {transactionType !== "Frame Replacement" && transactionType !== "Repair" && (
          <RefractionDetails />
        )}
        <DoctorRemarks />
        <OrderNotes />
      </div>
    </div>
  );
};

export default NewTransactionPage;
