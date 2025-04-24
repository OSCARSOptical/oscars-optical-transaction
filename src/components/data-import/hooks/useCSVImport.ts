
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import Papa from 'papaparse';
import { Patient } from '@/types';
import { normalizePatientCode } from '@/utils/idNormalizer';

export const useCSVImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Patient[]>([]);
  const [editableData, setEditableData] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const { toast } = useToast();

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

  const findColumn = (row: Record<string, string>, searchTerms: string[]): string => {
    for (const term of searchTerms) {
      const key = Object.keys(row).find(k => 
        k.toLowerCase().includes(term.toLowerCase()) || 
        k.toLowerCase() === term.toLowerCase()
      );
      if (key && row[key]?.trim()) {
        console.log(`Found match for "${term}": "${key}" = "${row[key]}"`);
        return row[key].trim();
      }
    }
    return '';
  };

  const checkRequiredFields = (row: Record<string, string>) => {
    const missingFields: string[] = [];
    let hasId = false;
    let hasName = false;
    let hasAge = false;
    
    console.log("All headers in CSV:", Object.keys(row));

    if (Object.keys(row).some(header => 
      header.toLowerCase().includes('id') || 
      header.toLowerCase().includes('code'))) {
      hasId = true;
    } else {
      missingFields.push('id');
    }
    
    if (Object.keys(row).some(header => 
      header.toLowerCase().includes('name') ||
      header.toLowerCase() === 'patient' ||
      (
        Object.keys(row).some(h => h.toLowerCase().includes('first') || h.toLowerCase().includes('given')) &&
        Object.keys(row).some(h => h.toLowerCase().includes('last') || h.toLowerCase().includes('family') || h.toLowerCase().includes('surname'))
      )
    )) {
      hasName = true;
    } else {
      missingFields.push('name');
    }
    
    if (Object.keys(row).some(header => 
      header.toLowerCase().includes('age') || 
      header.toLowerCase().includes('years') ||
      header.toLowerCase().includes('birth'))) {
      hasAge = true;
    } else {
      missingFields.push('age');
    }
    
    return {
      valid: missingFields.length === 0 || (hasId && hasName),
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
          
          const hasRequiredFields = checkRequiredFields(data[0]);
          
          if (!hasRequiredFields.valid) {
            throw new Error(`Missing required fields: ${hasRequiredFields.missing.join(', ')}`);
          }
          
          const patients: Patient[] = data.map((row, index) => {
            const patientId = findColumn(row, ['Patient ID', 'ID', 'Code', 'Patient Code', 'patient id', 'id']);
            const patientName = findColumn(row, ['Patient Name', 'Name', 'Full Name', 'name', 'patient name', 'Patient']);
            const firstName = findColumn(row, ['First Name', 'Given Name', 'first name', 'First']);
            const lastName = findColumn(row, ['Last Name', 'Family Name', 'Surname', 'last name', 'Last']);
            
            let firstNameValue = '';
            let lastNameValue = '';
            
            if (firstName && lastName) {
              firstNameValue = firstName;
              lastNameValue = lastName;
            } else if (patientName) {
              const nameParts = patientName.trim().split(' ');
              if (nameParts.length >= 2) {
                lastNameValue = nameParts[nameParts.length - 1];
                firstNameValue = nameParts.slice(0, nameParts.length - 1).join(' ');
              } else {
                firstNameValue = patientName;
                lastNameValue = '';
              }
            }

            const age = findColumn(row, ['Age', 'age', 'Years', 'years']);
            const sex = findColumn(row, ['Sex', 'Gender', 'sex', 'gender']);
            const phone = findColumn(row, ['Contact', 'Phone', 'Mobile', 'Telephone', 'phone', 'contact', 'Contact Number', 'contact number', 'Cell', 'Number']);
            const address = findColumn(row, ['Address', 'Location', 'address', 'Addr', 'addr', 'Home Address']);
            const email = findColumn(row, ['Email', 'E-mail', 'email', 'Mail', 'mail']);
            
            const recentTransaction = findColumn(row, ['Recent Transaction', 'Transaction', 'Last Transaction']);
            const transactionDate = findColumn(row, ['Date of Recent Transaction', 'Transaction Date', 'Date']);
            
            return {
              id: crypto.randomUUID(),
              code: normalizePatientCode(patientId || `P${index + 1}`),
              firstName: firstNameValue,
              lastName: lastNameValue,
              age: parseInt(age) || 0,
              sex: sex?.trim()?.toLowerCase().startsWith('m') ? 'Male' : sex?.trim()?.toLowerCase().startsWith('f') ? 'Female' : 'Male',
              email: email || '',
              phone: phone || '',
              address: address || '',
              createdDate: transactionDate || new Date().toISOString(),
              originalFullName: patientName || `${firstNameValue} ${lastNameValue}`,
              originalData: {...row}
            } as Patient & { originalFullName: string; originalData: Record<string, string> };
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
