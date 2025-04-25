
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

  // Enhanced function to normalize transaction codes
  const normalizeTransactionCode = (code: string): string => {
    // If empty or undefined
    if (!code || code.trim() === '') {
      return '';
    }
    
    // Check if the code is already in the new format (TXXX-XX-XXXXX)
    if (code.match(/^TX\d{2}-\d{2}-\d{5}$/)) {
      return code;
    }
    
    // Handle format without leading zeros in sequence number (TXXX-XX-XXX)
    const match = code.match(/^(TX\d{2}-\d{2}-?)(\d+)$/);
    if (match) {
      const [, prefix, numericPart] = match;
      // Ensure prefix ends with a hyphen
      const correctedPrefix = prefix.endsWith('-') ? prefix : `${prefix}-`;
      const paddedNumber = numericPart.padStart(5, '0');
      return `${correctedPrefix}${paddedNumber}`;
    }
    
    // If it has no hyphens but starts with TX (e.g., TX250400001)
    const noHyphensMatch = code.match(/^TX(\d{2})(\d{2})(\d+)$/);
    if (noHyphensMatch) {
      const [, year, month, numericPart] = noHyphensMatch;
      const paddedNumber = numericPart.padStart(5, '0');
      return `TX${year}-${month}-${paddedNumber}`;
    }
    
    // If the format is completely different, return as is
    return code;
  };
  
  // Function to split multiple transaction IDs (for transaction history)
  const parseMultipleTransactionCodes = (transactionsStr: string): string[] => {
    if (!transactionsStr || transactionsStr.trim() === '') {
      return [];
    }
    
    // Split by common delimiters (semicolon, comma)
    const rawCodes = transactionsStr.split(/[;,]/).map(code => code.trim()).filter(Boolean);
    
    // Normalize each transaction code
    return rawCodes.map(code => normalizeTransactionCode(code));
  };

  return { 
    generateTransactionCode,
    normalizeTransactionCode,
    parseMultipleTransactionCodes
  };
};
