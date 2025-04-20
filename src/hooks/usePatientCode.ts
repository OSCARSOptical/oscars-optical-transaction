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

  return { generatePatientCode };
};
