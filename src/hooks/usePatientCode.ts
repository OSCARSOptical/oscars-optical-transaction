
export const usePatientCode = () => {
  const generatePatientCode = (firstName: string, lastName: string, existingCode?: string) => {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    
    // Keep the same sequence number if it exists, otherwise generate a new one
    const sequencePart = existingCode && existingCode.includes('-') ? 
                         existingCode.split('-')[2] : 
                         "0000001";
    
    return `PX-${firstInitial}${lastInitial}-${sequencePart}`;
  };
  
  // New function to handle legacy patient codes
  const normalizePatientCode = (code: string): string => {
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

  return { 
    generatePatientCode,
    normalizePatientCode
  };
};
