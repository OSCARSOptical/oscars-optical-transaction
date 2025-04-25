
import { generatePatientCode, normalizePatientCode } from '@/utils/patientUtils';

export const usePatientCode = () => {
  return { 
    generatePatientCode,
    normalizePatientCode
  };
};
