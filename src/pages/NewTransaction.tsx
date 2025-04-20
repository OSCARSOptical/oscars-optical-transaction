import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import PatientHeader from "@/components/transactions/create/PatientHeader";
import PatientInfo from "@/components/transactions/create/PatientInfo";
import OrderDetails from "@/components/transactions/create/OrderDetails";
import RefractionDetails from "@/components/transactions/create/RefractionDetails";
import DoctorRemarks from "@/components/transactions/create/DoctorRemarks";
import { Patient } from "@/types";

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
      // Check for localStorage updates
      const storedFirstName = localStorage.getItem(`patient_${state.patient.id}_firstName`);
      const storedLastName = localStorage.getItem(`patient_${state.patient.id}_lastName`);
      const storedAge = localStorage.getItem(`patient_${state.patient.id}_age`);
      const storedEmail = localStorage.getItem(`patient_${state.patient.id}_email`);
      const storedPhone = localStorage.getItem(`patient_${state.patient.id}_phone`);
      const storedAddress = localStorage.getItem(`patient_${state.patient.id}_address`);
      const storedSex = localStorage.getItem(`patient_${state.patient.id}_sex`);
      
      // Create updated patient with localStorage values if they exist
      const updatedPatient = {
        ...state.patient,
        firstName: storedFirstName || state.patient.firstName,
        lastName: storedLastName || state.patient.lastName,
        age: storedAge ? parseInt(storedAge) : state.patient.age,
        email: storedEmail || state.patient.email,
        phone: storedPhone || state.patient.phone,
        address: storedAddress || state.patient.address,
        sex: (storedSex as 'Male' | 'Female' | 'Other') || state.patient.sex || 'Other'
      };
      
      setPatient(updatedPatient);
      setTransactionCode(generateTransactionCode());
      return;
    }
    
    if (patientId) {
      // First try to find in our sample data
      const samplePatients = [
        {
          id: '12345',
          firstName: 'John',
          lastName: 'Doe',
          age: 35,
          email: 'john@example.com',
          phone: '555-123-4567',
          address: '123 Main St, City, State',
          code: 'PX-JD-0000001',
          sex: 'Male' as 'Male' | 'Female' | 'Other'
        }, 
        {
          id: '67890',
          firstName: 'Jane',
          lastName: 'Smith',
          age: 28,
          email: 'jane@example.com',
          phone: '555-987-6543',
          address: '456 Oak St, City, State',
          code: 'PX-JS-0000001',
          sex: 'Female' as 'Male' | 'Female' | 'Other'
        },
        {
          id: '54321',
          firstName: 'Oscar',
          lastName: 'Santos',
          age: 40,
          email: 'oscar@example.com',
          phone: '555-555-1111',
          address: '789 Pine St, City, State',
          code: 'PX-OS-0000001',
          sex: 'Male' as 'Male' | 'Female' | 'Other'
        }
      ];
      
      const samplePatient = samplePatients.find(p => p.id === patientId);
      
      if (samplePatient) {
        // Check for localStorage updates
        const storedFirstName = localStorage.getItem(`patient_${patientId}_firstName`);
        const storedLastName = localStorage.getItem(`patient_${patientId}_lastName`);
        const storedAge = localStorage.getItem(`patient_${patientId}_age`);
        const storedEmail = localStorage.getItem(`patient_${patientId}_email`);
        const storedPhone = localStorage.getItem(`patient_${patientId}_phone`);
        const storedAddress = localStorage.getItem(`patient_${patientId}_address`);
        const storedSex = localStorage.getItem(`patient_${patientId}_sex`);
        
        // Use the sample patient but override with any localStorage values
        const updatedPatient = {
          ...samplePatient,
          firstName: storedFirstName || samplePatient.firstName,
          lastName: storedLastName || samplePatient.lastName,
          age: storedAge ? parseInt(storedAge) : samplePatient.age,
          email: storedEmail || samplePatient.email,
          phone: storedPhone || samplePatient.phone,
          address: storedAddress || samplePatient.address,
          sex: (storedSex as 'Male' | 'Female' | 'Other') || samplePatient.sex
        };
        
        setPatient(updatedPatient);
        setTransactionCode(generateTransactionCode());
        return;
      }
      
      // If not found in sample data, try to reconstruct from localStorage
      const storedCode = localStorage.getItem(`patient_${patientId}_code`);
      
      if (storedCode) {
        const mockPatient = {
          id: patientId,
          code: storedCode,
          firstName: localStorage.getItem(`patient_${patientId}_firstName`) || "",
          lastName: localStorage.getItem(`patient_${patientId}_lastName`) || "",
          age: Number(localStorage.getItem(`patient_${patientId}_age`)) || 0,
          email: localStorage.getItem(`patient_${patientId}_email`) || "",
          phone: localStorage.getItem(`patient_${patientId}_phone`) || "",
          address: localStorage.getItem(`patient_${patientId}_address`) || "",
          sex: (localStorage.getItem(`patient_${patientId}_sex`) as 'Male' | 'Female' | 'Other') || 'Other'
        };
        
        setPatient(mockPatient);
        setTransactionCode(generateTransactionCode());
      } else {
        toast({
          title: "Error",
          description: "Patient code not generated—please try saving the patient again.",
          variant: "destructive"
        });
        navigate("/transactions");
      }
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
        <RefractionDetails />
        <DoctorRemarks />
        <OrderDetails initialType={transactionType} onTypeChange={setTransactionType} />
        
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
