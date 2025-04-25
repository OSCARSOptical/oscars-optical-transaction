import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { User, ArrowUpAZ, ArrowDownAZ, Filter } from "lucide-react";
import { Patient } from '@/types';
import { PatientTableRow } from './PatientTableRow';
import { filterPatients } from '@/utils/patientUtils';
import { usePatientLatestTransaction } from '@/hooks/usePatientLatestTransaction';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [transactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [filterBy, setFilterBy] = useState<FilterBy>('none');
  const [ageRange, setAgeRange] = useState([0, 100]);
  const { getLatestTransaction } = usePatientLatestTransaction(transactions);
  
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);
  
  useEffect(() => {
    // Load patients from localStorage
    const loadedPatients: Patient[] = [];
    
    try {
      // First look for complete patient objects
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('patient_') && !key.includes('_')) {
          try {
            const patientJson = localStorage.getItem(key);
            if (patientJson) {
              const patient = JSON.parse(patientJson);
              if (patient && patient.id) {
                loadedPatients.push(patient);
              }
            }
          } catch (error) {
            console.error('Error parsing patient data from localStorage:', error);
          }
        }
      }
      
      // If no complete patient objects were found, reconstruct from individual fields
      if (loadedPatients.length === 0) {
        // Get all unique patient IDs
        const patientIds = new Set<string>();
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('patient_')) {
            const parts = key.split('_');
            if (parts.length >= 2) {
              patientIds.add(parts[1]);
            }
          }
        }
        
        // Reconstruct each patient
        patientIds.forEach(id => {
          try {
            const code = localStorage.getItem(`patient_${id}_code`);
            if (code) {
              const patient: Patient = {
                id: id,
                code: code,
                firstName: localStorage.getItem(`patient_${id}_firstName`) || "",
                lastName: localStorage.getItem(`patient_${id}_lastName`) || "",
                age: Number(localStorage.getItem(`patient_${id}_age`)) || 0,
                email: localStorage.getItem(`patient_${id}_email`) || "",
                phone: localStorage.getItem(`patient_${id}_phone`) || "",
                address: localStorage.getItem(`patient_${id}_address`) || "",
                sex: (localStorage.getItem(`patient_${id}_sex`) as 'Male' | 'Female') || undefined
              };
              
              // Store the complete patient object for future use
              localStorage.setItem(`patient_${id}`, JSON.stringify(patient));
              loadedPatients.push(patient);
            }
          } catch (error) {
            console.error('Error reconstructing patient data:', error);
          }
        });
      }
      
      setPatients(loadedPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  }, []);
  
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
    
    if (filterBy === 'age') {
      filteredPatients = filteredPatients.filter(
        patient => patient.age >= ageRange[0] && patient.age <= ageRange[1]
      );
      filteredPatients = filteredPatients.sort((a, b) => a.age - b.age);
    } else if (filterBy === 'address') {
      filteredPatients = filteredPatients.sort((a, b) => 
        a.address.localeCompare(b.address)
      );
    }
    
    return sortPatients(filteredPatients);
  };

  const displayedPatients = filterAndSortPatients();

  const handleFilterChange = (value: FilterBy) => {
    setFilterBy(value);
    if (value !== 'age') {
      setAgeRange([0, 100]); // Reset age range when switching to other filters
    }
  };

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
              <DropdownMenuRadioGroup value={filterBy} onValueChange={handleFilterChange}>
                <DropdownMenuRadioItem value="none">None</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="age">Age (Ascending)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="address">Address (A-Z)</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {filterBy === 'age' && (
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Age Range: {ageRange[0]} - {ageRange[1]} years</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={ageRange}
              onValueChange={setAgeRange}
              className="w-full"
            />
          </div>
        )}
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
                  No patients found. Use the import feature to add patients.
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
