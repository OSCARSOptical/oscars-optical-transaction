
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
    
    // Store patient data in localStorage both ways - as complete object and as individual fields
    localStorage.setItem(`patient_${patient.code}`, JSON.stringify(patient));
    
    // Also store individual fields for compatibility with existing code
    localStorage.setItem(`patient_${patient.id}_firstName`, patient.firstName);
    localStorage.setItem(`patient_${patient.id}_lastName`, patient.lastName);
    localStorage.setItem(`patient_${patient.id}_age`, patient.age.toString());
    localStorage.setItem(`patient_${patient.id}_email`, patient.email);
    localStorage.setItem(`patient_${patient.id}_phone`, patient.phone);
    localStorage.setItem(`patient_${patient.id}_address`, patient.address);
    if (patient.sex) {
      localStorage.setItem(`patient_${patient.id}_sex`, patient.sex);
    }
    localStorage.setItem(`patient_${patient.id}_code`, patient.code);
    
    navigate(`/patients/${patient.code}`);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <a 
          href={`/patients/${patient.code}`}
          className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80"
          onClick={handlePatientClick}
        >
          {patient.firstName} {patient.lastName}
        </a>
      </TableCell>
      <TableCell>
        <a 
          href={`/patients/${patient.code}`}
          className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80"
          onClick={handlePatientClick}
        >
          {patient.code}
        </a>
      </TableCell>
      <TableCell>{patient.age}</TableCell>
      <TableCell>{patient.phone}</TableCell>
      <TableCell>{patient.address}</TableCell>
      <TableCell>{patient.email}</TableCell>
      <TableCell>
        {latestTransaction ? (
          <a 
            href={`/patients/${patient.code}/transactions/${latestTransaction.code}`}
            className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/patients/${patient.code}/transactions/${latestTransaction.code}`);
            }}
          >
            {latestTransaction.code}
          </a>
        ) : "—"}
      </TableCell>
    </TableRow>
  );
};
