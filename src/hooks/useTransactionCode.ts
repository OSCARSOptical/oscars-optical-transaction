
export const useTransactionCode = () => {
  const generateTransactionCode = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    
    const prefix = `TX${year}-${month}`;
    
    const existingCodes: string[] = [];
    
    const sampleTransactions = [
      { code: "TX25-04-00001" },
      { code: "TX25-04-00002" },
      { code: "TX25-04-00003" }
    ];
    
    sampleTransactions.forEach(tx => {
      existingCodes.push(tx.code);
    });
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`transaction_`) && key.endsWith('_code')) {
        const code = localStorage.getItem(key);
        if (code && code.startsWith(prefix) && !existingCodes.includes(code)) {
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
    return `${prefix}-${nextSequence}`;
  };

  // New function to normalize transaction codes
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
