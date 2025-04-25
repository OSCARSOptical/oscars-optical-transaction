import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import Papa from 'papaparse';
import { Patient } from '@/types';
import { normalizePatientCode } from '@/utils/idNormalizer';
import { useTransactionCode } from '@/hooks/useTransactionCode';

export const useCSVImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Patient[]>([]);
  const [editableData, setEditableData] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const { toast } = useToast();
  const { normalizeTransactionCode, parseMultipleTransactionCodes } = useTransactionCode();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && (selectedFile.type === "text/csv" || selectedFile.name.endsWith('.csv'))) {
      setFile(selectedFile);
      setErrorMessage(null);
      setPreview([]);
      setEditableData([]);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
    }
  };

  // Improved column detection function
  const findColumn = (row: Record<string, string>, searchTerms: string[]): string => {
    // Log the available headers for debugging
    console.log("Available headers:", Object.keys(row));
    
    // First try exact matches (case-insensitive)
    for (const term of searchTerms) {
      const exactMatch = Object.keys(row).find(k => 
        k.toLowerCase() === term.toLowerCase()
      );
      
      if (exactMatch && row[exactMatch]?.trim()) {
        console.log(`Found exact match for "${term}": "${exactMatch}" = "${row[exactMatch]}"`);
        return row[exactMatch].trim();
      }
    }
    
    // Then try partial matches
    for (const term of searchTerms) {
      const partialMatch = Object.keys(row).find(k => 
        k.toLowerCase().includes(term.toLowerCase())
      );
      
      if (partialMatch && row[partialMatch]?.trim()) {
        console.log(`Found partial match for "${term}": "${partialMatch}" = "${row[partialMatch]}"`);
        return row[partialMatch].trim();
      }
    }
    
    console.log(`No match found for search terms: ${searchTerms.join(", ")}`);
    return '';
  };

  const checkRequiredFields = (row: Record<string, string>) => {
    const missingFields: string[] = [];
    let hasId = false;
    let hasName = false;
    let hasAge = false;
    
    console.log("Checking required fields in headers:", Object.keys(row));

    // Check for ID field
    if (Object.keys(row).some(header => 
      header.toLowerCase().includes('id') || 
      header.toLowerCase().includes('code') || 
      header.toLowerCase().includes('patient id') || 
      header.toLowerCase().includes('patient code'))) {
      hasId = true;
      console.log("Found ID field");
    } else {
      missingFields.push('id');
      console.log("Missing ID field");
    }
    
    // Check for name field
    if (Object.keys(row).some(header => 
      header.toLowerCase().includes('name') ||
      header.toLowerCase() === 'patient' ||
      header.toLowerCase().includes('patient name') ||
      (
        Object.keys(row).some(h => h.toLowerCase().includes('first') || h.toLowerCase().includes('given')) &&
        Object.keys(row).some(h => h.toLowerCase().includes('last') || h.toLowerCase().includes('family') || h.toLowerCase().includes('surname'))
      )
    )) {
      hasName = true;
      console.log("Found name field");
    } else {
      missingFields.push('name');
      console.log("Missing name field");
    }
    
    // Check for age field
    if (Object.keys(row).some(header => 
      header.toLowerCase().includes('age') || 
      header.toLowerCase().includes('years') ||
      header.toLowerCase().includes('birth'))) {
      hasAge = true;
      console.log("Found age field");
    } else {
      missingFields.push('age');
      console.log("Missing age field");
    }
    
    return {
      valid: hasId && hasName, // We'll make age optional
      missing: missingFields
    };
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setErrorMessage(null);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.errors && results.errors.length > 0) {
            throw new Error(`Parse error: ${results.errors[0].message}`);
          }
          
          const data = results.data as Record<string, string>[];
          
          if (data.length === 0) {
            throw new Error("The CSV file appears to be empty");
          }
          
          setRawData(data);
          setCsvHeaders(Object.keys(data[0]));
          
          // Log headers for debugging
          console.log("CSV Headers:", Object.keys(data[0]));
          
          const hasRequiredFields = checkRequiredFields(data[0]);
          
          if (!hasRequiredFields.valid) {
            throw new Error(`Missing required fields: ${hasRequiredFields.missing.join(', ')}`);
          }
          
          const patients: Patient[] = data.map((row, index) => {
            // Look for Patient ID with various possible column names
            const patientId = findColumn(row, [
              'Patient ID', 'ID', 'Code', 'Patient Code', 
              'patient id', 'id', 'code', 'patient code'
            ]);
            
            console.log(`Row ${index} - Found patient ID:`, patientId);
            
            // Look for patient name with various possible column names
            const patientName = findColumn(row, [
              'Patient Name', 'Name', 'Full Name', 'name', 
              'patient name', 'Patient', 'fullname', 'patient'
            ]);
            
            console.log(`Row ${index} - Found patient name:`, patientName);
            
            // Try to find first and last name separately if they exist
            const firstName = findColumn(row, [
              'First Name', 'Given Name', 'first name', 
              'First', 'firstname', 'given name'
            ]);
            
            const lastName = findColumn(row, [
              'Last Name', 'Family Name', 'Surname', 'last name',
              'Last', 'lastname', 'surname'
            ]);
            
            let firstNameValue = '';
            let lastNameValue = '';
            
            if (firstName && lastName) {
              // Use separate first/last name columns if available
              firstNameValue = firstName;
              lastNameValue = lastName;
              console.log(`Row ${index} - Using separate name fields:`, firstNameValue, lastNameValue);
            } else if (patientName) {
              // Split full name into parts
              const nameParts = patientName.trim().split(' ');
              if (nameParts.length >= 2) {
                lastNameValue = nameParts[nameParts.length - 1];
                firstNameValue = nameParts.slice(0, nameParts.length - 1).join(' ');
              } else {
                firstNameValue = patientName;
                lastNameValue = '';
              }
              console.log(`Row ${index} - Split patient name:`, firstNameValue, lastNameValue);
            }

            // Find age in various formats
            const age = findColumn(row, [
              'Age', 'age', 'Years', 'years', 'year', 'Age (years)'
            ]);
            
            console.log(`Row ${index} - Found age:`, age);
            
            // Find other fields
            const sex = findColumn(row, [
              'Sex', 'Gender', 'sex', 'gender'
            ]);
            
            const phone = findColumn(row, [
              'Contact', 'Phone', 'Mobile', 'Telephone', 'phone', 
              'contact', 'Contact Number', 'contact number', 'Cell', 
              'Number', 'Cellphone', 'Contact No.', 'Phone No.'
            ]);
            
            const address = findColumn(row, [
              'Address', 'Location', 'address', 'Addr', 
              'addr', 'Home Address', 'location'
            ]);
            
            const email = findColumn(row, [
              'Email', 'E-mail', 'email', 'Mail', 'mail', 'e-mail'
            ]);
            
            // TRANSACTION DATA EXTRACTION
            // Look for transaction ID in various formats
            const recentTransaction = findColumn(row, [
              'Recent Transaction', 'Transaction', 'Last Transaction',
              'Transaction ID', 'transaction', 'Transaction Id',
              'Recent Transaction ID'
            ]);
            
            // Look for transaction history (multiple transactions)
            const transactionHistory = findColumn(row, [
              'Transaction History', 'History', 'Previous Transactions',
              'Past Transactions', 'transaction history', 'All Transactions',
              'Transactions'
            ]);
            
            // Look for transaction date
            const transactionDate = findColumn(row, [
              'Date of Recent Transaction', 'Transaction Date', 'Date',
              'date', 'Recent Date', 'Last Transaction Date'
            ]);
            
            console.log(`Row ${index} - Found transactions:`, {
              recent: recentTransaction,
              history: transactionHistory,
              date: transactionDate
            });
            
            // Normalize and collect all transaction IDs
            const transactions: string[] = [];
            
            // Add recent transaction if it exists
            if (recentTransaction) {
              const normalizedCode = normalizeTransactionCode(recentTransaction);
              if (normalizedCode && !transactions.includes(normalizedCode)) {
                transactions.push(normalizedCode);
              }
            }
            
            // Add transaction history if it exists
            if (transactionHistory) {
              const historyCodes = parseMultipleTransactionCodes(transactionHistory);
              historyCodes.forEach(code => {
                if (code && !transactions.includes(code)) {
                  transactions.push(code);
                }
              });
            }
            
            // Generate placeholder transaction if none found
            if (transactions.length === 0) {
              console.log(`Row ${index} - No transactions found`);
            }

            // Use a default code sequence if ID is missing
            const finalPatientId = patientId || `PX${index + 1}`;
            
            return {
              id: crypto.randomUUID(),
              code: normalizePatientCode(finalPatientId),
              firstName: firstNameValue,
              lastName: lastNameValue,
              age: parseInt(age) || 0,
              sex: sex?.trim()?.toLowerCase().startsWith('m') ? 'Male' : sex?.trim()?.toLowerCase().startsWith('f') ? 'Female' : 'Male',
              email: email || '',
              phone: phone || '',
              address: address || '',
              createdDate: transactionDate || new Date().toISOString(),
              transactions: transactions,
              originalData: {...row}
            } as Patient & { originalData: Record<string, string> };
          });

          setPreview(patients);
          setEditableData([...patients]);
          setErrorMessage(null);
        } catch (error: any) {
          console.error('CSV processing error:', error);
          setErrorMessage(error.message || "Please check the file format and try again");
        }
        setIsLoading(false);
      },
      error: (error) => {
        console.error('PapaParse error:', error);
        setErrorMessage("Could not parse the CSV file. Please check the format and try again.");
        setIsLoading(false);
      }
    });
  };

  const handleImport = () => {
    if (editableData.length === 0) return;

    try {
      editableData.forEach(patient => {
        localStorage.setItem(`patient_${patient.id}`, JSON.stringify(patient));
      });

      toast({
        title: "Import successful",
        description: `Imported ${editableData.length} patients`,
      });

      // Reset state
      setFile(null);
      setPreview([]);
      setEditableData([]);
      setErrorMessage(null);
      setCsvHeaders([]);
      setRawData([]);
      
      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "There was an error saving the patient data",
        variant: "destructive",
      });
    }
  };

  return {
    file,
    preview,
    editableData,
    setEditableData,
    isLoading,
    errorMessage,
    csvHeaders,
    rawData,
    handleFileChange,
    handleUpload,
    handleImport
  };
};
