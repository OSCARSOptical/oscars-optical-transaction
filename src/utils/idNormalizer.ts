
export function normalizePatientCode(code: string): string {
  // If empty or undefined
  if (!code || code.trim() === '') {
    return `PX-PT-${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`;
  }

  // Check if the code is already in the new format (PX-XX-0000000)
  if (code.match(/^PX-[A-Z]{2}-\d{7}$/)) {
    return code;
  }
  
  // Handle legacy format without hyphen (PX-XX00000)
  const match = code.match(/^PX-([A-Z]{2})(\d+)$/);
  if (match) {
    const [, initials, numericPart] = match;
    const paddedNumber = numericPart.padStart(7, '0');
    return `PX-${initials}-${paddedNumber}`;
  }
  
  // Handle formats like just PX-12345 (no initials)
  const simpleMatch = code.match(/^PX-(\d+)$/);
  if (simpleMatch) {
    const [, numericPart] = simpleMatch;
    return `PX-PT-${numericPart.padStart(7, '0')}`;
  }
  
  // If only numeric format is provided (just numbers)
  if (code.match(/^\d+$/)) {
    return `PX-PT-${code.padStart(7, '0')}`;
  }
  
  // If the format is completely different or invalid, return with a placeholder format
  return code.startsWith('PX-') ? code : `PX-PT-${code.replace(/\D/g, '').padStart(7, '0') || Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`;
}
