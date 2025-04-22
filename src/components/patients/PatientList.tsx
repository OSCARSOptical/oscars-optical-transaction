
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "lucide-react";
import { Patient, Transaction } from '@/types';
import { PatientTableRow } from './PatientTableRow';
import { filterPatients } from '@/utils/patientUtils';
import { usePatientLatestTransaction } from '@/hooks/usePatientLatestTransaction';
import { samplePatients, sampleTransactions } from '@/data/sampleData';

interface PatientListProps {
  initialSearchQuery?: string;
}

export function PatientList({ initialSearchQuery = '' }: PatientListProps) {
  const [patients] = useState<Patient[]>(samplePatients);
  const [transactions] = useState<Transaction[]>(sampleTransactions);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const { getLatestTransaction } = usePatientLatestTransaction(transactions);
  
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);
  
  const filteredPatients = filterPatients(patients, searchQuery);

  return (
    <Card className="w-full shadow-sm border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <User className="mr-2 h-5 w-5 text-crimson-600" />
          Patients
        </CardTitle>
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
            {filteredPatients.length > 0 ? filteredPatients.map(patient => (
              <PatientTableRow 
                key={patient.id}
                patient={patient}
                latestTransaction={getLatestTransaction(patient.code)}
              />
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No patients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default PatientList;
