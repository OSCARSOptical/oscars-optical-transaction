
import { Patient, Transaction } from '@/types';
import { TableCell, TableRow } from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';

interface PatientTableRowProps {
  patient: Patient;
  latestTransaction: Transaction | null;
}

export const PatientTableRow = ({ patient, latestTransaction }: PatientTableRowProps) => {
  const navigate = useNavigate();

  return (
    <TableRow>
      <TableCell className="font-medium">
        <a 
          href={`/patients/${patient.code}`}
          className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/patients/${patient.code}`);
          }}
        >
          {patient.firstName} {patient.lastName}
        </a>
      </TableCell>
      <TableCell>
        <a 
          href={`/patients/${patient.code}`}
          className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/patients/${patient.code}`);
          }}
        >
          {patient.code}
        </a>
      </TableCell>
      <TableCell>{patient.age}</TableCell>
      <TableCell>{patient.phone}</TableCell>
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
