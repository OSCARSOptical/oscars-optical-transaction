
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PatientSearchResults, { PatientMatch } from "../patients/PatientSearchResults";

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTransactionModal = ({ isOpen, onClose }: NewTransactionModalProps) => {
  const [mode, setMode] = useState<"select" | "new">("select");
  const [patientName, setPatientName] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [matches, setMatches] = useState<PatientMatch[]>([]);

  const handleNameChange = (value: string) => {
    setPatientName(value);
    // Simulated patient search - replace with actual API call
    if (value.length >= 3) {
      const sampleMatches: PatientMatch[] = [
        {
          name: "Jane Doe",
          patientCode: "PX-JD-00012",
          dateOfBirth: "1985-07-23",
        },
        {
          name: "Janet Do",
          patientCode: "PX-JD-00045",
          dateOfBirth: "1990-11-02",
        },
      ];
      setMatches(sampleMatches);
      setShowAlert(true);
    }
  };

  const handleNewPatient = () => {
    setMode("new");
  };

  const handleContinueCreating = () => {
    setShowAlert(false);
    // Continue with patient creation
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          {mode === "select" ? (
            <div className="grid gap-4 py-4">
              <Button onClick={handleNewPatient} className="w-full">Add New Patient</Button>
              <Button variant="outline" className="w-full">Select Existing Patient</Button>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter patient name"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🔍 Possible existing patient(s) found</AlertDialogTitle>
            <AlertDialogDescription>
              We've found one or more patients with names like yours. Please review before adding a new record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <PatientSearchResults matches={matches} />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleContinueCreating}>
              Continue Creating
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NewTransactionModal;
