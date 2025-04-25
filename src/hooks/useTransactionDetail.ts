
import { useState, useEffect } from 'react';
import { Transaction, Patient } from '@/types';
import { findPayment } from '@/utils/paymentsUtils';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

export function useTransactionDetail(transactionCode: string | undefined, patientCode: string | undefined) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // In the future, this will fetch actual data from an API or database
        // For now, we'll just set null values to indicate no data is available
        
        // Simulate a slight delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setTransaction(null);
        setPatient(null);
      } catch (error) {
        console.error('Error fetching transaction details:', error);
        toast({
          title: "Error",
          description: "Failed to load transaction details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [transactionCode, patientCode, toast]);

  const handleClaimedToggle = () => {
    if (!transaction) return;

    setTransaction(prevTransaction => {
      if (!prevTransaction) return null;

      return {
        ...prevTransaction,
        claimed: !prevTransaction.claimed,
        dateClaimed: !prevTransaction.claimed ? new Date().toISOString().split('T')[0] : null,
        balance: !prevTransaction.claimed ? 0 : prevTransaction.grossAmount - prevTransaction.deposit,
        deposit: !prevTransaction.claimed ?
          prevTransaction.deposit + prevTransaction.balance :
          prevTransaction.deposit - prevTransaction.balance
      };
    });

    toast({
      title: "✓ Saved!",
      className: "bg-[#FFC42B] text-[#241715] rounded-lg",
      duration: 2000,
    });
  };

  return { transaction, patient, loading, handleClaimedToggle };
}
