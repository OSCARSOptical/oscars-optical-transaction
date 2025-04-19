import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, User } from "lucide-react";
import { Patient } from '@/types';
const generatePatientCode = (firstName: string, lastName: string, id: string): string => {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  const numericPart = id.slice(-5).padStart(5, '0');
  return `PX-${firstInitial}${lastInitial}-${numericPart}`;
};

// Sample data with the new structure
const samplePatients: Patient[] = [{
  id: '12345',
  firstName: 'John',
  lastName: 'Doe',
  age: 35,
  email: 'john@example.com',
  phone: '(555) 123-4567',
  address: '123 Main St, City, State',
  code: 'PX-JD-12345'
}, {
  id: '67890',
  firstName: 'Jane',
  lastName: 'Smith',
  age: 28,
  email: 'jane@example.com',
  phone: '(555) 987-6543',
  address: '456 Oak St, City, State',
  code: 'PX-JS-67890'
}];
export function PatientList() {
  const [patients] = useState<Patient[]>(samplePatients);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const filteredPatients = patients.filter(patient => patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || patient.code.toLowerCase().includes(searchQuery.toLowerCase()) || patient.email.toLowerCase().includes(searchQuery.toLowerCase()));
  return <Card className="w-full shadow-sm border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <User className="mr-2 h-5 w-5 text-crimson-600" />
          Patients
        </CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search patients..." className="pl-9 w-[250px]" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Patient Code</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? filteredPatients.map(patient => <TableRow key={patient.id} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/patients/${patient.code}`)}>
                  <TableCell className="font-medium">
                    {patient.firstName} {patient.lastName}
                  </TableCell>
                  <TableCell>{patient.code}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                </TableRow>) : <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No patients found.
                </TableCell>
              </TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>;
}
export default PatientList;