
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Patient } from "@/types";

interface ImportPreviewTableProps {
  data: Patient[];
  onEdit: (index: number) => void;
}

export function ImportPreviewTable({ data, onEdit }: ImportPreviewTableProps) {
  return (
    <div className="border rounded-md shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Sex</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((patient, index) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.code}</TableCell>
              <TableCell>{patient.firstName}</TableCell>
              <TableCell>{patient.lastName}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.sex}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => onEdit(index)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
