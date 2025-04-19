
import { useState } from "react";
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

const NewTransactionPage = ({ patient }: NewTransactionPageProps) => {
  const [transactionType, setTransactionType] = useState<string>("Complete");

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
