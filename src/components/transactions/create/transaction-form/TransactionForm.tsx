
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Patient, Transaction } from "@/types";
import PatientInfo from "@/components/transactions/create/PatientInfo";
import OrderDetails from "@/components/transactions/create/OrderDetails";
import RefractionDetails from "@/components/transactions/create/RefractionDetails";
import DoctorRemarks from "@/components/transactions/create/DoctorRemarks";
import FinancialDetails from "@/components/transactions/create/FinancialDetails";
import { supabase } from "@/integrations/supabase/client";

interface TransactionFormProps {
  patient?: Patient;
  mockTransaction: Transaction;
  setMockTransaction: React.Dispatch<React.SetStateAction<Transaction>>;
  isEditMode: boolean;
}

const TransactionForm = ({
  patient,
  mockTransaction,
  setMockTransaction,
  isEditMode
}: TransactionFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      if (!patient?.id) {
        toast({
          title: "Error",
          description: "Invalid patient data. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setIsLoading(true);

      const transactionDate = mockTransaction.date ? new Date(mockTransaction.date) : new Date();
      
      // Prepare transaction data
      const transactionData = {
        patient_id: patient.id,
        transaction_code: mockTransaction.code,
        transaction_date: transactionDate.toISOString(),
        transaction_type: mockTransaction.type,
        interpupillary_distance: mockTransaction.interpupillaryDistance,
        gross_amount: mockTransaction.grossAmount || 0,
        deposit: mockTransaction.deposit || 0,
        balance: mockTransaction.balance || 0,
        lens_capital: mockTransaction.lensCapital || 0,
        edging_price: mockTransaction.edgingPrice || 0,
        other_expenses: mockTransaction.otherExpenses || 0,
        total_expenses: mockTransaction.totalExpenses || 0,
        lens_type: mockTransaction.lensType || null,
        lens_coating: mockTransaction.lensCoating || null,
        tint: mockTransaction.tint || null,
        notes: mockTransaction.orderNotes || null,
        claimed: false,
        refractive_index: mockTransaction.refractiveIndex || null
      };

      console.log('Saving transaction with data:', transactionData);

      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();

      if (transactionError) {
        console.error('Supabase error:', transactionError);
        throw new Error('Failed to save transaction');
      }

      toast({
        title: "Success",
        description: `Transaction ${mockTransaction.code} has been ${isEditMode ? 'updated' : 'saved'}.`,
      });
      navigate("/transactions");
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast({
        title: "Error",
        description: "Failed to save transaction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-y-10">
      <PatientInfo
        patient={patient}
        readOnly={true}
      />

      <RefractionDetails
        initialData={{
          previousRx: mockTransaction.previousRx,
          fullRx: mockTransaction.fullRx,
          prescribedPower: mockTransaction.prescribedPower,
          interpupillaryDistance: mockTransaction.interpupillaryDistance,
          previousRxLensType: mockTransaction.previousRxLensType,
          previousRxDate: mockTransaction.previousRxDate,
          noPreviousRx: mockTransaction.noPreviousRx
        }}
        readOnly={false}
      />

      <DoctorRemarks />

      <OrderDetails
        initialType={mockTransaction.type}
        onTypeChange={(type) => {
          // Here's the fix: cast the type to the appropriate union type
          setMockTransaction(prev => ({ 
            ...prev, 
            type: type as Transaction['type'] 
          }));
        }}
        onPricesChange={prices => {
          setMockTransaction(prev => ({
            ...prev,
            lensCapital: prices.lensCapital,
            edgingPrice: prices.edgingPrice,
            otherExpenses: prices.otherExpenses
          }));
        }}
        initialData={{
          transactionType: mockTransaction.type,
          transactionDate: mockTransaction.date,
          refractiveIndex: mockTransaction.refractiveIndex,
          lensType: mockTransaction.lensType,
          lensCoating: mockTransaction.lensCoating,
          tint: mockTransaction.tint,
          color: mockTransaction.color,
          frameType: mockTransaction.frameType,
          orderNotes: mockTransaction.orderNotes
        }}
        readOnly={false}
      />

      <FinancialDetails
        initialData={{
          grossAmount: mockTransaction.grossAmount,
          deposit: mockTransaction.deposit,
          lensCapital: mockTransaction.lensCapital,
          edgingPrice: mockTransaction.edgingPrice,
          otherExpenses: mockTransaction.otherExpenses
        }}
        autofillPrices={{
          lensCapital: mockTransaction.lensCapital,
          edgingPrice: mockTransaction.edgingPrice,
          otherExpenses: mockTransaction.otherExpenses
        }}
      />

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          className="w-full md:w-auto"
          disabled={isLoading}
        >
          <Save className="mr-2" />
          {isLoading ? 'Saving...' : 'Save Transaction'}
        </Button>
      </div>
    </div>
  );
};

export default TransactionForm;
