
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { User, ArrowUpAZ, ArrowDownAZ, Filter } from "lucide-react";
import { Patient } from '@/types';
import { PatientTableRow } from './PatientTableRow';
import { filterPatients } from '@/utils/patientUtils';
import { usePatientLatestTransaction } from '@/hooks/usePatientLatestTransaction';
import { samplePatients, sampleTransactions } from '@/data/sampleData';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PatientListProps {
  initialSearchQuery?: string;
}

type SortOrder = 'none' | 'asc' | 'desc';
type FilterBy = 'none' | 'age' | 'address';

export function PatientList({ initialSearchQuery = '' }: PatientListProps) {
  const [patients] = useState<Patient[]>(samplePatients);
  const [transactions] = useState(sampleTransactions);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [filterBy, setFilterBy] = useState<FilterBy>('none');
  const { getLatestTransaction } = usePatientLatestTransaction(transactions);
  
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);
  
  const sortPatients = (patientsToSort: Patient[]) => {
    if (sortOrder === 'none') return patientsToSort;
    
    return [...patientsToSort].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return sortOrder === 'asc' ? 
        nameA.localeCompare(nameB) : 
        nameB.localeCompare(nameA);
    });
  };

  const filterAndSortPatients = () => {
    let filteredPatients = filterPatients(patients, searchQuery);
    
    // Apply additional filtering based on filterBy
    if (filterBy === 'age') {
      filteredPatients = filteredPatients.sort((a, b) => a.age - b.age);
    } else if (filterBy === 'address') {
      filteredPatients = filteredPatients.sort((a, b) => 
        a.address.localeCompare(b.address)
      );
    }
    
    return sortPatients(filteredPatients);
  };

  const displayedPatients = filterAndSortPatients();

  return (
    <Card className="w-full shadow-sm border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <User className="mr-2 h-5 w-5 text-crimson-600" />
          Patients
        </CardTitle>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <ToggleGroup type="single" value={sortOrder} onValueChange={(value: SortOrder) => value && setSortOrder(value)}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="asc" aria-label="Sort A to Z">
                    <ArrowUpAZ className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sort A to Z</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="desc" aria-label="Sort Z to A">
                    <ArrowDownAZ className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sort Z to A</p>
                </TooltipContent>
              </Tooltip>
            </ToggleGroup>
          </TooltipProvider>

          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter patients</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={filterBy} onValueChange={setFilterBy}>
                <DropdownMenuRadioItem value="none">None</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="age">Age (Ascending)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="address">Address (A-Z)</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <TableHead>Address</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Transaction ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedPatients.length > 0 ? displayedPatients.map(patient => (
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
