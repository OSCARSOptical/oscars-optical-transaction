
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Patient } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface LocationState {
  patient?: Patient;
}

export const usePatientData = (patientId: string | undefined) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | undefined>();
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
      return;
    }
    
    if (patientId) {
      const fetchPatient = async () => {
        try {
          setLoading(true);
          
          // Try to find patient in Supabase
          const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', patientId)
            .single();
            
          if (error) {
            console.error("Error fetching patient from Supabase:", error);
            
            // If not found in Supabase, try to reconstruct from localStorage
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
              setLoading(false);
            } else {
              toast({
                title: "Error",
                description: "Patient not found—please try again.",
                variant: "destructive"
              });
              navigate("/transactions");
            }
            return;
          }
          
          // Found in Supabase, format the data
          const patientData: Patient = {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            code: data.patient_code,
            age: data.age || 0,
            email: data.email || '',
            phone: data.contact_number || '',
            address: data.address || '',
            sex: data.sex as 'Male' | 'Female' || 'Male'
          };
          
          // Check for localStorage updates
          const storedFirstName = localStorage.getItem(`patient_${patientId}_firstName`);
          const storedLastName = localStorage.getItem(`patient_${patientId}_lastName`);
          const storedAge = localStorage.getItem(`patient_${patientId}_age`);
          const storedEmail = localStorage.getItem(`patient_${patientId}_email`);
          const storedPhone = localStorage.getItem(`patient_${patientId}_phone`);
          const storedAddress = localStorage.getItem(`patient_${patientId}_address`);
          const storedSex = localStorage.getItem(`patient_${patientId}_sex`);
          
          // Use the Supabase data but override with any localStorage values
          const updatedPatient = {
            ...patientData,
            firstName: storedFirstName || patientData.firstName,
            lastName: storedLastName || patientData.lastName,
            age: storedAge ? parseInt(storedAge) : patientData.age,
            email: storedEmail || patientData.email,
            phone: storedPhone || patientData.phone,
            address: storedAddress || patientData.address,
            sex: (storedSex as 'Male' | 'Female') || patientData.sex
          };
          
          setPatient(updatedPatient);
          setLoading(false);
        } catch (err) {
          console.error("Error in usePatientData:", err);
          toast({
            title: "Error",
            description: "Failed to load patient data",
            variant: "destructive"
          });
          navigate("/transactions");
        }
      };
      
      fetchPatient();
    }
  }, [patientId, navigate, toast, location.state]);

  return { patient, loading };
};
