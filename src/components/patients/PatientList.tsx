
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { User } from "lucide-react";
import { Patient, Transaction } from '@/types';
import { PatientTableRow } from './PatientTableRow';
import { supabase } from "@/integrations/supabase/client";
import { filterPatients } from '@/utils/patientUtils';
import { usePatientLatestTransaction } from '@/hooks/usePatientLatestTransaction';

interface PatientListProps {
  initialSearchQuery?: string;
}

export function PatientList({ initialSearchQuery = '' }: PatientListProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [loading, setLoading] = useState(true);
  
  // Use the hook to get latest transaction for each patient
  const { getLatestTransaction } = usePatientLatestTransaction(transactions);
  
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);
  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        
        // Fetch patients from Supabase
        const { data, error } = await supabase
          .from('patients')
          .select('*');
        
        if (error) {
          console.error('Error fetching patients:', error);
          return;
        }
        
        // Transform the data to match the Patient type
        const formattedPatients: Patient[] = data.map(patient => ({
          id: patient.id,
          firstName: patient.first_name,
          lastName: patient.last_name,
          email: patient.email || '',
          phone: patient.contact_number || '',
          address: patient.address || '',
          age: patient.age || 0,
          code: patient.patient_code,
          sex: patient.sex as 'Male' | 'Female' || 'Male'
        }));
        
        console.log('Fetched patients:', formattedPatients);
        setPatients(formattedPatients);
        
        // Fetch all transactions
        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .select('*, patients!inner(patient_code)');
          
        if (transactionError) {
          console.error('Error fetching transactions:', transactionError);
          return;
        }
        
        // Transform transaction data
        const formattedTransactions: Transaction[] = transactionData.map(tx => ({
          id: tx.id,
          code: tx.transaction_code || '',
          patientCode: tx.patients?.patient_code || '',
          patientName: '', // Will be filled in later
          firstName: '',
          lastName: '',
          date: tx.transaction_date || new Date().toISOString().split('T')[0],
          type: tx.transaction_type as Transaction['type'],
          grossAmount: tx.gross_amount || 0,
          deposit: tx.deposit || 0,
          balance: tx.balance || 0,
          lensCapital: tx.lens_capital || 0,
          edgingPrice: tx.edging_price || 0,
          otherExpenses: tx.other_expenses || 0,
          totalExpenses: tx.total_expenses || 0,
          claimed: tx.claimed || false,
          dateClaimed: tx.claimed_on || null
        }));
        
        console.log('Fetched transactions:', formattedTransactions);
        setTransactions(formattedTransactions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, []);
  
  // Filter patients based on search query
  const filteredPatients = searchQuery 
    ? filterPatients(patients, searchQuery) 
    : patients;
  
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
              <TableHead>Patient Name</TableHead>
              <TableHead>Patient ID</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Transaction ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading patients...
                </TableCell>
              </TableRow>
            ) : filteredPatients.length > 0 ? filteredPatients.map(patient => (
              <PatientTableRow 
                key={patient.id}
                patient={patient}
                latestTransaction={getLatestTransaction(patient.code)}
              />
            )) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
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
