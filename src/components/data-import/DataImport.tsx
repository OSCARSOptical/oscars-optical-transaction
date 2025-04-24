
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { normalizePatientCode } from '@/utils/idNormalizer';
import { Input } from '@/components/ui/input';
import { Patient } from '@/types';
import Papa from 'papaparse';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, FileText, Upload } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export function DataImport() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Patient[]>([]);
  const [editableData, setEditableData] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
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
          
          // Save raw data and headers for debugging
          setRawData(data);
          setCsvHeaders(Object.keys(data[0]));
          console.log("CSV Headers:", Object.keys(data[0]));
          console.log("First row data:", data[0]);
          
          // More flexible column name matching with detailed logging
          const hasRequiredFields = checkRequiredFields(data[0]);
          
          if (!hasRequiredFields.valid) {
            throw new Error(`Missing required fields: ${hasRequiredFields.missing.join(', ')}`);
          }
          
          // Map CSV data to Patient objects with better handling
          const patients: Patient[] = data.map((row, index) => {
            // For patient ID/code
            const patientId = findColumn(row, ['Patient ID', 'ID', 'Code', 'Patient Code', 'patient id', 'id']);
            console.log(`Row ${index} - Found ID:`, patientId);
            
            // For patient name handling
            const patientName = findColumn(row, ['Patient Name', 'Name', 'Full Name', 'name', 'patient name', 'Patient']);
            const firstName = findColumn(row, ['First Name', 'Given Name', 'first name', 'First']);
            const lastName = findColumn(row, ['Last Name', 'Family Name', 'Surname', 'last name', 'Last']);
            
            console.log(`Row ${index} - Name info:`, { patientName, firstName, lastName });
            
            // Handle name splitting depending on what's available
            let firstNameValue = '';
            let lastNameValue = '';
            
            if (firstName && lastName) {
              // If first and last name are provided separately
              firstNameValue = firstName;
              lastNameValue = lastName;
            } else if (patientName) {
              // Need smarter name splitting
              const nameParts = patientName.trim().split(' ');
              if (nameParts.length >= 2) {
                // Last word is the last name, everything else is first name
                lastNameValue = nameParts[nameParts.length - 1];
                firstNameValue = nameParts.slice(0, nameParts.length - 1).join(' ');
              } else {
                firstNameValue = patientName;
                lastNameValue = '';
              }
            }

            // Find other fields
            const age = findColumn(row, ['Age', 'age', 'Years', 'years']);
            const sex = findColumn(row, ['Sex', 'Gender', 'sex', 'gender']);
            const phone = findColumn(row, ['Contact', 'Phone', 'Mobile', 'Telephone', 'phone', 'contact', 'Contact Number', 'contact number', 'Cell', 'Number']);
            const address = findColumn(row, ['Address', 'Location', 'address', 'Addr', 'addr', 'Home Address']);
            const email = findColumn(row, ['Email', 'E-mail', 'email', 'Mail', 'mail']);
            
            // Additional transaction-related fields (for future use)
            const recentTransaction = findColumn(row, ['Recent Transaction', 'Transaction', 'Last Transaction']);
            const transactionDate = findColumn(row, ['Date of Recent Transaction', 'Transaction Date', 'Date']);
            const transactionHistory = findColumn(row, ['Transaction History', 'History']);
            
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
              originalData: {...row} // Store original data for reference
            } as Patient & { originalFullName: string; originalData: Record<string, string> };
          });

          setPreview(patients);
          setEditableData([...patients]);
          setIsLoading(false);
          setErrorMessage(null);
        } catch (error: any) {
          console.error('CSV processing error:', error);
          setErrorMessage(error.message || "Please check the file format and try again");
          setIsLoading(false);
        }
      },
      error: (error) => {
        console.error('PapaParse error:', error);
        setErrorMessage("Could not parse the CSV file. Please check the format and try again.");
        setIsLoading(false);
      }
    });
  };

  // Helper function to check if required fields exist, with more detailed logging
  const checkRequiredFields = (row: Record<string, string>) => {
    const missingFields: string[] = [];
    let hasId = false;
    let hasName = false;
    let hasAge = false;
    
    // Output all headers for debugging
    console.log("All headers in CSV:", Object.keys(row));

    // Check for id field
    if (Object.keys(row).some(header => 
      header.toLowerCase().includes('id') || 
      header.toLowerCase().includes('code'))) {
      hasId = true;
      console.log("Found ID field:", Object.keys(row).find(h => 
        h.toLowerCase().includes('id') || h.toLowerCase().includes('code')));
    } else {
      missingFields.push('id');
      console.log("Missing ID field");
    }
    
    // Check for name field
    if (Object.keys(row).some(header => 
      header.toLowerCase().includes('name') ||
      header.toLowerCase() === 'patient' ||
      (
        Object.keys(row).some(h => h.toLowerCase().includes('first') || h.toLowerCase().includes('given')) &&
        Object.keys(row).some(h => h.toLowerCase().includes('last') || h.toLowerCase().includes('family') || h.toLowerCase().includes('surname'))
      )
    )) {
      hasName = true;
      const nameField = Object.keys(row).find(h => 
        h.toLowerCase().includes('name') || h.toLowerCase() === 'patient');
      console.log("Found name field:", nameField);
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
      console.log("Found age field:", Object.keys(row).find(h => 
        h.toLowerCase().includes('age') || h.toLowerCase().includes('years')));
    } else {
      missingFields.push('age');
      console.log("Missing age field");
    }
    
    return {
      valid: missingFields.length === 0 || (hasId && hasName), // We'll be more lenient - require at least ID and name
      missing: missingFields
    };
  };

  // Helper function to find column values with more logging
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

  const handleEdit = (index: number) => {
    setCurrentPatient({...editableData[index]});
    setCurrentIndex(index);
    setEditDialogOpen(true);
  };

  const saveEdit = () => {
    if (currentPatient && currentIndex >= 0) {
      const updatedData = [...editableData];
      updatedData[currentIndex] = currentPatient;
      setEditableData(updatedData);
      setEditDialogOpen(false);
    }
  };

  const handleNameChange = (value: string, field: 'firstName' | 'lastName') => {
    if (currentPatient) {
      setCurrentPatient({
        ...currentPatient,
        [field]: value
      });
    }
  };

  const handleImport = () => {
    if (editableData.length === 0) return;

    try {
      // Store patients in localStorage
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

  // Debug function to show raw data for inspection
  const showRawData = () => {
    if (rawData.length === 0) return null;
    
    return (
      <Dialog>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Raw CSV Data</DialogTitle>
            <DialogDescription>
              This is the raw data parsed from your CSV file
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {csvHeaders.map(header => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rawData.slice(0, 5).map((row, i) => (
                  <TableRow key={i}>
                    {csvHeaders.map(header => (
                      <TableCell key={`${i}-${header}`}>{row[header]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Patient Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Choose CSV File</label>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="max-w-sm"
          />
          <p className="text-sm text-muted-foreground">
            Your CSV should contain at least patient name and patient ID columns
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleUpload} 
            disabled={!file || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? "Processing..." : 
              <>
                <FileText className="h-4 w-4" />
                Preview Data
              </>
            }
          </Button>
          
          <Button 
            onClick={handleImport} 
            disabled={editableData.length === 0}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import Data
          </Button>
        </div>
        
        {csvHeaders.length > 0 && (
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Detected columns:</p>
            <div className="flex flex-wrap gap-2">
              {csvHeaders.map(header => (
                <Badge key={header} variant="outline">{header}</Badge>
              ))}
            </div>
          </div>
        )}

        {errorMessage && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {editableData.length > 0 && (
          <div className="border rounded-md shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Sex</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {editableData.map((patient, index) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.code}</TableCell>
                    <TableCell>{patient.firstName}</TableCell>
                    <TableCell>{patient.lastName}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.sex}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(index)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Patient</DialogTitle>
              <DialogDescription>
                Make changes to patient information below. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            
            {currentPatient && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Original Name:</label>
                  <div className="col-span-3 font-medium text-gray-600">
                    {(currentPatient as any).originalFullName || `${currentPatient.firstName} ${currentPatient.lastName}`}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="firstName" className="text-right text-sm">First Name:</label>
                  <Input
                    id="firstName"
                    value={currentPatient.firstName}
                    onChange={(e) => handleNameChange(e.target.value, 'firstName')}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="lastName" className="text-right text-sm">Last Name:</label>
                  <Input
                    id="lastName"
                    value={currentPatient.lastName}
                    onChange={(e) => handleNameChange(e.target.value, 'lastName')}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="patientCode" className="text-right text-sm">Patient Code:</label>
                  <Input
                    id="patientCode"
                    value={currentPatient.code}
                    onChange={(e) => currentPatient && setCurrentPatient({
                      ...currentPatient, 
                      code: e.target.value
                    })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="age" className="text-right text-sm">Age:</label>
                  <Input
                    id="age"
                    type="number"
                    value={currentPatient.age}
                    onChange={(e) => currentPatient && setCurrentPatient({
                      ...currentPatient,
                      age: parseInt(e.target.value) || 0
                    })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="sex" className="text-right text-sm">Sex:</label>
                  <select 
                    id="sex"
                    value={currentPatient.sex}
                    onChange={(e) => currentPatient && setCurrentPatient({
                      ...currentPatient,
                      sex: e.target.value as 'Male' | 'Female'
                    })}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="phone" className="text-right text-sm">Phone:</label>
                  <Input
                    id="phone"
                    value={currentPatient.phone}
                    onChange={(e) => currentPatient && setCurrentPatient({
                      ...currentPatient,
                      phone: e.target.value
                    })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right text-sm">Email:</label>
                  <Input
                    id="email"
                    value={currentPatient.email}
                    onChange={(e) => currentPatient && setCurrentPatient({
                      ...currentPatient,
                      email: e.target.value
                    })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="address" className="text-right text-sm">Address:</label>
                  <Input
                    id="address"
                    value={currentPatient.address}
                    onChange={(e) => currentPatient && setCurrentPatient({
                      ...currentPatient,
                      address: e.target.value
                    })}
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button type="button" onClick={() => setEditDialogOpen(false)} variant="outline">Cancel</Button>
              <Button type="button" onClick={saveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
