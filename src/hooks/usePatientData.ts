
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Patient } from "@/types";

interface LocationState {
  patient?: Patient;
}

export const usePatientData = (patientId: string | undefined) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | undefined>();

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
        sex: (storedSex as 'Male' | 'Female') || state.patient.sex || 'Male'
      };
      
      setPatient(updatedPatient);
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
          sex: 'Male' as 'Male' | 'Female'
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
          sex: 'Female' as 'Male' | 'Female'
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
          sex: 'Male' as 'Male' | 'Female'
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
          sex: (storedSex as 'Male' | 'Female') || samplePatient.sex
        };
        
        setPatient(updatedPatient);
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
          sex: (localStorage.getItem(`patient_${patientId}_sex`) as 'Male' | 'Female') || 'Male'
        };
        
        setPatient(mockPatient);
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

  return { patient };
};
