
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export function usePatientFirstTransaction() {
  const [patientFirstDates, setPatientFirstDates] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFirstTransactions = async () => {
      try {
        setLoading(true);
        
        // Fetch all transactions from Supabase
        const { data, error } = await supabase
          .from('transactions')
          .select('patient_code, transaction_date')
          .order('transaction_date', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        const firstDatesMap: Record<string, string> = {};
        
        // Process the data to find earliest transaction per patient
        data.forEach(transaction => {
          const patientCode = transaction.patient_code;
          
          if (patientCode && transaction.transaction_date) {
            if (!firstDatesMap[patientCode] || 
                new Date(transaction.transaction_date) < new Date(firstDatesMap[patientCode])) {
              firstDatesMap[patientCode] = transaction.transaction_date;
            }
          }
        });
        
        setPatientFirstDates(firstDatesMap);
      } catch (error) {
        console.error("Error fetching first transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFirstTransactions();
  }, []);
  
  return patientFirstDates;
}
