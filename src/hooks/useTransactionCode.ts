
export const useTransactionCode = () => {
  const generateTransactionCode = (transactionDate: Date = new Date()) => {
    const year = transactionDate.getFullYear().toString().slice(-2);
    const month = (transactionDate.getMonth() + 1).toString().padStart(2, "0");
    
    const prefix = `TX${year}-${month}`;
    
    // Track codes in localStorage for the specific month
    const existingCodes: string[] = [];
    
    // Check Supabase-stored transactions first (if we implemented this in the future)
    // For now, use localStorage as a fallback
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`transaction_`) && key.endsWith('_code')) {
        const code = localStorage.getItem(key);
        if (code && code.startsWith(prefix)) {
          existingCodes.push(code);
        }
      }
    }
    
    let maxSequence = 0;
    existingCodes.forEach(code => {
      const sequencePart = code.split('-')[2];
      if (sequencePart) {
        const sequence = parseInt(sequencePart);
        if (!isNaN(sequence) && sequence > maxSequence) {
          maxSequence = sequence;
        }
      }
    });
    
    const nextSequence = (maxSequence + 1).toString().padStart(5, "0");
    console.log(`Generated transaction code: ${prefix}-${nextSequence} for date: ${transactionDate}`);
    return `${prefix}-${nextSequence}`;
  };

  const normalizeTransactionCode = (code: string): string => {
    // Check if the code is already in the new format (TXXX-XX-XXXXX)
    if (code.match(/^TX\d{2}-\d{2}-\d{5}$/)) {
      return code;
    }
    
    // Handle legacy format (TXXX-XX-XXXX)
    const match = code.match(/^(TX\d{2}-\d{2}-)(\d+)$/);
    if (match) {
      const [, prefix, numericPart] = match;
      const paddedNumber = numericPart.padStart(5, '0');
      return `${prefix}${paddedNumber}`;
    }
    
    // If the format is completely different or invalid, return the original
    return code;
  };

  return { 
    generateTransactionCode,
    normalizeTransactionCode
  };
};
