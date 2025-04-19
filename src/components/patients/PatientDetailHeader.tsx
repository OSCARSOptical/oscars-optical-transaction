
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Patient } from '@/types';

interface PatientDetailHeaderProps {
  patient: Patient;
  isEditing: boolean;
  onEditToggle: () => void;
}

export function PatientDetailHeader({ patient, isEditing, onEditToggle }: PatientDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {patient.firstName} {patient.lastName}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onEditToggle}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-muted-foreground">{patient.code}</p>
      </div>
    </div>
  );
}
