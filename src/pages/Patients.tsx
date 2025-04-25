
import PatientList from '@/components/patients/PatientList';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleAddNewPatient = () => {
    navigate('/transactions/new'); // This will redirect to the new transaction page where they can add a patient
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Patients</h2>
          <p className="text-muted-foreground">Manage your patient records</p>
        </div>
        <Button onClick={handleAddNewPatient}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
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
