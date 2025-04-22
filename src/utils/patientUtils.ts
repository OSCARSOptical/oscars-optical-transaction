
import { Patient } from '@/types';

export const generatePatientCode = (firstName: string, lastName: string, id: string): string => {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  const numericPart = id.slice(-7).padStart(7, '0');
  return `PX-${firstInitial}${lastInitial}-${numericPart}`;
};

export const filterPatients = (patients: Patient[], searchQuery: string) => {
  return patients.filter(patient => 
    patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    patient.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
};
