import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import Papa from 'papaparse';
import { Patient, Transaction } from '@/types';
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
  const [duplicates, setDuplicates] = useState<Set<number>>(new Set());
  const [transactionGroups, setTransactionGroups] = useState<Record<string, number[]>>({});
  const [promotionalItems, setPromotionalItems] = useState<Set<number>>(new Set());
  const [importMode, setImportMode] = useState<'patient' | 'transaction'>('patient');
  const { toast } = useToast();
  const { normalizeTransactionCode, parseMultipleTransactionCodes } = useTransactionCode();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && (selectedFile.type === "text/csv" || selectedFile.name.endsWith('.csv'))) {
      setFile(selectedFile);
      setErrorMessage(null);
      setPreview([]);
      setEditableData([]);
      setTransactionGroups({});
      setPromotionalItems(new Set());
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
    }
  };

  const findColumn = (row: Record<string, string>, searchTerms: string[]): string => {
    console.log("Available headers:", Object.keys(row));
    
    for (const term of searchTerms) {
      const exactMatch = Object.keys(row).find(k => 
        k.toLowerCase() === term.toLowerCase()
      );
      
      if (exactMatch && row[exactMatch]?.trim()) {
        console.log(`Found exact match for "${term}": "${exactMatch}" = "${row[exactMatch]}"`);
        return row[exactMatch].trim();
      }
    }
    
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
      valid: hasId && hasName,
      missing: missingFields
    };
  };

  const checkDuplicates = (patients: Patient[]) => {
    const duplicateIndexes = new Set<number>();
    const existingPatients = new Set<string>();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('patient_')) {
        try {
          const patientData = JSON.parse(localStorage.getItem(key) || '');
          if (patientData && patientData.code) {
            existingPatients.add(patientData.code);
          }
        } catch (e) {
          console.error('Error parsing patient data:', e);
        }
      }
    }

    patients.forEach((patient, index) => {
      if (existingPatients.has(patient.code)) {
        duplicateIndexes.add(index);
      }
    });

    return duplicateIndexes;
  };

  const analyzeTransactions = (patients: Patient[]) => {
    const txGroups: Record<string, number[]> = {};
    const promoItems = new Set<number>();
    
    patients.forEach((patient, patientIndex) => {
      if (patient.transactions && patient.transactions.length > 0) {
        patient.transactions.forEach(txId => {
          const normalizedTxId = normalizeTransactionCode(txId);
          if (!txGroups[normalizedTxId]) {
            txGroups[normalizedTxId] = [];
          }
          txGroups[normalizedTxId].push(patientIndex);
        });
      }
    });
    
    Object.entries(txGroups).forEach(([txId, patientIndices]) => {
      if (patientIndices.length > 1) {
        const uniquePatientCodes = new Set(patientIndices.map(idx => patients[idx].code));
        
        if (uniquePatientCodes.size > 1) {
          console.log(`Transaction ${txId} shared between different patients - possible error`);
        } else {
          console.log(`Transaction ${txId} appears ${patientIndices.length} times for patient ${patients[patientIndices[0]].code} - potential promotional item`);
          
          for (let i = 1; i < patientIndices.length; i++) {
            promoItems.add(patientIndices[i]);
          }
        }
      }
    });
    
    return { txGroups, promoItems };
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
          
          console.log("CSV Headers:", Object.keys(data[0]));
          
          const hasRequiredFields = checkRequiredFields(data[0]);
          
          if (!hasRequiredFields.valid) {
            throw new Error(`Missing required fields: ${hasRequiredFields.missing.join(', ')}`);
          }
          
          const patients: Patient[] = data.map((row, index) => {
            const patientId = findColumn(row, [
              'Patient ID', 'ID', 'Code', 'Patient Code', 
              'patient id', 'id', 'code', 'patient code'
            ]);
            
            const patientName = findColumn(row, [
              'Patient Name', 'Name', 'Full Name', 'name', 
              'patient name', 'Patient', 'fullname', 'patient'
            ]);
            
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
              firstNameValue = firstName;
              lastNameValue = lastName;
              console.log(`Row ${index} - Using separate name fields:`, firstNameValue, lastNameValue);
            } else if (patientName) {
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

            const age = findColumn(row, [
              'Age', 'age', 'Years', 'years', 'year', 'Age (years)'
            ]);
            
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
            
            const recentTransaction = findColumn(row, [
              'Recent Transaction', 'Transaction', 'Last Transaction',
              'Transaction ID', 'transaction', 'Transaction Id',
              'Recent Transaction ID'
            ]);
            
            const transactionHistory = findColumn(row, [
              'Transaction History', 'History', 'Previous Transactions',
              'Past Transactions', 'transaction history', 'All Transactions',
              'Transactions'
            ]);
            
            const transactionDate = findColumn(row, [
              'Date of Recent Transaction', 'Transaction Date', 'Date',
              'date', 'Recent Date', 'Last Transaction Date'
            ]);
            
            const isPromo = findColumn(row, [
              'Promo', 'Promotion', 'Is Promotion', 'is promo',
              'Promotional', 'BOGO', 'Buy One Take One', 'Offer'
            ]).toLowerCase();
            
            const promoGroup = findColumn(row, [
              'Promo Group', 'Promotion Group', 'Group ID', 'group',
              'Related Transaction', 'Parent Transaction', 'Main Transaction'
            ]);
            
            const transactions: string[] = [];
            
            if (recentTransaction) {
              const normalizedCode = normalizeTransactionCode(recentTransaction);
              if (normalizedCode && !transactions.includes(normalizedCode)) {
                transactions.push(normalizedCode);
              }
            }
            
            if (transactionHistory) {
              const historyCodes = parseMultipleTransactionCodes(transactionHistory);
              historyCodes.forEach(code => {
                if (code && !transactions.includes(code)) {
                  transactions.push(code);
                }
              });
            }
            
            if (transactions.length === 0) {
              console.log(`Row ${index} - No transactions found`);
            }

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
              isPromotionalItem: isPromo === 'yes' || isPromo === 'true' || isPromo === '1' || isPromo === 'y',
              promotionalGroupId: promoGroup || null
            };
          });

          setPreview(patients);
          setEditableData([...patients]);
          
          const duplicatesFound = checkDuplicates(patients);
          setDuplicates(duplicatesFound);
          
          const { txGroups, promoItems } = analyzeTransactions(patients);
          setTransactionGroups(txGroups);
          setPromotionalItems(promoItems);
          
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

  const toggleImportMode = () => {
    setImportMode(prevMode => prevMode === 'patient' ? 'transaction' : 'patient');
  };

  const handleImport = (selectedData: Patient[]) => {
    if (selectedData.length === 0) return;

    try {
      selectedData.forEach(patient => {
        localStorage.setItem(`patient_${patient.id}`, JSON.stringify(patient));
      });

      toast({
        title: "Import successful",
        description: `Imported ${selectedData.length} patients`,
      });

      setFile(null);
      setPreview([]);
      setEditableData([]);
      setErrorMessage(null);
      setCsvHeaders([]);
      setRawData([]);
      setTransactionGroups({});
      setPromotionalItems(new Set());
      
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

  const markAsPromotionalItem = (index: number, isPromo: boolean) => {
    setEditableData(prevData => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        isPromotionalItem: isPromo
      };
      return newData;
    });
    
    if (isPromo) {
      setPromotionalItems(prev => {
        const newSet = new Set(prev);
        newSet.add(index);
        return newSet;
      });
    } else {
      setPromotionalItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const linkPromotionalItems = (indices: number[], groupId: string) => {
    setEditableData(prevData => {
      return prevData.map((patient, idx) => {
        if (indices.includes(idx)) {
          return {
            ...patient,
            promotionalGroupId: groupId,
            isPromotionalItem: indices.indexOf(idx) > 0
          };
        }
        return patient;
      });
    });
    
    const promoSet = new Set<number>();
    indices.forEach((idx, i) => {
      if (i > 0) promoSet.add(idx);
    });
    setPromotionalItems(promoSet);
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
    duplicates,
    transactionGroups,
    promotionalItems,
    importMode,
    handleFileChange,
    handleUpload,
    handleImport,
    toggleImportMode,
    markAsPromotionalItem,
    linkPromotionalItems
  };
};
