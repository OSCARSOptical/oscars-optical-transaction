
import PatientList from '@/components/patients/PatientList';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from 'react';

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Patients</h2>
        <p className="text-muted-foreground">Manage your patient records</p>
      </div>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search by Patient Name or Patient ID" 
          className="pl-9 w-full" 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
        />
      </div>
      <PatientList initialSearchQuery={searchQuery} />
    </div>
  );
};

export default Patients;
