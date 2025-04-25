
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
import { supabase } from "@/integrations/supabase/client";
import { normalizePatientCode } from "@/utils/patientUtils";

interface PatientSearchProps {
  onSelect: (patient: Patient) => void;
  onBack: () => void;
}

const PatientSearch = ({ onSelect, onBack }: PatientSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load patients from Supabase instead of using sample data
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) {
          throw error;
        }
        
        // Transform Supabase data structure to match our Patient type
        const formattedPatients: Patient[] = data.map(patient => ({
          id: patient.id,
          firstName: patient.first_name,
          lastName: patient.last_name,
          code: normalizePatientCode(patient.patient_code),
          age: patient.age || 0,
          email: patient.email || '',
          phone: patient.contact_number || '',
          address: patient.address || '',
          sex: patient.sex as 'Male' | 'Female' || 'Male'
        }));
        
        setResults(formattedPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setError("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const query = value.toLowerCase();
    
    if (!query) {
      // Re-fetch all patients if search is cleared
      const fetchPatients = async () => {
        try {
          setLoading(true);
          
          const { data, error } = await supabase
            .from('patients')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
            
          if (error) {
            throw error;
          }
          
          // Transform Supabase data structure to match our Patient type
          const formattedPatients: Patient[] = data.map(patient => ({
            id: patient.id,
            firstName: patient.first_name,
            lastName: patient.last_name,
            code: normalizePatientCode(patient.patient_code),
            age: patient.age || 0,
            email: patient.email || '',
            phone: patient.contact_number || '',
            address: patient.address || '',
            sex: patient.sex as 'Male' | 'Female' || 'Male'
          }));
          
          setResults(formattedPatients);
        } catch (error) {
          console.error("Error fetching patients:", error);
          setError("Failed to load patients");
        } finally {
          setLoading(false);
        }
      };
      
      fetchPatients();
      return;
    }

    // Search in Supabase
    const searchPatients = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,patient_code.ilike.%${query}%,email.ilike.%${query}%`)
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) {
          throw error;
        }
        
        // Transform Supabase data structure to match our Patient type
        const formattedPatients: Patient[] = data.map(patient => ({
          id: patient.id,
          firstName: patient.first_name,
          lastName: patient.last_name,
          code: normalizePatientCode(patient.patient_code),
          age: patient.age || 0,
          email: patient.email || '',
          phone: patient.contact_number || '',
          address: patient.address || '',
          sex: patient.sex as 'Male' | 'Female' || 'Male'
        }));
        
        setResults(formattedPatients);
      } catch (error) {
        console.error("Error searching patients:", error);
        setError("Failed to search patients");
      } finally {
        setLoading(false);
      }
    };
    
    searchPatients();
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

      {loading ? (
        <div className="text-center py-6">Loading patients...</div>
      ) : error ? (
        <div className="text-center py-6 text-red-500">{error}</div>
      ) : results.length === 0 ? (
        <div className="text-center py-6">No patients found</div>
      ) : (
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
              <TableRow key={patient.id}>
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
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default PatientSearch;
