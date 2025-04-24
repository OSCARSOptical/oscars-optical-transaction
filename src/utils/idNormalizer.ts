
// Function to normalize patient code from legacy format (PX-XX00000) to new format (PX-XX-0000000)
export const normalizePatientCode = (code: string): string => {
  // Check if already in new format
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

  return code;
};

// Function to normalize transaction code from legacy format (TXXX-XX-0000) to new format (TXXX-XX-00000)
export const normalizeTransactionCode = (code: string): string => {
  // Check if already in new format
  if (code.match(/^TX\d{2}-\d{2}-\d{5}$/)) {
    return code;
  }

  // Handle legacy format (TXXX-XX-0000)
  const match = code.match(/^(TX\d{2}-\d{2}-)(\d+)$/);
  if (match) {
    const [, prefix, numericPart] = match;
    const paddedNumber = numericPart.padStart(5, '0');
    return `${prefix}${paddedNumber}`;
  }

  return code;
};
