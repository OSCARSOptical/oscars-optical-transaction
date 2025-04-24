
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { filterPatients } from '@/utils/patientUtils';
import PatientTableRow from './PatientTableRow';
import { getPatients } from '@/data/storageData';

interface PatientListProps {
  initialSearchQuery?: string;
}

export default function PatientList({ initialSearchQuery = '' }: PatientListProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filteredPatients, setFilteredPatients] = useState(getPatients());
  const navigate = useNavigate();

  useEffect(() => {
    const patients = getPatients();
    setFilteredPatients(filterPatients(patients, searchQuery));
  }, [searchQuery]);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/20 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                ID
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Name
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Sex
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Age
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Phone
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {filteredPatients.length === 0 ? (
              <tr className="border-b transition-colors hover:bg-muted/20 data-[state=selected]:bg-muted">
                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                  No patients found
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient) => (
                <PatientTableRow key={patient.id} patient={patient} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2 p-4">
        <Button
          onClick={() => navigate('/patients/new')}
        >
          Add New Patient
        </Button>
      </div>
    </div>
  );
}
