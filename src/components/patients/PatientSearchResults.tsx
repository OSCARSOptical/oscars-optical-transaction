
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export interface PatientMatch {
  name: string;
  patientCode: string;
  dateOfBirth: string;
}

interface PatientSearchResultsProps {
  matches: PatientMatch[];
}

const PatientSearchResults = ({ matches }: PatientSearchResultsProps) => {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Patient ID</TableHead>
          <TableHead>Date of Birth</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches.map((match) => (
          <TableRow key={match.patientCode}>
            <TableCell>{match.name}</TableCell>
            <TableCell>{match.patientCode}</TableCell>
            <TableCell>{match.dateOfBirth}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/patients/${match.patientCode}`)}
              >
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PatientSearchResults;
