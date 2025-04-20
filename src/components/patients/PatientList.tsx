
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, User } from "lucide-react";
import { Patient, Transaction } from '@/types';

const generatePatientCode = (firstName: string, lastName: string, id: string): string => {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  const numericPart = id.slice(-7).padStart(7, '0');
  return `PX-${firstInitial}${lastInitial}-${numericPart}`;
};

// Sample data with the new format
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

// Sample transactions that match our patients with new format
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    code: 'TX25-04-00001',
    date: '2025-04-10',
    patientCode: 'PX-JD-0000001',
    patientName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    type: 'Complete',
    grossAmount: 7500.00,
    deposit: 2500.00,
    depositDate: '2025-04-10', // Added missing depositDate field
    balance: 5000.00,
    lensCapital: 1200.00,
    edgingPrice: 150.00,
    otherExpenses: 50.00,
    totalExpenses: 1400.00,
    claimed: true,
    dateClaimed: '2025-04-15'
  },
  {
    id: '2',
    code: 'TX25-04-00002',
    date: '2025-04-08',
    patientCode: 'PX-JS-0000001',
    patientName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    type: 'Eye Exam',
    grossAmount: 1205.00,
    deposit: 1205.00,
    depositDate: '2025-04-08', // Added missing depositDate field
    balance: 0.00,
    lensCapital: 0.00,
    edgingPrice: 0.00,
    otherExpenses: 0.00,
    totalExpenses: 0.00,
    claimed: true,
    dateClaimed: '2025-04-08'
  },
  {
    id: '3',
    code: 'TX25-04-00003',
    date: '2025-04-11',
    patientCode: 'PX-OS-0000001',
    patientName: 'Oscar Santos',
    firstName: 'Oscar',
    lastName: 'Santos',
    type: 'Frame Replacement',
    grossAmount: 6800.00,
    deposit: 6800.00,
    depositDate: '2025-04-11', // Added missing depositDate field
    balance: 0.00,
    lensCapital: 2800.00,
    edgingPrice: 200.00,
    otherExpenses: 100.00,
    totalExpenses: 3100.00,
    claimed: false,
    dateClaimed: null
  }
];

export function PatientList() {
  const [patients] = useState<Patient[]>(samplePatients);
  const [transactions] = useState<Transaction[]>(sampleTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const filteredPatients = patients.filter(patient => 
    patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    patient.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to get the most recent transaction for a patient
  const getLatestTransaction = (patientCode: string) => {
    const patientTransactions = transactions.filter(t => t.patientCode === patientCode);
    if (patientTransactions.length === 0) return null;
    
    return patientTransactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  };

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
              <TableHead>Patient ID</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Transaction ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? filteredPatients.map(patient => {
              const latestTransaction = getLatestTransaction(patient.code);
              
              return (
                <TableRow key={patient.id} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/patients/${patient.code}`)}>
                  <TableCell className="font-medium">
                    {patient.firstName} {patient.lastName}
                  </TableCell>
                  <TableCell>{patient.code}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (latestTransaction) {
                        navigate(`/transactions/${latestTransaction.code}`);
                      }
                    }}
                    className={latestTransaction ? "text-[#9E0214] hover:underline" : ""}
                  >
                    {latestTransaction ? latestTransaction.code : "—"}
                  </TableCell>
                </TableRow>
              );
            }) : <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No patients found.
                </TableCell>
              </TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>;
}
export default PatientList;
