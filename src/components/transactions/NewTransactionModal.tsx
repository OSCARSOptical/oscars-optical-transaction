
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Patient } from "@/types";
import PatientSearch from "../patients/PatientSearch";
import NewPatientForm from "../patients/NewPatientForm";
import { useToast } from "@/hooks/use-toast";

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = "select" | "search" | "new";

const NewTransactionModal = ({ isOpen, onClose }: NewTransactionModalProps) => {
  const [mode, setMode] = useState<Mode>("select");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const savePatientToLocalStorage = (patient: Patient) => {
    localStorage.setItem(`patient_${patient.id}_code`, patient.code);
    localStorage.setItem(`patient_${patient.id}_firstName`, patient.firstName);
    localStorage.setItem(`patient_${patient.id}_lastName`, patient.lastName);
    localStorage.setItem(`patient_${patient.id}_age`, patient.age.toString());
    localStorage.setItem(`patient_${patient.id}_email`, patient.email);
    localStorage.setItem(`patient_${patient.id}_phone`, patient.phone);
    localStorage.setItem(`patient_${patient.id}_address`, patient.address);
  };
  
  const handlePatientSelect = (patient: Patient) => {
    savePatientToLocalStorage(patient);
    
    // Navigate to the new transaction page with patient data
    onClose();
    navigate(`/transactions/new/${patient.id}`, { 
      state: { patient } 
    });
  };

  const handlePatientSave = (patientData: Omit<Patient, "id">) => {
    const newId = Math.random().toString(36).substring(7);
    const newPatient: Patient = {
      id: newId,
      ...patientData
    };
    
    savePatientToLocalStorage(newPatient);
    
    // Verify patient code was generated successfully
    if (!newPatient.code) {
      toast({
        title: "Error",
        description: "Patient code generation failed",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to the new transaction page with patient data
    onClose();
    navigate(`/transactions/new/${newId}`, { 
      state: { patient: newPatient } 
    });
  };

  const renderContent = () => {
    switch (mode) {
      case "select":
        return (
          <div className="grid gap-4 py-4">
            <Button onClick={() => setMode("search")} className="w-full">
              Select Existing Patient
            </Button>
            <Button onClick={() => setMode("new")} variant="outline" className="w-full">
              Add New Patient
            </Button>
          </div>
        );
      case "search":
        return (
          <PatientSearch
            onSelect={handlePatientSelect}
            onBack={() => setMode("select")}
          />
        );
      case "new":
        return (
          <NewPatientForm
            onSave={handlePatientSave}
            onBack={() => setMode("select")}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default NewTransactionModal;
