
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Patient } from "@/types";

interface PatientSearchProps {
  onSelect: (patient: Patient) => void;
  onBack: () => void;
}

const PatientSearch = ({ onSelect, onBack }: PatientSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  
  // Simulated database - in a real app, this would come from your backend
  const mockPatients: Patient[] = [
    {
      id: "1",
      code: "PX-JD-00012",
      firstName: "Jane",
      lastName: "Doe",
      age: 38,
      email: "jane@example.com",
      phone: "+1234567890",
      address: "123 Main St"
    },
    {
      id: "2",
      code: "PX-JS-00045",
      firstName: "Janet",
      lastName: "Smith",
      age: 35,
      email: "janet@example.com",
      phone: "+1234567891",
      address: "456 Oak Ave"
    }
  ];

  // Show most recent patients by default
  useEffect(() => {
    setResults(mockPatients);
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const query = value.toLowerCase();
    
    if (!query) {
      setResults(mockPatients);
      return;
    }

    const filtered = mockPatients.filter(patient => {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      const nameParts = query.split(' ');
      
      return (
        patient.code.toLowerCase().includes(query) ||
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query) ||
        fullName === query ||
        (nameParts.length > 1 && 
          nameParts.every(part => fullName.includes(part.toLowerCase())))
      );
    });

    setResults(filtered);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by patient code, first name, or last name..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Patient Code</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((patient) => (
            <TableRow key={patient.code}>
              <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
              <TableCell>{patient.code}</TableCell>
              <TableCell>{patient.phone}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelect(patient)}
                >
                  Select
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default PatientSearch;
