import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import PatientHeader from "@/components/transactions/create/PatientHeader";
import PatientInfo from "@/components/transactions/create/PatientInfo";
import TransactionDetails from "@/components/transactions/create/TransactionDetails";
import OrderDetails from "@/components/transactions/create/OrderDetails";
import RefractionDetails from "@/components/transactions/create/RefractionDetails";
import DoctorRemarks from "@/components/transactions/create/DoctorRemarks";
import OrderNotes from "@/components/transactions/create/OrderNotes";
import { Patient } from "@/types";
import { usePatientTransactions } from "@/hooks/usePatientTransactions";

interface LocationState {
  patient?: Patient;
}

const NewTransactionPage = () => {
  const { patientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactionType, setTransactionType] = useState<string>("Complete");
  const [patient, setPatient] = useState<Patient | undefined>();
  const [transactionCode, setTransactionCode] = useState<string>("");

  const handleSave = () => {
    toast({
      title: "Success",
      description: `Transaction ${transactionCode} has been saved.`,
    });
    navigate("/transactions");
  };

  const generateTransactionCode = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    
    const prefix = `TX${year}-${month}`;
    
    const existingCodes: string[] = [];
    
    const sampleTransactions = [
      { code: "TX25-04-00001" },
      { code: "TX25-04-00002" },
      { code: "TX25-04-00003" }
    ];
    
    sampleTransactions.forEach(tx => {
      existingCodes.push(tx.code);
    });
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`transaction_`) && key.endsWith('_code')) {
        const code = localStorage.getItem(key);
        if (code && code.startsWith(prefix) && !existingCodes.includes(code)) {
          existingCodes.push(code);
        }
      }
    }
    
    let maxSequence = 0;
    existingCodes.forEach(code => {
      const sequencePart = code.split('-')[2];
      if (sequencePart) {
        const sequence = parseInt(sequencePart);
        if (!isNaN(sequence) && sequence > maxSequence) {
          maxSequence = sequence;
        }
      }
    });
    
    const nextSequence = (maxSequence + 1).toString().padStart(5, "0");
    
    return `${prefix}-${nextSequence}`;
  };

  useEffect(() => {
    const state = location.state as LocationState | undefined;
    if (state?.patient) {
      setPatient(state.patient);
      setTransactionCode(generateTransactionCode());
      return;
    }
    
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
      setTransactionCode(generateTransactionCode());
    }
  }, [patientId, navigate, toast, location.state]);

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">New Transaction</h2>
        <p className="text-muted-foreground">Create a new patient transaction</p>
      </div>

      <div className="grid gap-6">
        <PatientHeader 
          patient={patient} 
          transactionCode={transactionCode}
        />
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
