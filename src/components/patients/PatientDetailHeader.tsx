
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Patient } from '@/types';
import { Trash2 } from 'lucide-react';

interface PatientDetailHeaderProps {
  patient: Patient;
  isEditing: boolean;
  onEditToggle: () => void;
}

export function PatientDetailHeader({
  patient,
  isEditing,
  onEditToggle
}: PatientDetailHeaderProps) {
  const navigate = useNavigate();

  const handleDelete = () => {
    // Remove all patient-related data from localStorage
    localStorage.removeItem(`patient_${patient.id}_firstName`);
    localStorage.removeItem(`patient_${patient.id}_lastName`);
    localStorage.removeItem(`patient_${patient.id}_age`);
    localStorage.removeItem(`patient_${patient.id}_email`);
    localStorage.removeItem(`patient_${patient.id}_phone`);
    localStorage.removeItem(`patient_${patient.id}_address`);
    localStorage.removeItem(`patient_${patient.id}_sex`);
    localStorage.removeItem(`patient_${patient.id}_code`);
    localStorage.removeItem(`patient_${patient.code}`);
    
    // Navigate back to patients list
    navigate('/patients');
  };

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold tracking-tight">
        {patient.firstName} {patient.lastName}
      </h2>
      <div className="flex gap-4">
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={onEditToggle}
        >
          {isEditing ? "Save Changes" : "Edit Patient"}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Patient
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete {patient.firstName} {patient.lastName}'s
                patient record and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
