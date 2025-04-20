
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
  
  // Use the same sample data as in PatientList
  const samplePatients: Patient[] = [
    {
      id: '12345',
      firstName: 'John',
      lastName: 'Doe',
      age: 35,
      email: 'john@example.com',
      phone: '555-123-4567',
      address: '123 Main St, City, State',
      code: 'PX-JD-0000001'
    }, 
    {
      id: '67890',
      firstName: 'Jane',
      lastName: 'Smith',
      age: 28,
      email: 'jane@example.com',
      phone: '555-987-6543',
      address: '456 Oak St, City, State',
      code: 'PX-JS-0000001'
    },
    {
      id: '54321',
      firstName: 'Oscar',
      lastName: 'Santos',
      age: 40,
      email: 'oscar@example.com',
      phone: '555-555-1111',
      address: '789 Pine St, City, State',
      code: 'PX-OS-0000001'
    }
  ];

  // Show most recent patients by default
  useEffect(() => {
    setResults(samplePatients);
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const query = value.toLowerCase();
    
    if (!query) {
      setResults(samplePatients);
      return;
    }

    const filtered = samplePatients.filter(patient => {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      const nameParts = query.split(' ');
      
      return (
        patient.code.toLowerCase().includes(query) ||
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query) ||
        fullName.includes(query) ||
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
          placeholder="Search by patient ID, first name, or last name..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Patient ID</TableHead>
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
