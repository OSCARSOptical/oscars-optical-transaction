
import { Patient } from '@/types';

export const generatePatientCode = (firstName: string, lastName: string, id: string): string => {
  const firstInitial = firstName.charAt(0).toUpperCase();
  
  // For compound last names (e.g., "dela Cruz"), only use the first part's initial
  const lastNameParts = lastName.split(' ');
  const lastInitial = lastNameParts[0].charAt(0).toUpperCase();
  
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

// New utility functions to handle legacy ID formats
export const normalizePatientCode = (code: string): string => {
  // Check if the code is already in the new format (PX-XX-0000000)
  if (code.match(/^PX-[A-Z]{2}-\d{7}$/)) {
    return code;
  }
  
  // Handle legacy format (PX-XX00000)
  const match = code.match(/^PX-([A-Z]{2})(\d+)$/);
  if (match) {
    const [, initials, numericPart] = match;
    const paddedNumber = numericPart.padStart(7, '0');
    return `PX-${initials}-${paddedNumber}`;
  }
  
  // If the format is completely different or invalid, return the original
  return code;
};

// Function to prepare patient data for import
export const preparePatientForImport = (patient: any): Patient => {
  return {
    ...patient,
    code: normalizePatientCode(patient.code)
  };
};
