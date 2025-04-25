
import { Patient, Transaction } from '@/types';
import { TableCell, TableRow } from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';

interface PatientTableRowProps {
  patient: Patient;
  latestTransaction: Transaction | null;
}

export const PatientTableRow = ({ patient, latestTransaction }: PatientTableRowProps) => {
  const navigate = useNavigate();
  
  const handlePatientClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Store the patient object in localStorage to ensure it's available on the detail page
    try {
      localStorage.setItem(`patient_${patient.id}`, JSON.stringify(patient));
      console.log("Patient data stored in localStorage:", patient);
      
      // Also ensure we have all individual fields for compatibility
      localStorage.setItem(`patient_${patient.id}_firstName`, patient.firstName);
      localStorage.setItem(`patient_${patient.id}_lastName`, patient.lastName);
      localStorage.setItem(`patient_${patient.id}_age`, patient.age.toString());
      localStorage.setItem(`patient_${patient.id}_email`, patient.email || "");
      localStorage.setItem(`patient_${patient.id}_phone`, patient.phone || "");
      localStorage.setItem(`patient_${patient.id}_address`, patient.address || "");
      localStorage.setItem(`patient_${patient.id}_code`, patient.code);
      if (patient.sex) {
        localStorage.setItem(`patient_${patient.id}_sex`, patient.sex);
      }
    } catch (error) {
      console.error("Error storing patient data:", error);
    }
    navigate(`/patients/${patient.code}`);
  };

  const handleTransactionClick = (e: React.MouseEvent, transactionCode: string) => {
    e.preventDefault();
    navigate(`/patients/${patient.code}/transactions/${transactionCode}`);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <button 
          className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80 text-left"
          onClick={handlePatientClick}
        >
          {patient.firstName} {patient.lastName}
        </button>
      </TableCell>
      <TableCell>
        <button 
          className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80 text-left"
          onClick={handlePatientClick}
        >
          {patient.code}
        </button>
      </TableCell>
      <TableCell>{patient.age}</TableCell>
      <TableCell>{patient.phone}</TableCell>
      <TableCell>{patient.address}</TableCell>
      <TableCell>{patient.email}</TableCell>
      <TableCell>
        {latestTransaction ? (
          <button 
            className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80 text-left"
            onClick={(e) => handleTransactionClick(e, latestTransaction.code)}
          >
            {latestTransaction.code}
          </button>
        ) : "—"}
      </TableCell>
    </TableRow>
  );
};
