
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Patient } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const usePatientData = (patientCode: string | undefined) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const state = location.state as { patient?: Patient } | undefined;
    if (state?.patient) {
      setPatient(state.patient);
      setLoading(false);
      return;
    }
    
    if (patientCode) {
      const fetchPatient = async () => {
        try {
          setLoading(true);
          
          // Fetch by patient_code instead of id
          const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('patient_code', patientCode)
            .single();
            
          if (error) {
            console.error("Error fetching patient:", error);
            toast({
              title: "Error",
              description: "Patient not found—please try again.",
              variant: "destructive"
            });
            navigate("/transactions");
            return;
          }

          if (!data) {
            toast({
              title: "Error",
              description: "Patient not found",
              variant: "destructive"
            });
            navigate("/transactions");
            return;
          }
          
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
          
          setPatient(patientData);
        } catch (err) {
          console.error("Error in usePatientData:", err);
          toast({
            title: "Error",
            description: "Failed to load patient data",
            variant: "destructive"
          });
          navigate("/transactions");
        } finally {
          setLoading(false);
        }
      };
      
      fetchPatient();
    }
  }, [patientCode, navigate, toast, location.state]);

  return { patient, loading };
};
