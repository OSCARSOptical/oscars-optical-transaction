import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Patient } from "@/types";
import PatientSearch from "../patients/PatientSearch";
import NewPatientForm from "../patients/NewPatientForm";

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = "select" | "search" | "new";

const NewTransactionModal = ({ isOpen, onClose }: NewTransactionModalProps) => {
  const [mode, setMode] = useState<Mode>("select");
  const navigate = useNavigate();
  
  const handlePatientSelect = (patient: Patient) => {
    localStorage.setItem(`patient_${patient.id}_code`, patient.code);
    localStorage.setItem(`patient_${patient.id}_firstName`, patient.firstName);
    localStorage.setItem(`patient_${patient.id}_lastName`, patient.lastName);
    localStorage.setItem(`patient_${patient.id}_age`, patient.age.toString());
    localStorage.setItem(`patient_${patient.id}_email`, patient.email);
    localStorage.setItem(`patient_${patient.id}_phone`, patient.phone);
    localStorage.setItem(`patient_${patient.id}_address`, patient.address);
    
    onClose();
    navigate(`/transactions/new/${patient.id}`);
  };

  const handlePatientSave = (patientData: Omit<Patient, "id">) => {
    const newId = Math.random().toString(36).substring(7);
    const newPatient: Patient = {
      id: newId,
      ...patientData
    };
    
    localStorage.setItem(`patient_${newId}_code`, newPatient.code);
    localStorage.setItem(`patient_${newId}_firstName`, newPatient.firstName);
    localStorage.setItem(`patient_${newId}_lastName`, newPatient.lastName);
    localStorage.setItem(`patient_${newId}_age`, newPatient.age.toString());
    localStorage.setItem(`patient_${newId}_email`, newPatient.email);
    localStorage.setItem(`patient_${newId}_phone`, newPatient.phone);
    localStorage.setItem(`patient_${newId}_address`, newPatient.address);
    
    onClose();
    navigate(`/transactions/new/${newId}`);
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
