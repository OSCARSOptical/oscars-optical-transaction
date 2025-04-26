
import { Patient } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const generatePatientCode = async (firstName: string, lastName: string): Promise<string> => {
  if (!firstName || !lastName) return '';

  const firstInitial = firstName.charAt(0).toUpperCase();
  
  // For compound last names (e.g., "dela Cruz"), only use the first part's initial
  const lastNameParts = lastName.split(' ');
  const lastInitial = lastNameParts[0].charAt(0).toUpperCase();
  
  const initials = `${firstInitial}${lastInitial}`;
  
  try {
    // Query Supabase for existing patient codes with the same initials
    const { data, error } = await supabase
      .from('patients')
      .select('patient_code')
      .like('patient_code', `PX-${initials}-%`);
      
    if (error) {
      console.error("Error fetching patient codes:", error);
      throw error;
    }
    
    // Find the highest sequence number from existing codes
    let maxSequence = 0;
    if (data && data.length > 0) {
      data.forEach(patient => {
        const match = patient.patient_code.match(/PX-[A-Z]{2}-(\d{7})/);
        if (match && match[1]) {
          const sequence = parseInt(match[1]);
          if (!isNaN(sequence) && sequence > maxSequence) {
            maxSequence = sequence;
          }
        }
      });
    }
    
    // Generate the next sequence number
    const nextSequence = (maxSequence + 1).toString().padStart(7, '0');
    return `PX-${initials}-${nextSequence}`;
    
  } catch (error) {
    console.error("Error generating patient code:", error);
    // Fallback to simple code generation
    return `PX-${initials}-0000001`;
  }
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
